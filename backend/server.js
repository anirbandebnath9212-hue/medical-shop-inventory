import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import importantOrderRoutes from "./routes/importantOrderRoutes.js";
import connectDB from "./config/db.js";
import medicineRoutes from "./routes/medicineRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Medical Shop API is running");
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/important-orders", importantOrderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});