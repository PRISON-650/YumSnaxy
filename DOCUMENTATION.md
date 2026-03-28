# Yum Snaxy - Web Application Documentation

## Overview
Yum Snaxy is a full-stack fast-food ordering and management platform designed for the Pakistani market. It features a customer-facing menu, a real-time order tracking system, a cashier POS interface, and an administrative dashboard for reports and management.

## Key Features
- **Customer Menu:** Browse and order items with a modern, responsive UI.
- **Simplified Login:** Easy Google and Email login for customers.
- **Real-time Order Tracking:** Customers can track their order status from "Pending" to "Delivered".
- **Cashier POS:** A dedicated interface for cashiers to manage walk-in orders, process payments, and record expenses.
- **Admin Dashboard:** Real-time infographics showing revenue, orders, and expenses.
- **Reports:** Detailed daily reports and session history for financial tracking.
- **Printable Receipts:** Thermal printer support for order receipts and session reports.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion (Framer Motion).
- **Backend:** Node.js, Express.js (Full-stack setup).
- **Database & Auth:** Firebase Firestore, Firebase Authentication.

## Project Structure
- `/src/pages/`: Contains all main application views (Home, Menu, Cashier, Admin, etc.).
- `/src/components/`: Reusable UI components (Cart, Layout, Modals).
- `/src/AuthContext.tsx`: Manages user authentication and role-based access control.
- `/src/CartContext.tsx`: Manages the customer's shopping cart.
- `/server.ts`: Express server handling API routes and SPA fallback.
- `/firestore.rules`: Security rules for Firestore data protection.

## Bug Fixes & Improvements
### 1. Simplified Customer Login
The email login process has been simplified to directly use Firebase Authentication. The previous complex fallback mechanism was removed to ensure a smoother experience for fast-food customers who just want to order quickly.

### 2. Page Reload Fix
The server-side SPA fallback logic in `server.ts` was updated to correctly resolve the `index.html` file using `process.cwd()`. This ensures that reloading any page (e.g., `/menu` or `/admin`) no longer results in a 404 error.

### 3. Real-time Infographics & Reports
- **Security Rules:** Updated `firestore.rules` to allow staff and authenticated customers to update the `dailyReports` collection. This was previously blocking real-time data aggregation.
- **Data Flow:** The `Cashier` and `Checkout` pages now correctly increment sales and expenses in the `dailyReports` collection using Firestore's `increment()` operator.
- **Live Updates:** Both the `Dashboard` and `AdminReports` pages use `onSnapshot` to listen for real-time changes in Firestore, ensuring the UI always reflects the latest data.

## Setup Instructions
1. **Firebase Configuration:**
   - Ensure `firebase-applet-config.json` is populated with valid Firebase project credentials.
   - Deploy the updated `firestore.rules` using the Firebase CLI or the provided tools.
2. **Environment Variables:**
   - Define `GEMINI_API_KEY` in your environment for AI-powered features.
3. **Running the App:**
   - Run `npm install` to install dependencies.
   - Run `npm run dev` to start the development server.

## Security Note
The application uses role-based access control (RBAC). Users are assigned roles (`admin`, `cashier`, `customer`) in their Firestore user document. Security rules enforce that only authorized roles can access sensitive collections like `dailyReports` or `settings`.
