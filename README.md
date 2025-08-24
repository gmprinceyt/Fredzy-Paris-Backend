# Fredzy Paris — Backend

Backend for the Fredzy Paris e-commerce project.

Author: Prince (GitHub: @gmprinceyt)  
License: ISC

---

## Overview

Fredzy Paris is an e-commerce backend written in TypeScript and built on Express. It provides APIs for users, products, orders and payments (Razorpay integration), plus inventory/dashboard endpoints for admins. The project uses MongoDB (mongoose), file uploads (multer), caching (node-cache), and common middleware for logging, validation and error handling.

---

## Quick links

- Postman collection (share link):  
  https://web.postman.co/workspace/My-Workspace~c2a5c9ad-6741-41c9-8450-50da87fcb81f/collection/33817052-6e592f03-fa12-46b3-9c10-d74ee27a3998?action=share&source=copy-link&creator=33817052

- Postman collection (API export):  
  https://api.postman.com/collections/33817052-6e592f03-fa12-46b3-9c10-d74ee27a3998?access_key=

Import the collection into Postman (Import → Link) to quickly test the API.

Recommended Postman environment variables:
- base_url: http://localhost:3000
- jwt_token: (set after login)
- payment_key_id
- payment_key_secret

Use Authorization header: Authorization: Bearer {{jwt_token}} for protected endpoints.

---

## Getting started

Prerequisites
- Node.js (>= 18 recommended)
- npm
- MongoDB instance
- Razorpay account (for payment flows)

Installation
1. Clone the repository:
   git clone https://github.com/gmprinceyt/Fredzy-Paris-Backend.git
2. Install dependencies:
   npm install

Environment
Create a `.env` in project root with values similar to:

PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/fredzy-paris
JWT_SECRET=your_jwt_secret_here
PAYMENT_KEY_ID=your_razorpay_key_id
PAYMENT_SECRET=your_razorpay_key_secret
UPLOAD_DIR=./uploads

Build & run
- Build TypeScript:
  npm run build
- Start:
  npm start
- Dev (watch / restart built file):
  npm run dev
- Watch TypeScript:
  npm run watch

The app serves static uploads from /uploads and exposes API under /api/v1.

---

## Health / root

- GET /  
  - Public. Quick check route that responds with "Working All ✅".

---

## API Endpoints

Note: All endpoints are prefixed with /api/v1.

User routes (/api/v1/user)
- POST /user/new  
  - Create/register a new user. Public.
- GET /user/all  
  - Get all users. Admin only.
- GET /user/:id  
  - Get user by id. Public (or protected depending on implementation).
- DELETE /user/:id  
  - Delete a user by id. Admin only.

Product routes (/api/v1/product)
- GET /product/latest  
  - Get latest 5 products. Public.
- GET /product/categories  
  - Get product categories. Public.
- GET /product/search?search=&category=&price=&sort=&page=  
  - Search & filter products. Public.
- POST /product/create  
  - Create a product. Admin only. (multipart/single file upload)
- GET /product/admin-product  
  - Get all products for admin. Admin only.
- GET /product/:id  
  - Get single product by id.
- DELETE /product/:id  
  - Delete product by id. Admin only.
- PUT /product/:id  
  - Update product by id. Admin only. (multipart/single file upload)

Order routes (/api/v1/order)
- (Order routes are available under /api/v1/order; import the Postman collection to view exact request signatures and sample bodies.)
  - Typical operations: create order, get user orders / admin orders, update order status, get single order, etc.

Payment routes (/api/v1/payment)
- POST /payment/order  
  - Create a Razorpay order (expects { amount }). Public (used at checkout).
- POST /payment/verify  
  - Verify a payment (Razorpay signature verification).
- GET /payment/coupon/discount?code=XYZ  
  - Validate coupon and return discount amount.
- POST /payment/coupon/new  
  - Create a new coupon. Admin only.
- GET /payment/coupon/all  
  - Get all coupons. Admin only.
- DELETE /payment/coupon/:code  
  - Delete coupon by code. Admin only.

Inventory / Dashboard routes (/api/v1/inventory)
- GET /inventory/dashboard  
  - Dashboard stats (orders count, revenue, stock, latest transactions). Admin only.
- GET /inventory/pie  
  - Pie chart data for inventory dashboard. Admin only.
- GET /inventory/bar  
  - Bar chart data for inventory dashboard. Admin only.
- GET /inventory/line  
  - Line chart data for inventory dashboard. Admin only.

---

## Postman: import & usage

1. Open Postman → Import → Link and paste:
   https://api.postman.com/collections/33817052-6e592f03-fa12-46b3-9c10-d74ee27a3998?access_key=

2. Create an environment with the variables listed earlier (base_url, jwt_token, etc.). Replace base_url with your local server (e.g., http://localhost:3000).

3. Run the endpoints in the collection. After login/register, copy the returned token into jwt_token to authorize protected calls.

---

## Notes & suggestions

- The collection linked above contains request examples and saved bodies — import it to see exact JSON schemas expected by endpoints (orders, coupons, user creation, product create, etc.).
- Consider adding a Postman Environment JSON file or exporting the collection into repo (e.g., /postman) for easier onboarding.
- Add OpenAPI/Swagger documentation for interactive API docs and clearer request/response schemas.

---

## Contributing

- Fork the repository and create feature branches.
- Keep commits small and descriptive.
- Open PRs to main with a clear description and any breaking changes.
- Add/update tests and documentation for new features.

---

## Contact

Author: Prince — https://github.com/gmprinceyt

---
