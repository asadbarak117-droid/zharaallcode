const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const router = express.Router();

const Accounting = require("../moduls/Accounting");
const AccountingTable = require("../moduls/AccountingTable");

const validCurrency = (currency) => ["AFN", "USD", "PLN"].includes(currency);

const validDate = (date) =>
  typeof date === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  !Number.isNaN(Date.parse(`${date}T00:00:00Z`));

const validId = (id) =>
  typeof id === "string" && id.length > 0 && id.length <= 150;

const numericFields = [
  "quantityPurchased",
  "quantitySold",
  "purchasePrice",
  "sellingPrice",
  "shippingCost",
  "otherCosts",
  "discountValue",
];

function validateNumbers(body) {
  for (const field of numericFields) {
    if (body[field] !== undefined) {
      if (
        body[field] === "" ||
        !Number.isFinite(Number(body[field])) ||
        Number(body[field]) < 0
      ) {
        return `Invalid value for ${field}.`;
      }
    }
  }

  return null;
}

function validateQuantities(purchased, sold) {
  return Number(sold || 0) <= Number(purchased || 0);
}

// GET ALL TABLES
router.get("/tables", async (req, res) => {
  try {
    const currency = req.query.currency || "AFN";
    const term = String(req.query.search || "")
      .trim()
      .toLowerCase();

    if (!validCurrency(currency)) {
      return res.status(400).json({ message: "Invalid currency." });
    }

    const savedTables = await AccountingTable.find({ currency })
      .sort({ createdAt: -1 })
      .lean();

    const tables = await Promise.all(
      savedTables.map(async (table) => {
        const rows = await Accounting.find({
          tableId: table.tableId,
        })
          .sort({ createdAt: 1 })
          .lean();

        return {
          ...table,
          rows,
        };
      }),
    );

    const filteredTables = tables.filter((table) => {
      if (!term) return true;

      return (
        table.tableName.toLowerCase().includes(term) ||
        table.date.includes(term) ||
        table.rows.some((row) =>
          String(row.productName || "")
            .toLowerCase()
            .includes(term),
        )
      );
    });

    // Include old records whose table documents do not yet exist.
    const oldRecords = await Accounting.find({ currency })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const knownIds = new Set(savedTables.map((table) => table.tableId));
    const legacyGroups = new Map();

    for (const row of oldRecords) {
      const id = row.tableId || `legacy-${row._id}`;

      if (knownIds.has(id)) continue;

      if (!legacyGroups.has(id)) {
        legacyGroups.set(id, {
          tableId: id,
          tableName: row.tableName || "Older Records",
          date: row.date || "",
          currency,
          rows: [],
          legacy: true,
        });
      }

      const group = legacyGroups.get(id);
      group.rows.push(row);

      if (row.date && row.date > group.date) {
        group.date = row.date;
      }
    }

    const legacyTables = [...legacyGroups.values()].filter((table) => {
      if (!term) return true;

      return (
        table.tableName.toLowerCase().includes(term) ||
        table.date.includes(term) ||
        table.rows.some((row) =>
          String(row.productName || "")
            .toLowerCase()
            .includes(term),
        )
      );
    });

    res.json({
      tables: [...filteredTables, ...legacyTables],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE AND SAVE TABLE
router.post("/tables", async (req, res) => {
  try {
    const tableName = String(req.body.tableName || "").trim();
    const date = req.body.date;
    const currency = req.body.currency || "AFN";

    if (!tableName) {
      return res.status(400).json({
        message: "Table name is required.",
      });
    }

    if (!validDate(date)) {
      return res.status(400).json({
        message: "A valid date is required.",
      });
    }

    if (!validCurrency(currency)) {
      return res.status(400).json({
        message: "Invalid currency.",
      });
    }

    const table = await AccountingTable.create({
      tableId: crypto.randomUUID(),
      tableName,
      date,
      currency,
    });

    res.status(201).json({
      table: {
        tableId: table.tableId,
        tableName: table.tableName,
        date: table.date,
        currency: table.currency,
        rows: [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE TABLE AND ITS ROWS
router.get("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    if (!validId(tableId)) {
      return res.status(400).json({ message: "Invalid table ID." });
    }

    const table = await AccountingTable.findOne({ tableId }).lean();

    const rows = await Accounting.find({ tableId })
      .sort({ createdAt: 1 })
      .lean();

    // Also allow existing legacy table IDs.
    if (!table && rows.length === 0) {
      return res.status(404).json({ message: "Table not found." });
    }

    res.json({ table: table || null, rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TABLE NAME, DATE, OR CURRENCY
router.put("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    const table = await AccountingTable.findOne({ tableId });

    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    if (req.body.tableName !== undefined) {
      const name = String(req.body.tableName).trim();

      if (!name) {
        return res.status(400).json({
          message: "Table name is required.",
        });
      }

      table.tableName = name;
    }

    if (req.body.date !== undefined) {
      if (!validDate(req.body.date)) {
        return res.status(400).json({
          message: "A valid date is required.",
        });
      }

      table.date = req.body.date;
    }

    if (req.body.currency !== undefined) {
      if (!validCurrency(req.body.currency)) {
        return res.status(400).json({
          message: "Invalid currency.",
        });
      }

      table.currency = req.body.currency;
    }

    await table.save();

    await Accounting.updateMany(
      { tableId },
      {
        $set: {
          tableName: table.tableName,
          date: table.date,
          currency: table.currency,
        },
      },
    );

    res.json({ table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE ACCOUNTING ROW
router.post("/", async (req, res) => {
  try {
    const tableId = String(req.body.tableId || "");
    const productName = String(req.body.productName || "").trim();

    if (!tableId || !productName) {
      return res.status(400).json({
        message: "Table and product name are required.",
      });
    }

    const errorMessage = validateNumbers(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const table = await AccountingTable.findOne({ tableId });

    if (!table) {
      return res.status(404).json({
        message: "Saved table not found. Create the table first.",
      });
    }

    const currency = table.currency;

    if (req.body.currency !== undefined && req.body.currency !== currency) {
      return res.status(400).json({
        message: "The row currency must match the table currency.",
      });
    }

    const purchased = Number(req.body.quantityPurchased || 0);
    const sold = Number(req.body.quantitySold || 0);

    if (!validateQuantities(purchased, sold)) {
      return res.status(400).json({
        message: "Sold quantity cannot exceed purchased quantity.",
      });
    }

    const discountType = req.body.discountType || "amount";

    if (!["amount", "percent"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type.",
      });
    }

    const row = await Accounting.create({
      tableId,
      tableName: table.tableName,
      date: table.date,
      productName,
      quantityPurchased: purchased,
      quantitySold: sold,
      purchasePrice: Number(req.body.purchasePrice || 0),
      sellingPrice: Number(req.body.sellingPrice || 0),
      shippingCost: Number(req.body.shippingCost || 0),
      otherCosts: Number(req.body.otherCosts || 0),
      discountType,
      discountValue: Number(req.body.discountValue || 0),
      currency,
      notes: String(req.body.notes || ""),
    });

    res.status(201).json({ row });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE ACCOUNTING ROW
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID." });
    }

    const row = await Accounting.findById(req.params.id);

    if (!row) {
      return res.status(404).json({ message: "Record not found." });
    }

    const errorMessage = validateNumbers(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const allowed = [
      "productName",
      "quantityPurchased",
      "quantitySold",
      "purchasePrice",
      "sellingPrice",
      "shippingCost",
      "otherCosts",
      "discountType",
      "discountValue",
      "notes",
    ];

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        row[field] =
          field === "productName"
            ? String(req.body[field]).trim()
            : field === "notes"
              ? String(req.body[field])
              : req.body[field];
      }
    }

    if (!row.productName) {
      return res.status(400).json({
        message: "Product name is required.",
      });
    }

    if (row.discountType && !["amount", "percent"].includes(row.discountType)) {
      return res.status(400).json({
        message: "Invalid discount type.",
      });
    }

    if (!validateQuantities(row.quantityPurchased, row.quantitySold)) {
      return res.status(400).json({
        message: "Sold quantity cannot exceed purchased quantity.",
      });
    }

    await row.save();

    res.json({ row });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE ONE ACCOUNTING ROW
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID." });
    }

    const row = await Accounting.findByIdAndDelete(req.params.id);

    if (!row) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.json({ message: "Record deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE A TABLE AND ITS ROWS ONLY WHEN EXPLICITLY REQUESTED
router.delete("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    const table = await AccountingTable.findOne({ tableId });

    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    const result = await Accounting.deleteMany({ tableId });
    await table.deleteOne();

    res.json({
      message: "Table and its rows deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
