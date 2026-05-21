# Coffee Shop POS System — Architecture Spec

---

## 1. System Overview

### Roles
- **admin**: approves payments, manages products, handles inventory adjustments
- **cashier**: creates orders, uploads payment slips
- **owner**: views financial reports, business insights

### Core Flow
1. Cashier creates order (Order = pending)
2. System generates OrderItems + totalAmount
3. Customer pays externally
4. Cashier uploads payment slip (PaymentSlip = pending)
5. Admin reviews slip:
   - approve → Order = paid
   - reject → Order = rejected
6. On approval:
   - stock is deducted
   - stock movement logged
   - financial report updated

---

## 2. Tech Stack

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Frontend
- React
- Vite
- REST API integration

---

## 3. Data Models (Prisma Draft)

### User
- id: string
- name: string
- email: string (unique)
- passwordHash: string
- role: enum [admin, cashier, owner]

### Product
- id: string
- name: string
- price: int (THB)
- stockQty: int
- isActive: boolean

### Order
- id: string
- userId: string
- totalAmount: int
- status: enum [pending, paid, rejected]
- createdAt: datetime

### OrderItem
- id: string
- orderId: string
- productId: string
- qty: int
- price: int

### PaymentSlip
- id: string
- orderId: string
- imageUrl: string
- status: enum [pending, approved, rejected]
- uploadedAt: datetime

### StockMovement
- id: string
- productId: string
- changeQty: int
- type: enum [sale, adjustment]
- refOrderId: string?

### FinancialReport
- id: string
- date: date
- totalSales: int
- totalOrders: int
- netRevenue: int

---

## 4. API Contracts

### Auth
- POST /auth/login
  - body: { email, password }
  - response: { token, user }

### Products
- GET /products
- POST /products (admin)
- PATCH /products/:id (admin)

### Orders
- POST /orders
  - body: { items: [{ productId, qty }] }
- GET /orders/:id

### Payments
- POST /payments/slip
  - multipart/form-data: { orderId, image }
- POST /payments/:id/approve (admin)
- POST /payments/:id/reject (admin)

### Reports
- GET /reports/daily

---

## 5. Folder Structure

/backend
  /modules
    /auth
    /products
    /orders
    /payments
    /reports
  /services
  /middlewares
  /utils
  app.ts

/frontend
  /pages
  /components
  /features
  /api

---

## 6. Business Rules

- Stock is deducted ONLY after payment slip approval
- Orders remain "pending" until approved
- Financial reports include ONLY approved payments
- All state changes must be logged (audit-ready)

---

## 7. Integration Contracts

- Frontend ↔ Backend: REST JSON
- Slip upload: multipart/form-data
- Monetary values: INTEGER (THB only)
- No floating point currency usage allowed

---

## 8. Key Risks
- Race condition during stock deduction → require transaction safety
- Duplicate slip uploads → enforce unique orderId constraint
- Manual approval bottleneck → potential scalability issue

---

END OF SPEC
