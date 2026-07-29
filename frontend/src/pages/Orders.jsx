import { useEffect, useState } from "react";
import { getOrders } from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Every order created through checkout, live from the database.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">No orders yet.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.productName}</td>
                <td>₹{o.amount}</td>
                <td>{o.customerEmail}</td>
                <td>
                  <span className={`badge ${o.status}`}>{o.status}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
