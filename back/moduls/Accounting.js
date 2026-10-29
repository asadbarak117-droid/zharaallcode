const mongoose = require("mongoose");

const accountingSchema = new mongoose.Schema(
  {
    tableId: {
      type: String,
      required: true,
      index: true,
    },
    tableName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    quantityPurchased: { type: Number, default: 0, min: 0 },
    quantitySold: { type: Number, default: 0, min: 0 },
    purchasePrice: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    otherCosts: { type: Number, default: 0, min: 0 },
    discountType: {
      type: String,
      enum: ["amount", "percent"],
      default: "amount",
    },
    discountValue: { type: Number, default: 0, min: 0 },
    currency: {
      type: String,
      enum: ["AFN", "USD", "PLN"],
      default: "AFN",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

accountingSchema.index({ tableId: 1, date: 1 });
accountingSchema.index({ tableName: 1, date: 1 });

module.exports =
  mongoose.models.Accounting || mongoose.model("Accounting", accountingSchema);
