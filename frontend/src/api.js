const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export async function getProducts() {
  const res = await fetch(`${API_URL}/api/payment/products`);
  return res.json();
}

export async function createOrder(productId, email) {
  const res = await fetch(`${API_URL}/api/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, email }),
  });
  return res.json();
}

export async function captureOrder(orderId) {
  const res = await fetch(`${API_URL}/api/payment/capture-order/${orderId}`, {
    method: "POST",
  });
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/api/payment/orders`);
  return res.json();
}

//This mirrors exactly the four backend routes you already tested with curl — now the frontend has clean functions to call instead of typing raw fetch everywhere.
