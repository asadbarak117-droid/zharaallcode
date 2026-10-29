const mongoose = require("mongoose");

const consultationRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    whatsapp: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
      maxlength: 30,
    },
    service: {
      type: String,
      required: [true, "Consultation service is required"],
      enum: ["Personal Styling", "Color Consultation", "Beauty & Fashion"],
    },
    date: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Completed", "Cancelled"],
      default: "New",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ConsultationRequest ||
  mongoose.model("ConsultationRequest", consultationRequestSchema);
