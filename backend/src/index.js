// index.js
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
let cartId = 1;

// GET Products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET Cart + Total
app.get("/api/cart", (req, res) => {
  const cartWithSubtotal = cart.map(item => ({
    ...item,
    subtotal: item.product.price * item.qty
  }));
  const total = cartWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
  res.json({ cart: cartWithSubtotal, total });
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
    cart.push({ id: cartId++, product, qty });
  }

  res.json({ message: `${product.name} added to cart!` });
});

// REMOVE from Cart
app.delete("/api/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== id);
  res.json({ message: "Item removed from cart" });
});

// CHECKOUT (Mock)
app.post("/api/checkout", (req, res) => {
  if (cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const timestamp = new Date().toISOString();
  cart = []; // clear cart after checkout

  res.json({ message: "Checkout successful!", total, timestamp });
});

app.listen(5000, () => console.log("Backend running at http://localhost:5000"));