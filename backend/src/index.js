import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Shoes", price: 1200 },
  { id: 2, name: "T-Shirt", price: 600 },
  { id: 3, name: "Jeans", price: 1500 },
  { id: 4, name: "Watch", price: 2000 },
  { id: 5, name: "Bag", price: 800 },
];

let cart = [];

// GET Products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ADD to Cart
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: Date.now(), product, qty });
  }
  res.json(cart);
});

// REMOVE from Cart
app.delete("/api/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== id);
  res.json(cart);
});

// GET Cart + Total
app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  res.json({ cart, total });
});

// CHECKOUT (Mock)
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  res.json({ message: "Checkout successful", total, timestamp: new Date() });
});

app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));