const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const router = express.Router();

const Accounting = require("../moduls/Accounting");
const AccountingTable = require("../moduls/AccountingTable");

const validCurrency = (currency) => ["AFN", "USD", "PLN"].includes(currency);

const validDate = (date) => {
  if (typeof date !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

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

function validateDiscount(discountType, discountValue) {
  if (!["amount", "percent"].includes(discountType)) {
    return "Invalid discount type.";
  }

  if (discountType === "percent" && Number(discountValue || 0) > 100) {
    return "Discount percentage cannot exceed 100.";
  }

  return null;
}

function sendError(res, error, status = 500) {
  return res.status(status).json({
    message: error.message || "Something went wrong.",
  });
}

// GET ALL TABLES
router.get("/tables", async (req, res) => {
  try {
    const currency = req.query.currency || "AFN";

    const term = String(req.query.search || "")
      .trim()
      .toLowerCase();

    if (!validCurrency(currency)) {
      return res.status(400).json({
        message: "Invalid currency.",
      });
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
        String(table.tableName || "")
          .toLowerCase()
          .includes(term) ||
        String(table.date || "").includes(term) ||
        table.rows.some((row) =>
          String(row.productName || "")
            .toLowerCase()
            .includes(term),
        )
      );
    });

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
        String(table.tableName || "")
          .toLowerCase()
          .includes(term) ||
        String(table.date || "").includes(term) ||
        table.rows.some((row) =>
          String(row.productName || "")
            .toLowerCase()
            .includes(term),
        )
      );
    });

    return res.json({
      tables: [...filteredTables, ...legacyTables],
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// CREATE TABLE
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

    return res.status(201).json({
      table: {
        _id: table._id,
        tableId: table.tableId,
        tableName: table.tableName,
        date: table.date,
        currency: table.currency,
        rows: [],
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// GET ONE TABLE
router.get("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    if (!validId(tableId)) {
      return res.status(400).json({
        message: "Invalid table ID.",
      });
    }

    const table = await AccountingTable.findOne({
      tableId,
    }).lean();

    const rows = await Accounting.find({ tableId })
      .sort({ createdAt: 1 })
      .lean();

    if (!table && rows.length === 0) {
      return res.status(404).json({
        message: "Table not found.",
      });
    }

    return res.json({
      table: table || null,
      rows,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// UPDATE TABLE
router.put("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    const table = await AccountingTable.findOne({ tableId });

    if (!table) {
      return res.status(404).json({
        message: "Table not found.",
      });
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
      { runValidators: true },
    );

    return res.json({
      table,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// CREATE ACCOUNTING ROW
router.post("/", async (req, res) => {
  try {
    const tableId = String(req.body.tableId || "").trim();

    const productName = String(req.body.productName || "").trim();

    if (!tableId || !productName) {
      return res.status(400).json({
        message: "Table and product name are required.",
      });
    }

    const errorMessage = validateNumbers(req.body);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage,
      });
    }

    const table = await AccountingTable.findOne({
      tableId,
    });

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

    const discountValue = Number(req.body.discountValue || 0);

    const discountError = validateDiscount(discountType, discountValue);

    if (discountError) {
      return res.status(400).json({
        message: discountError,
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
      discountValue,
      currency,
      notes: String(req.body.notes || ""),
    });

    return res.status(201).json({
      row,
    });
  } catch (error) {
    return sendError(res, error, 400);
  }
});

// UPDATE ACCOUNTING ROW
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid record ID.",
      });
    }

    const row = await Accounting.findById(req.params.id);

    if (!row) {
      return res.status(404).json({
        message: "Record not found.",
      });
    }

    const errorMessage = validateNumbers(req.body);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage,
      });
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
        if (field === "productName") {
          row[field] = String(req.body[field]).trim();
        } else if (field === "notes") {
          row[field] = String(req.body[field]);
        } else if (numericFields.includes(field)) {
          row[field] = Number(req.body[field]);
        } else {
          row[field] = req.body[field];
        }
      }
    }

    if (!row.productName) {
      return res.status(400).json({
        message: "Product name is required.",
      });
    }

    const discountError = validateDiscount(row.discountType, row.discountValue);

    if (discountError) {
      return res.status(400).json({
        message: discountError,
      });
    }

    if (!validateQuantities(row.quantityPurchased, row.quantitySold)) {
      return res.status(400).json({
        message: "Sold quantity cannot exceed purchased quantity.",
      });
    }

    await row.save();

    return res.json({
      row,
    });
  } catch (error) {
    return sendError(res, error, 400);
  }
});

// DELETE ACCOUNTING ROW
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid record ID.",
      });
    }

    const row = await Accounting.findByIdAndDelete(req.params.id);

    if (!row) {
      return res.status(404).json({
        message: "Record not found.",
      });
    }

    return res.json({
      message: "Record deleted.",
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// DELETE TABLE AND ALL ITS ROWS
router.delete("/tables/:tableId", async (req, res) => {
  try {
    const tableId = req.params.tableId;

    if (!validId(tableId)) {
      return res.status(400).json({
        message: "Invalid table ID.",
      });
    }

    const table = await AccountingTable.findOne({
      tableId,
    });

    if (!table) {
      return res.status(404).json({
        message: "Table not found.",
      });
    }

    const result = await Accounting.deleteMany({
      tableId,
    });

    await table.deleteOne();

    return res.json({
      message: "Table and its rows deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

module.exports = router;
