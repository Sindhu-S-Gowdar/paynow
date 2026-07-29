require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "wireless Mouse",
    description: "ergonomic wireless mouse with silent clicks",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
  },
  {
    name: "USB-C Hub",
    description: "6-in-1 USB-C hub with HDMI and card reader",
    price: 1299,
    image: "https://loremflickr.com/500/400/usb,adapter",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Seeded", products.length, "products");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seed();
