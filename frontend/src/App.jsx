import { Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/Shop.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Orders from "./pages/Orders.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "15px" }}>
          Shop
        </Link>
        <Link to="/orders">Orders</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Shop />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/cancel" element={<Cancel />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
      </Routes>
    </div>
  );
}
