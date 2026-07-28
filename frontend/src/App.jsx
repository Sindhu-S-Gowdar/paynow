import { Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/Shop.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "15px" }}>
          Shop
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Shop />}></Route>
      </Routes>
    </div>
  );
}
