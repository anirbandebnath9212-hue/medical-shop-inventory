import express from "express";

import {
  getImportantOrders,
  addImportantOrder,
  updateImportantOrder,
  deleteImportantOrder
} from "../controllers/importantOrderController.js";

const router = express.Router();

router.get("/", getImportantOrders);

router.post("/", addImportantOrder);

router.put("/:id", updateImportantOrder);

router.delete("/:id", deleteImportantOrder);

export default router;