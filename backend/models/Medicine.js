import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    genericName: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      trim: true
    },

    minimumStock: {
      type: Number,
      default: 10,
      min: 0
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;