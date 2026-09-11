import Medicine from "../models/Medicine.js";
import Batch from "../models/Batch.js";


// GET MEDICINES
export const getMedicines = async (req, res) => {
  try {
    const search = req.query.search || "";
    const showAll = req.query.showAll === "true";

    const medicines = await Medicine.find({
      name: {
        $regex: search,
        $options: "i"
      }
    }).sort({
      name: 1
    });

    const result = [];

    for (const medicine of medicines) {

      const batchFilter = {
  medicine: medicine._id
};

if (!showAll) {
  batchFilter.quantity = { $gt: 0 };
}

const batches = await Batch.find(batchFilter).sort({
  expiryDate: 1
});

      const totalStock = batches.reduce(
        (total, batch) => total + batch.quantity,
        0
      );

      result.push({
        ...medicine.toObject(),
        totalStock,
        batches
      });
    }

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get medicines",
      error: error.message
    });
  }
};


// ADD MEDICINE
export const addMedicine = async (req, res) => {
  try {

    const {
      name,
      genericName,
      category,
      minimumStock,
      sellingPrice
    } = req.body;

    const medicine = await Medicine.create({
      name,
      genericName,
      category,
      minimumStock,
      sellingPrice
    });

    res.status(201).json(medicine);

  } catch (error) {

    res.status(400).json({
      message: "Failed to add medicine",
      error: error.message
    });

  }
};


// ADD BATCH
export const addBatch = async (req, res) => {
  try {

    const {
      batchNumber,
      quantity,
      purchasePrice,
      expiryDate,
      supplier
    } = req.body;

    const medicine = await Medicine.findById(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    const batch = await Batch.create({
      medicine: medicine._id,
      batchNumber,
      quantity,
      purchasePrice,
      expiryDate,
      supplier
    });

    res.status(201).json(batch);

  } catch (error) {

    res.status(400).json({
      message: "Failed to add batch",
      error: error.message
    });

  }
};


// UPDATE MEDICINE
export const updateMedicine = async (req, res) => {
  try {

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    res.status(200).json(medicine);

  } catch (error) {

    res.status(400).json({
      message: "Failed to update medicine",
      error: error.message
    });

  }
};


// UPDATE BATCH
export const updateBatch = async (req, res) => {
  try {

    const batch = await Batch.findByIdAndUpdate(
      req.params.batchId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found"
      });
    }

    res.status(200).json(batch);

  } catch (error) {

    res.status(400).json({
      message: "Failed to update batch",
      error: error.message
    });

  }
};


// SELL MEDICINE USING FEFO
export const sellMedicine = async (req, res) => {
  try {

    let quantityToSell = Number(req.body.quantity);

    if (quantityToSell <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    const medicine = await Medicine.findById(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    // Get batches with earliest expiry first
    const batches = await Batch.find({
      medicine: medicine._id,
      quantity: { $gt: 0 }
    }).sort({
      expiryDate: 1
    });

    const totalStock = batches.reduce(
      (total, batch) => total + batch.quantity,
      0
    );

    if (quantityToSell > totalStock) {
      return res.status(400).json({
        message: `Not enough stock. Only ${totalStock} available.`
      });
    }

    for (const batch of batches) {

      if (quantityToSell === 0) {
        break;
      }

      const amountFromBatch = Math.min(
        batch.quantity,
        quantityToSell
      );

      batch.quantity -= amountFromBatch;

      quantityToSell -= amountFromBatch;

      await batch.save();
    }

    res.status(200).json({
      message: "Medicine sold successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to sell medicine",
      error: error.message
    });

  }
};

// DELETE MEDICINE
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    // Delete all batches belonging to this medicine
    await Batch.deleteMany({
      medicine: medicine._id
    });

    // Delete the medicine
    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete medicine",
      error: error.message
    });
  }
};