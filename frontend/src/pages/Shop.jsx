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
      <h2>Shop</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              width: "200px",
            }}
          >
            <img src={p.image} alt={p.name} style={{ width: "100%" }} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>
              <strong>₹{p.price}</strong>
            </p>
            <button
              onClick={() => handleBuy(p._id)}
              disabled={loadingId === p._id}
            >
              {loadingId === p._id ? "Redirecting..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
