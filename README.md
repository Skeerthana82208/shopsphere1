# ShopSphere – Simple MERN E-Commerce Application

ShopSphere is a clean, intermediate-level, full-stack E-Commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed for learning, demonstration, and portfolio purposes, it focuses on clarity, maintainability, and clean architecture without unnecessary bloat or complex external dependencies.

---

## 1. Project Overview

ShopSphere provides a full shopping experience with two user roles: **Customer** and **Admin**. It features a catalog of 100 realistic products across 10 categories, product reviews, cart management, wishlist, customer order tracking, and an admin management portal for products, categories, users, and orders.

> **Payment Policy**: ShopSphere exclusively supports **Cash on Delivery (COD)**. No third-party payment gateways, SDKs, or payment APIs are used.

---

## 2. Features

### Customer
* **Authentication**: Register, Login, Logout with secure JWT and bcrypt hashing.
* **Product Discovery**: Search by name or brand, category filters, price sorting (Low to High, High to Low, Newest), and 12-item pagination.
* **Product Details**: High-resolution gallery view, stock status, ratings, and customer reviews.
* **Cart & Wishlist**: Real-time stock validation, quantity increments/decrements, item removal, and persistent wishlist.
* **Cash on Delivery Checkout**: Shipping address validation, inventory stock deduction upon checkout, and cart auto-clear.
* **Order Tracking & Cancellation**: View order history, inspect order details, and cancel orders when their status is `PLACED`.
* **Reviews**: Submit, edit, and delete product reviews with 1–5 star ratings and feedback (automatically updates product average rating).
* **Profile**: Update customer personal details and shipping address.

### Admin
* **Dashboard Analytics**: Key metric cards (Total Products, Users, Orders, Revenue), recent orders, low-stock alerts (< 10 units), and sales breakdown charts.
* **Product Management**: Full CRUD (Create, Read, Update, Delete) with image URLs, category binding, stock, and featured status.
* **Category Management**: Create, edit, and delete store categories.
* **User Management**: View registered customers with contact details and registration dates (passwords excluded).
* **Order Management**: Review all customer orders and update shipment statuses (`PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`). Cancelling an order automatically restores product inventory.

---

## 3. Technology Stack

### Frontend
* **React.js 19** & **Vite 5**
* **Tailwind CSS** (Clean, responsive modern design)
* **React Router DOM 7** (Client-side routing & route protection)
* **Axios** (HTTP client with request interceptors & centralized config)
* **React Icons** & **React Toastify** (Notifications)

### Backend
* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** (With automated embedded fallback for plug-and-play local dev)
* **JWT (`jsonwebtoken`)** (Token-based authentication)
* **bcryptjs** (Password hashing)
* **dotenv**, **cors**, **cookie-parser**

---

## 4. Folder Structure

```text
ShopSphere/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── seed/
│   │   └── seedData.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── AddProduct.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── Users.jsx
│   │   │       └── Orders.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 5. Installation

Clone or extract the repository and install dependencies in both directories:

### Backend
```bash
cd ShopSphere/backend
npm install
```

### Frontend
```bash
cd ShopSphere/frontend
npm install
```

---

## 6. MongoDB Setup

ShopSphere works seamlessly with both local MongoDB Community Server and MongoDB Atlas:

1. **Local MongoDB**: Run your local MongoDB instance on `mongodb://localhost:27017/shopsphere`.
2. **MongoDB Atlas**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and paste the connection string into `backend/.env`.
3. **Embedded Fallback**: If no MongoDB server is detected locally, ShopSphere automatically spins up an embedded in-memory MongoDB engine for zero-configuration testing.

---

## 7. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=shopsphere_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
*(Reference `backend/.env.example`)*

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
*(Reference `frontend/.env.example`)*

---

## 8. Seed Database

ShopSphere includes a seed script that populates the database with realistic data:
* **10 Categories** (Electronics, Mobile Phones, Laptops, Headphones, Cameras, Men's Clothing, Women's Clothing, Shoes, Home & Kitchen, Books)
* **11 Users** (1 Admin + 10 Customers)
* **100 Products** (Realistic brands, prices, images, stock, and low stock items)
* **50 Reviews** (Varied ratings and detailed comments)
* **20 Sample Orders** (Varied order statuses and amounts, all COD)

Run the seed command inside `backend/`:
```bash
npm run seed
```

Expected output:
```text
Categories: 10
Users: 11
Products: 100
Reviews: 50
Orders: 20

Seed completed successfully.
```

---

## 9. Run Backend

Start the backend Express server:
```bash
cd backend
npm run dev
# or: npm start
```
The API server starts at `http://localhost:5000`.

---

## 10. Run Frontend

Start the Vite development server:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 11. Admin Login

Login credentials created by the seed script:

* **Role**: Admin
* **Email**: `admin@shopsphere.com`
* **Password**: `Admin@123`

Customer credentials:
* **Email**: `john@example.com` (or `jane@example.com`, etc.)
* **Password**: `Password@123`

---

## 12. Customer Features

1. **Browse Products**: View high-quality product cards with ratings, discounted prices, and stock indicators.
2. **Search & Filter**: Search by keyword or brand, filter by category tabs, and sort by price or newest.
3. **Cart & Wishlist**: Add items with instant badge updates. Cart prevents adding more units than available stock.
4. **Product Details & Reviews**: View complete specs and read customer reviews. Authenticated users can write, edit, or delete their own review.
5. **Customer Orders**: Track order status (`PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
6. **Cancel Order**: Customers can cancel an order as long as its status is `PLACED`.

---

## 13. Admin Features

1. **Admin Dashboard**: Real-time sales metrics, revenue calculation, low-stock warnings, and order status breakdown.
2. **Product Catalog**: Add new products, update existing products (pricing, images, stock), and delete products.
3. **Category Management**: Add and manage product categories.
4. **User Directory**: View registered customers and their contact information.
5. **Order Fulfillment**: Update order status through the lifecycle (`PLACED` → `CONFIRMED` → `SHIPPED` → `DELIVERED` or `CANCELLED`).

---

## 14. COD Checkout

1. Navigate to your Cart and click **Proceed to Checkout**.
2. Fill out the shipping form:
   * Full Name
   * Phone Number
   * Street Address
   * City
   * State
   * PIN Code
3. Review the order summary: Subtotal, Shipping (Free over $100), and Total.
4. Payment Method is locked to **Cash on Delivery (COD)**.
5. Click **Place Order (Cash on Delivery)**:
   * Validates product availability and stock.
   * Decrements product inventory in MongoDB.
   * Empties the user's cart.
   * Redirects to the Orders page with real-time confirmation.
