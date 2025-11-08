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
    const product = products.find(p => p.id === id);
    axios.post("http://localhost:5000/api/cart", { productId: id, qty: 1 })
      .then(() => {
        fetchCart();
        alert(`✅ ${product.name} added to cart!`);
      });
  };

  const removeFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`).then(() => fetchCart());
  };

  const handleCheckout = () => {
    axios.post("http://localhost:5000/api/checkout", { cartItems: cart }).then(res => {
      alert(` ${res.data.message}\nTotal: ₹${res.data.total}`);
      setCart([]);
      setTotal(0);
      setShowCheckout(false);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🛒 Mock E-Com Cart</h2>

      <h3>Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
        {products.map(p => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              textAlign: "center"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <h4>{p.name}</h4>
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <button
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#45a049"}
              onMouseLeave={e => e.currentTarget.style.background = "#4CAF50"}
              onClick={() => addToCart(p.id)}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "30px" }}>Cart</h3>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cart.map(item => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            {item.product.name} × {item.qty} = ₹{item.subtotal}
            <button style={{ marginLeft: "10px" }} onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}

      <h3>Total: ₹{total}</h3>

      {cart.length > 0 && (
        <>
          <button onClick={() => setShowCheckout(true)}>Checkout</button>
          {showCheckout && (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
                <h3>Checkout</h3>
                <input placeholder="Name" onChange={e => setUser({ ...user, name: e.target.value })} /><br /><br />
                <input placeholder="Email" onChange={e => setUser({ ...user, email: e.target.value })} /><br /><br />
                <button
                  style={{ background: "#2196F3", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
                  onClick={handleCheckout}
                >
                  Submit
                </button>
                <button style={{ marginLeft: "10px" }} onClick={() => setShowCheckout(false)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;