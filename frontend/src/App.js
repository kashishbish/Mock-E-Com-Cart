import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then(res => setProducts(res.data));
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get("http://localhost:5000/api/cart").then(res => {
      setCart(res.data.cart);
      setTotal(res.data.total);
    });
  };

  const addToCart = (id) => {
    axios.post("http://localhost:5000/api/cart", { productId: id, qty: 1 }).then(() => fetchCart());
  };

  const removeFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`).then(() => fetchCart());
  };

  const handleCheckout = () => {
    axios.post("http://localhost:5000/api/checkout", { cartItems: cart }).then(res => {
      alert(` ${res.data.message}\nTotal: ₹${res.data.total}`);
      setCart([]);
      setTotal(0);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🛒 Mock E-Com Cart</h2>

      <h3>Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "30px" }}>Cart</h3>
      {cart.length === 0 ? <p>No items in cart.</p> :
        cart.map(item => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            {item.product.name} × {item.qty} = ₹{item.product.price * item.qty}
            <button style={{ marginLeft: "10px" }} onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      }

      <h3>Total: ₹{total}</h3>

      {cart.length > 0 && (
        <>
          <button onClick={() => setShowCheckout(true)}>Checkout</button>
          {showCheckout && (
            <div style={{ marginTop: "20px" }}>
              <input placeholder="Name" onChange={e => setUser({ ...user, name: e.target.value })} /><br />
              <input placeholder="Email" onChange={e => setUser({ ...user, email: e.target.value })} /><br />
              <button onClick={handleCheckout}>Submit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;