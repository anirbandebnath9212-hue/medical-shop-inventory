import mongoose from "mongoose";

const importantOrderSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true
    },

    quantityNeeded: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["need_to_buy", "in_stock", "completed"],
      default: "need_to_buy"
    }
  },
  {
    timestamps: true
  }
);

const ImportantOrder = mongoose.model(
  "ImportantOrder",
  importantOrderSchema
);

export default ImportantOrder;