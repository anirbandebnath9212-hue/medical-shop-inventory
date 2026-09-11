import express from "express";

import {
  getMedicines,
  addMedicine,
  addBatch,
  updateMedicine,
  updateBatch,
  sellMedicine,
  deleteMedicine
} from "../controllers/medicineController.js";

const router = express.Router();


// Get medicines
router.get("/", getMedicines);


// Add medicine
router.post("/", addMedicine);


// Add batch to medicine
router.post("/:id/batches", addBatch);


// Update medicine
router.put("/:id", updateMedicine);


// Update batch
router.put("/:id/batches/:batchId", updateBatch);


// Sell medicine
router.post("/:id/sell", sellMedicine);

//delete
router.delete("/:id", deleteMedicine);


export default router;