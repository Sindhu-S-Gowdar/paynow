import { useEffect, useState } from "react";
import { getProducts, createOrder } from "../api.js";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products"));
  }, []);

  async function handleBuy(productId) {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setError("");
    setLoadingId(productId);
    try {
      const data = await createOrder(productId, email);
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Could not start checkout");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Shop</h1>
        <p>A few essentials, checkout powered by PayPal.</p>
      </div>

      <input
        className="email-field"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img className="product-image" src={p.image} alt={p.name} />
            <div className="product-body">
              <div className="product-name">{p.name}</div>
              <p className="product-desc">{p.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{p.price}</span>
                <button
                  className="buy-btn"
                  onClick={() => handleBuy(p._id)}
                  disabled={loadingId === p._id}
                >
                  {loadingId === p._id ? "Redirecting…" : "Buy now"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
