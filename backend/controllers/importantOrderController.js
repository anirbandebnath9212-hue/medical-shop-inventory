import ImportantOrder from "../models/ImportantOrder.js";
import Batch from "../models/Batch.js";


// GET ALL IMPORTANT ORDERS
export const getImportantOrders = async (req, res) => {
  try {

    const orders = await ImportantOrder.find()
      .populate("medicine")
      .sort({ createdAt: -1 });


    const result = [];


    for (const order of orders) {

      const batches = await Batch.find({
        medicine: order.medicine._id,
        quantity: { $gt: 0 }
      });


      const totalStock = batches.reduce(
        (total, batch) => total + batch.quantity,
        0
      );


      let status = order.status;


      if (status !== "completed") {

        if (totalStock >= order.quantityNeeded) {

          status = "in_stock";

        } else {

          status = "need_to_buy";

        }

      }


      result.push({

        ...order.toObject(),

        currentStock: totalStock,

        status

      });

    }


    res.status(200).json(result);


  } catch (error) {

    res.status(500).json({

      message: "Failed to get important orders",

      error: error.message

    });

  }
};


// ADD IMPORTANT ORDER
export const addImportantOrder = async (req, res) => {
  try {

    const {
      medicine,
      quantityNeeded
    } = req.body;

    const order = await ImportantOrder.create({
      medicine,
      quantityNeeded,
      status: "need_to_buy"
    });

    res.status(201).json(order);

  } catch (error) {

    res.status(400).json({
      message: "Failed to add important order",
      error: error.message
    });

  }
};


// UPDATE ORDER STATUS
export const updateImportantOrder = async (req, res) => {
  try {

    const order = await ImportantOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    res.status(200).json(order);

  } catch (error) {

    res.status(400).json({
      message: "Failed to update order",
      error: error.message
    });

  }
};


// DELETE IMPORTANT ORDER
export const deleteImportantOrder = async (req, res) => {
  try {

    const order = await ImportantOrder.findByIdAndDelete(
      req.params.id
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    res.status(200).json({
      message: "Order removed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete order",
      error: error.message
    });

  }
};