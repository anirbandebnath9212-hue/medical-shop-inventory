import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true
    },

    batchNumber: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0
    },

    expiryDate: {
      type: Date,
      required: true
    },

    supplier: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;