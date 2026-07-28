import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div>
      <h2>Payment Cancelled</h2>
      <p>No worries, you can try again anytime.</p>
      <Link to="/">Back to shop</Link>
    </div>
  );
}
