import { Routes, Route, Link, useLocation } from "react-router-dom";
import Shop from "./pages/Shop.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Orders from "./pages/Orders.jsx";
import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <span className="brand">PayNow</span>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Shop
          </Link>
          <Link
            to="/orders"
            className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`}
          >
            Orders
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}
