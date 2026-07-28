import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { captureOrder } from "../api.js";

export default function Success() {
  const [searchParams] = useSearchparams();
  const token = searchParams.get("token"); //this is the orderId PayPal sends back
  const [status, setStatus] = useState("capturing");

  useEffect(() => {
    if (!token) {
      setStatus("unknown");
      return;
    }
    captureOrder(token)
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div>
      {status === "capturing" && <p>Finalising your payment...</p>}
      {status === "COMPLETED" && (
        <>
          <h2>Payment Successful!!</h2>
          <p>Your order has been confirmed.</p>
        </>
      )}
      {status !== "capturing" && status !== "COMPLETED" && (
        <>
          <h2>Payment status: {status}</h2>
          <p>Something may have gone wrong - check your order history.</p>
        </>
      )}
      <Link to="/">Back to shop</Link>
    </div>
  );
}
