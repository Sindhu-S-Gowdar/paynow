# PayNow

A full-stack payment gateway integration built with the MERN stack and PayPal's Checkout API. Users browse products, pay through a real PayPal sandbox checkout flow, and orders are tracked end-to-end in MongoDB.

**Live demo:** https://paynow-green.vercel.app
**API:** https://paynow-backend-0dxn.onrender.com

---

## What this project demonstrates

- Server-side payment gateway integration (create → approve → capture flow)
- OAuth2 client-credentials authentication with a third-party API (PayPal)
- Server-side payment verification (never trusting the frontend alone to confirm a payment succeeded)
- Full REST API design with Express and MongoDB/Mongoose
- React frontend with client-side routing, live data fetching, and redirect-based checkout
- Real deployment: separate frontend (Vercel) and backend (Render) hosts, connected via environment variables and CORS
- Debugging real-world issues: SPA routing on static hosts, IP whitelisting, environment variable propagation, React StrictMode double-invocation

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (via Mongoose) |
| Payments | PayPal Checkout API (Orders v2, sandbox mode) |
| Deployment | Vercel (frontend), Render (backend) |

---

## How the payment flow actually works

This is the core of the project, worth understanding in detail:

1. **User browses products** — `GET /api/payment/products` fetches live product data from MongoDB and renders it as a shop grid.

2. **User clicks "Buy now"** — the frontend calls `POST /api/payment/create-order` with the product ID and the buyer's email.

3. **Backend authenticates with PayPal** — before it can do anything, the backend exchanges its `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` for a short-lived OAuth2 access token (`getAccessToken()` in `paypal.js`), using the client-credentials grant type.

4. **Backend creates a PayPal order** — using that access token, it calls PayPal's `/v2/checkout/orders` endpoint, describing what's being bought and how much it costs (converted to USD, since PayPal sandbox doesn't support INR settlement for this account type). PayPal responds with an order ID and an `approve` link.

5. **A pending order is saved locally** — the backend writes an `Order` document to MongoDB with `status: "pending"`, linked to PayPal's order ID.

6. **User is redirected to PayPal** — the frontend does `window.location.href = approveUrl`, sending the browser to PayPal's real hosted checkout page.

7. **User logs in and approves** — using a PayPal sandbox buyer account (fake identity, fake funds — see "About the sandbox environment" below).

8. **PayPal redirects back** — to `CLIENT_URL/success?token=...`, where `token` is the PayPal order ID.

9. **Frontend captures the payment** — the `Success` page reads the token from the URL and calls `POST /api/payment/capture-order/:orderId`. This is the step that actually finalizes the transaction — creating the order only reserved intent to pay, capture is what moves the money.

10. **Backend verifies with PayPal, not the URL** — it doesn't trust the redirect alone. It calls PayPal's capture endpoint directly, and only marks the local order as `"paid"` if PayPal's response confirms `status: "COMPLETED"`.

11. **Order history** — `GET /api/payment/orders` returns all orders from MongoDB, so every transaction (successful or not) is auditable.

---

## About the sandbox environment

This project runs entirely against **PayPal's sandbox**, a fully simulated parallel environment for developers:

- No real money, cards, or banks are involved at any point.
- The "buyer" account used for testing is a fake PayPal identity PayPal auto-generates, pre-loaded with fake balance and a fake test card.
- The "seller" (merchant) account is also a sandbox-only business account — it does not need to be KYC-verified the way a real PayPal business account does.
- Switching this to accept real payments would require: (a) a verified live PayPal business account, (b) live API credentials, and (c) pointing `paypal.js` at `api-m.paypal.com` instead of `api-m.sandbox.paypal.com`.

---

## Project structure

```
paynow/
├── backend/
│   ├── models/
│   │   ├── Product.js       # Mongoose schema for products
│   │   └── Order.js         # Mongoose schema for orders
│   ├── routes/
│   │   └── paymentRoutes.js # All API endpoints
│   ├── paypal.js            # PayPal OAuth2 token helper
│   ├── seed.js               # Populates sample products
│   ├── server.js             # Express app entry point
│   └── .env                  # Secrets (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Shop.jsx      # Product listing + checkout trigger
│   │   │   ├── Success.jsx   # Captures payment after PayPal redirect
│   │   │   ├── Cancel.jsx    # Shown if user cancels checkout
│   │   │   └── Orders.jsx    # Order history table
│   │   ├── api.js            # Centralized fetch calls to the backend
│   │   ├── App.jsx           # Routing + navigation
│   │   ├── App.css           # Component styling
│   │   └── index.css         # Global design tokens
│   ├── vercel.json           # SPA routing fix for deployment
│   └── .env                  # Frontend env vars (not committed)
│
└── README.md
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/payment/products` | List all products |
| `POST` | `/api/payment/create-order` | Create a PayPal order for a product; returns an approval URL |
| `POST` | `/api/payment/capture-order/:orderId` | Finalize (capture) an approved PayPal order |
| `GET` | `/api/payment/orders` | List all orders, most recent first |

---

## Running locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, CLIENT_URL, PORT
npm run seed             # populates 3 sample products
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

### Testing a payment
Use PayPal's sandbox buyer account credentials (from developer.paypal.com → Sandbox Accounts) to log in and approve a test payment. No real card or money required.

---

## Deployment notes

- **Backend (Render):** root directory `backend`, build command `npm install`, start command `npm start`. Environment variables must be set manually in Render's dashboard (they are not read from `.env`, which isn't committed to Git).
- **Frontend (Vercel):** root directory `frontend`. Requires `vercel.json` with a rewrite rule so client-side routes (like `/success`) don't 404 on direct navigation — Vercel's static host doesn't know about React Router's routes unless told to fall back to `index.html`.
- **MongoDB Atlas:** Network Access must allow `0.0.0.0/0` (all IPs), since Render's servers don't have a fixed IP on the free tier.
- Both platforms' free tiers spin down on inactivity — the first request after idle time can take 30-50 seconds to respond.

---

## What I'd add with more time

- Webhooks instead of relying solely on the success-page redirect to trigger capture (a user closing the tab before redirect would leave an order stuck as "pending" — webhooks are PayPal's recommended source of truth)
- User authentication, so order history is scoped per user instead of showing everything
- Real inventory/stock tracking
- Email receipts on successful payment
- Refund handling
