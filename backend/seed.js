require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "wireless Mouse",
    description: "ergonomic wireless mouse with silent clicks",
    price: 599,
    image: "https://placehold.co/300x200?text=Wireless+Mouse",
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard",
    price: 2499,
    image: "https://placehold.co/300x200?text=Keyboard",
  },
  {
    name: "USB-C Hub",
    description: "6-in-1 USB-C hub with HDMI and card reader",
    price: 1299,
    image: "https://placehold.co/300x200?text=USB-C+Hub",
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
