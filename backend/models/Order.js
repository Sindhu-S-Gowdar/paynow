const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  amount: { type: Number, required: true }, //in INR
  customerEmail: { type: String, required: true },
  paypalOrderId: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | paid | failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
