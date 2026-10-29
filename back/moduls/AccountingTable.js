const mongoose = require("mongoose");

const accountingTableSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: ["AFN", "USD", "PLN"],
      default: "AFN",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.AccountingTable ||
  mongoose.model("AccountingTable", accountingTableSchema);
