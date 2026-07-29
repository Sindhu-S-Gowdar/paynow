import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="status-card">
      <div className="status-icon error">×</div>
      <h2>Payment cancelled</h2>
      <p>No worries, you can try again anytime.</p>
      <Link to="/" className="back-link">
        Back to shop
      </Link>
    </div>
  );
}
