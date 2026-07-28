const expresss = require("express");
const router = expresss.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { getAccessToken, PAYPAL_BASE } = require("../paypal");

//GET all products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

//POST create a PayPal order (called when user clicks "Buy Now")
router.post("/create-order", async (req, res) => {
  try {
    const { productId, email } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const accessToken = await getAccessToken();

    //PayPal doesn't support INR for sandbox text payments, so we convert to USD for the demo
    const usdAmount = (product.price / 83).toFixed(2);

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: product.name,
            amount: { currency_code: "USD", value: usdAmount },
          },
        ],
        application_context: {
          return_url: `${process.env.CLIENT_URL}/success`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
        },
      }),
    });

    const orderData = await orderRes.json();
    console.log("PayPal response:", orderData);

    await Order.create({
      productName: product.name,
      amount: product.price,
      customerEmail: email,
      paypalOrderId: orderData.id,
      status: "pending",
    });

    //Find the "approve" link PayPal gives us to redirect the user to
    const approveLink = orderData.links.find((l) => l.rel === "approve");

    res.json({ approveUrl: approveLink.href, orderId: orderData.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//POST capture payment(called after user approves on PayPal's site)
router.post("/capture-order/:orderId", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${req.params.orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const captureData = await captureRes.json();
    if (captureData.status === "COMPLETED") {
      await Order.findOneAndUpdate(
        { paypalOrderId: req.params.orderId },
        { status: "paid" },
      );
    }

    res.json({ status: captureData.status });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//GET all the orders( order history)
router.get("/orders", async (req, res) => {
  const orders = (await Order.find()).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
