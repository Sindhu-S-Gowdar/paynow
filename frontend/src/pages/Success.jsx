import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { captureOrder } from "../api.js";

export default function Success() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); //this is the orderId PayPal sends back
  const [status, setStatus] = useState("capturing");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("unknown");
      return;
    }
    if (hasRun.current) return; // skips the second StrictMode call
    hasRun.current = true;

    captureOrder(token)
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, [token]);

  const isSuccess = status === "COMPLETED";
  const isLoading = status === "capturing";

  return (
    <div className="status-card">
      {isLoading && <p>Finalizing your payment…</p>}

      {!isLoading && (
        <>
          <div className={`status-icon ${isSuccess ? "success" : "error"}`}>
            {isSuccess ? "✓" : "!"}
          </div>
          <h2>
            {isSuccess
              ? "Payment successful"
              : `Payment ${status.toLowerCase()}`}
          </h2>
          <p>
            {isSuccess
              ? "Your order has been confirmed."
              : "Something may have gone wrong — check your order history."}
          </p>
          <Link to="/" className="back-link">
            Back to shop
          </Link>
        </>
      )}
    </div>
  );
}
