# FoodBridge AI ✦ Good Food, Better Bridges

**FoodBridge AI** is an intelligent, full-stack food discovery and neighborhood kitchen ordering platform. It bridges thoughtful local cooks with community diners, powered by an AI-driven culinary recommendation engine to help diners discover personalized meals while minimizing neighborhood food waste.

---

## 🌟 Key Features

### 1. ✦ FoodBridge AI Assistant & Smart Recommender
- **Neighborhood-aware AI**: Understands dietary preferences, cravings, budget limits, and mood (e.g., *"Healthy high-protein options"*, *"Spicy comfort dinner under ₹200"*, *"Chef's top-rated specials"*).
- **Contextual Matching**: Ranks dishes from active local kitchen menus with detailed reasoning and one-click **"+ Add to Order"**.
- Accessible globally from the navbar or hero spotlight.

### 2. 🍲 Dynamic Menu & Kitchen Explorer
- **Kitchen Filtering**: Filter dishes by specific neighborhood kitchens (e.g., *Food Paradise*, *The Rustic Oven*, *Green Haven Kitchen*, *Sweet Bridges Patisserie*).
- **Category Tabs**: Biryani, Main Course, Pizza, Italian, Healthy, Appetizer, Dessert, and Beverage.
- **Instant Search**: Real-time search across food names, descriptions, and categories.

### 3. 🛒 Interactive Cart & Seamless Checkout
- **Item Quantity Controls**: Increase (`+`), decrease (`-`), or remove dishes with live price calculations.
- **Multi-Method Checkout**: Choose from **UPI / Google Pay**, **Credit/Debit Card**, or **Cash on Delivery**.
- **Real-time Order Creation**: Automatically assigns order status, persists delivery instructions, records payment records, and clears the user's cart in MySQL.
- **Order Confirmation Receipt**: Displays order ID, dish summary, delivery address, and estimated preparation time.

### 4. 📦 Order Tracking & History (`/orders`)
- Real-time order tracking: `PLACED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
- Complete order history with timestamps, breakdown of dishes, and payment summaries.

### 5. 🛡️ Kitchen Partner & Admin Portal (`/admin`)
- **Key Metrics Dashboard**: Live revenue counter, total orders, menu items count, and partner kitchens count.
- **Order Dispatch**: Real-time status advancement for kitchen workflows (`PLACED` ➔ `PREPARING` ➔ `OUT FOR DELIVERY` ➔ `DELIVERED`).
- **Menu Management**: Add new dishes (name, description, price, category, photo URL, kitchen selector) and remove existing items.
- **Kitchen Partner Onboarding**: Register new restaurants and community kitchens.

---

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.5.16, Spring Security, JWT (jjwt 0.11.5), Spring Data JPA, Hibernate, MySQL 9.7
- **Frontend**: React 19, Vite 8, React Router DOM 7, Axios, CSS Variables & Typography (Fraunces, DM Mono, Manrope)
- **Database**: MySQL (`foodbridge_ai`)

---

## 🚀 Getting Started

### 1. Database Setup
Ensure MySQL is running locally on port 3306 with the database `foodbridge_ai`:
```sql
CREATE DATABASE IF NOT EXISTS foodbridge_ai;
```

### 2. Run the Backend
Navigate to the `backend` folder:
```bash
cd backend
./mvnw spring-boot:run
```
*The Spring Boot server will start on `http://localhost:8080`.*

### 3. Run the Frontend
In a separate terminal, navigate to the `frontend` folder:
```bash
cd frontend
npm run dev
```
*The React + Vite application will start on `http://localhost:5173`.*

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `divit@gmail.com` | `password123` *(or `123456`)* | Menu, AI Assistant, Cart, Checkout, My Orders |
| **Admin** | `test123@gmail.com` | `admin123` *(or `123456`)* | Admin Dashboard, Order Dispatch, Menu & Kitchen Management |

*(Quick one-click demo buttons are available directly on the `/login` screen!)*

---

## 📡 API Endpoints

### Public & Authentication
- `POST /api/users/register` - Create customer or partner account
- `POST /api/users/login` - Authenticate & receive JWT
- `GET  /api/restaurants` - List active restaurants
- `GET  /api/foods` - List all dishes on menu
- `POST /api/ai/recommend` - Query the FoodBridge AI culinary engine
- `POST /api/ai/chat` - Conversational AI dining chat

### User & Cart
- `GET    /api/cart/user/{userId}` - Fetch user's cart
- `POST   /api/cart` - Add item to cart
- `PUT    /api/cart/{id}` - Update quantity
- `DELETE /api/cart/{id}` - Remove single item
- `DELETE /api/cart/user/{userId}` - Empty user's cart

### Orders & Payments
- `GET   /api/orders/user/{userId}` - Fetch user order history
- `POST  /api/orders` - Place new order
- `POST  /api/payments` - Record payment

### Admin Endpoints
- `GET    /api/orders` - View all system orders
- `PATCH  /api/orders/{id}/status` - Update order fulfillment status
- `POST   /api/foods` - Create dish
- `DELETE /api/foods/{id}` - Delete dish
- `POST   /api/restaurants` - Add restaurant
- `DELETE /api/restaurants/{id}` - Delete restaurant
