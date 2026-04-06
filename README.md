# Finance Dashboard Backend API

A robust and scalable RESTful API for managing financial records with role-based access control, built with Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Live API](#live-api)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [API Endpoints Reference](#api-endpoints-reference)
- [Design Decisions & Assumptions](#design-decisions--assumptions)
- [Testing](#testing)

---

## Overview

This backend system provides a comprehensive API for a finance dashboard application where different users interact with financial records based on their assigned roles. The system implements three-tier role-based access control (Viewer, Analyst, Admin) with proper data isolation and audit trails.

**Key Concept**: The system tracks **who created each financial record** via `creator_id`, enabling future multi-user audit capabilities while maintaining strict role-based permissions.

---

## Key Features

### Core Functionality

- ✅ **User Management** - Complete CRUD operations with role assignment
- ✅ **Financial Records Management** - Track income/expense transactions with category support
- ✅ **Category Management** - Organize transactions with custom categories
- ✅ **Dashboard Analytics** - Real-time summaries, trends, and insights
- ✅ **Creator Tracking** - Audit trail via `creator_id` field

### Security & Access Control

- ✅ **JWT Authentication** - Stateless, secure token-based authentication
- ✅ **Role-Based Access Control (RBAC)** - Three-tier permission system
- ✅ **Rate Limiting** - Protection against brute force and API abuse
- ✅ **Password Hashing** - Bcrypt encryption for secure password storage
- ✅ **Input Validation** - Comprehensive validation using express-validator

### Data Features

- ✅ **Pagination** - Efficient handling of large datasets
- ✅ **Search & Filtering** - Advanced query capabilities
- ✅ **Soft Delete** - Data recovery and audit trail maintenance
- ✅ **Date Range Queries** - Time-based analytics
- ✅ **Category-wise Breakdown** - Organized financial insights

---

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: PostgreSQL (v16+)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Security**: bcryptjs
- **Rate Limiting**: express-rate-limit
- **Environment**: dotenv

---

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or higher)
- PostgreSQL (v16 or higher)
- npm or yarn package manager
- Git (for cloning the repository)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-dashboard-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_dashboard
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Database Setup

### Option 1: Automated Setup (Recommended)

```bash
psql -U postgres -f database/schema.sql
```

### Option 2: Manual Setup

1. Create the database:

```sql
CREATE DATABASE finance_dashboard_db;
```

2. Connect and run the initialization script:

```bash
psql -U postgres -d finance_dashboard_db -f database/schema.sql
```

### Database Schema

The system uses the following tables:

**tbl_users**

- `id` (UUID PRIMARY KEY AUTO GENERATE)
- `name`, `email`, `password`, `role`, `status`
- `created_at`, `updated_at`

**tbl_categories**

- `id` (SERIAL PRIMARY KEY)
- `category_type` (UNIQUE)
- - `status` (Boolean)
- `created_at`, `updated_at` (CURRENT TIMESTAMP)

**tbl_financial_records**

- `id` (UUID PRIMARY KEY)
- `user_id` (FK → users.id) - Record belongs to this user
- `category_id` (FK → categories.id)
- `creator_id` (users.id) - **Who created this record**
- `amount`, `type`, `date`, `description`
- `is_deleted` (for soft delete)
- `created_at`, `updated_at` (CURRENT TIMESTAMP)

### Default Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | <admin@test.com> | admin123 | Full system access |
| Analyst | <analyst@test.com> | analyst123 | View Dashboard and records data |
| Viewer | <viewer@test.com> | viewer123 | View own data only |

---

## Environment Configuration

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Live API

🔗 Base URL:

```bash
https://zorvyn-financial-dashboard-backend-api.onrender.com
```

🔗 Health Check:

```bash
https://zorvyn-financial-dashboard-backend-api.onrender.com/health
```

> ⚠️ > ⚠️ Note: The API is hosted on Render's free tier. The first request may take 30–60 seconds to respond due to cold start.

---

## Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection pool
│   │   └── env.js               # Environment variables
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validateRole.js      # Role-based access control
│   │   ├── rateLimiter.js       # API rate limiting
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── User.js              # User data operations
│   │   ├── FinancialRecord.js   # Financial records operations
│   │   ├── Category.js          # Category operations
│   │   └── Index.js             # Export Above models
│   ├── services/
│   │   ├── auth.service.js      # Authentication logic
│   │   ├── user.service.js      # User management logic
│   │   ├── record.service.js    # Record management logic
│   │   ├── category.service.js  # Category management logic
│   │   └── dashboard.service.js # Analytics logic
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth request handlers
│   │   ├── user.controller.js   # User request handlers
│   │   ├── record.controller.js # Record request handlers
│   │   ├── category.controller.js # Category request handlers
│   │   └── dashboard.controller.js # Dashboard handlers
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── user.routes.js       # User management routes
│   │   ├── record.routes.js     # Financial record routes
│   │   ├── category.routes.js   # Category routes
│   │   └── dashboard.routes.js  # Dashboard analytics routes
│   ├── utils/
│   │   ├── response.js          # Standardized API responses
│   │   └── validation.js        # Validation utilities
│   └── app.js                   # Express application setup
├── database/
│   └── schema.sql               # Database schema & seed data
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## API Documentation (Postman Collection)

[API Documentation Collection](https://documenter.getpostman.com/view/53365826/2sBXiqEp2v#ffcd2b75-390f-4a5a-8097-bbf0da9f009b)

---

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Standard Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Paginated Response:**

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email"
    }
  ]
}
```

---

## Role-Based Access Control

### Permission Matrix

| Resource | Viewer | Analyst | Admin |
|----------|--------|---------|-------|
| **Authentication** |
| Login | ✅ | ✅ | ✅ |
| Get Profile | ✅ | ✅ | ✅ |
| **Users** |
| View All Users | ❌ | ❌ | ✅ |
| View User by ID | ❌ | ❌ | ✅ |
| Create User | ❌ | ❌ | ✅ |
| Update User | ❌ | ❌ | ✅ |
| Delete User | ❌ | ❌ | ✅ |
| **Categories** |
| View Categories | ❌ | ✅ | ✅ |
| Create Category | ❌ | ❌ | ✅ |
| Update Category | ❌ | ❌ | ✅ |
| Delete Category | ❌ | ❌ | ✅ |
| **Financial Records** |
| View All Records | ❌ | ✅ (All) | ✅ (All) |
| View Record by ID | ❌ | ✅ | ✅ |
| Create Record | ❌ | ❌ | ✅ |
| Update Record | ❌ | ❌ | ✅ |
| Delete Record (Soft) | ❌ | ❌ | ✅ |
| **Dashboard** |
| View Summary | ✅ (Own) | ✅ (All) | ✅ (All) |
| View Category Breakdown | ✅ (Own) | ✅ (All) | ✅ (All) |
| View Recent Activity | ✅ (Own) | ✅ (All) | ✅ (All) |
| View Monthly Trends | ✅ (Own) | ✅ (All) | ✅ (All) |

### Role Descriptions

#### 👁️ Viewer

- **Purpose**: Personal finance tracking
- **Access**: View only their own financial data
- **Use Case**: Individual users managing personal expenses
- **Data Scope**: Records where `user_id` matches their ID

#### 📊 Analyst

- **Purpose**: Financial analysis and reporting
- **Access**: View all financial records across organization
- **Use Case**: Finance team members analyzing spending patterns
- **Data Scope**: All records, all users
- **Special Note**: Cannot create/modify records (read-only analyst)

#### 🔑 Admin

- **Purpose**: System management and record creation
- **Access**: Full CRUD on all resources
- **Use Case**: System administrators and authorized record creators
- **Data Scope**: Everything
- **Creator Tracking**: When admin creates a record, their ID is stored in `creator_id`

---

## API Endpoints Reference

### 🔐 Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### 👥 User Management (Admin Only)

All user endpoints require admin authentication.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users with pagination |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users` | POST | Create new user |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Delete user |

---

### 🏷️ Category Endpoints

#### Get All Categories

```http
GET /api/category
Authorization: Bearer <token>
```

**Access**: Analyst, Admin

#### Create Category

```http
POST /api/category
Authorization: Bearer <admin_token>

{
  "type": "Investment"
}
```

**Access**: Admin only

#### Update Category

```http
PUT /api/category/:id
Authorization: Bearer <admin_token>

{
  "type": "Updated Category"
}
```

**Access**: Admin only

#### Delete Category

```http
DELETE /api/category/:id
Authorization: Bearer <admin_token>
```

**Access**: Admin only

---

### 💰 Financial Records

#### Get All Records

```http
GET /api/records?page=1&limit=10&type=income&startDate=2024-01-01
Authorization: Bearer <token>
```

**Access**: Analyst (all records), Admin (all records)

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page (max 100)
- `type`: income/expense
- `category`: Filter by category
- `startDate`: ISO date
- `endDate`: ISO date
- `search`: Search term

#### Create Record

```http
POST /api/records
Authorization: Bearer <admin_token>

{
  "userId": 1,
  "amount": 1500.00,
  "type": "income",
  "categoryId": 2,
  "date": "2024-01-20",
  "description": "Freelance project" // Optional
}
```

**Access**: Admin only
**Note**: `creator_id` automatically set to authenticated admin

#### Update Record

```http
PUT /api/records/:id
Authorization: Bearer <admin_token>

{
  "amount": 1750.00
}
```

**Access**: Admin only

#### Delete Record

```http
DELETE /api/records/:id
Authorization: Bearer <admin_token>
```

**Access**: Admin only (soft delete)

---

### 📊 Dashboard Analytics

All dashboard endpoints are accessible to authenticated users. Data is filtered based on role.

| Endpoint | Description | Role Filtering |
|----------|-------------|----------------|
| `/api/dashboard/summary` | Financial summary | Viewer: Own data<br>Analyst/Admin: All data |
| `/api/dashboard/category-breakdown` | Category totals | Viewer: Own data<br>Analyst/Admin: All data |
| `/api/dashboard/recent-activity` | Recent transactions | Viewer: Own data<br>Analyst/Admin: All data |
| `/api/dashboard/monthly-trends` | Monthly trends | Viewer: Own data<br>Analyst/Admin: All data |
| `/api/dashboard` | Complete dashboard | Viewer: Own data<br>Analyst/Admin: All data |

---

## Design Decisions & Assumptions

### 1. Creator Tracking (`creator_id`)

**Decision**: Track which user created each record.

**Why**:

- Audit trail for compliance
- Future multi-admin scenarios
- Data accountability
- Workflow tracking

**Example**:

```javascript
// Admin ID 5 creates record for User ID 1
{
  user_id: 1,      // Record belongs to User 1
  creator_id: 5,   // Created by Admin 5
  amount: 500,
  ...
}
```

### 2. Admin-Only Record Creation

**Decision**: Only admins can create/update/delete records.

**Why**:

- Controlled data entry
- Prevents unauthorized changes
- Maintains data quality
- Clear responsibility chain

**Analyst role is read-only by design** - they analyze, not create.

### 3. Category Foreign Key

**Decision**: Categories as separate table with FK relationship.

**Why**:

- Data consistency
- Prevents typos
- Enables category management
- Future extensibility (icons, budgets, etc.)

### 4. Soft Delete

**Decision**: Mark deleted, don't remove.

**Why**:

- Audit trail preservation
- Data recovery option
- Referential integrity maintained
- Compliance friendly

### 5. Role-Based Data Filtering

**Decision**: Different data visibility per role.

**Implementation**:

- Viewer: Only their `user_id` records
- Analyst/Admin: All records

**Why**: Privacy for personal use, transparency for analysis.

### 6. Express-Validator

**Decision**: Use express-validator over Joi.

**Why**:

- Native Express integration
- Route-level validation visibility
- Less boilerplate
- Fits assignment simplicity goal

### Assumptions

1. **Single Organization**: All users in one org
2. **Single Currency**: No multi-currency support
3. **UTC Timestamps**: No timezone handling
4. **No File Uploads**: Text-only data
5. **English Only**: No i18n
6. **Email as Username**: No separate username field

---

## Testing

### Quick Test with cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. Save token
export TOKEN="<your_token>"

# 3. Get categories
curl http://localhost:3000/api/category \
  -H "Authorization: Bearer $TOKEN"

# 4. Create record
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "amount": 1000,
    "type": "income",
    "categoryId": 1,
    "date": "2024-01-25"
  }'

# 5. Get dashboard
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Test Role Restrictions

```bash
# Login as Analyst
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@example.com","password":"admin123"}'

export ANALYST_TOKEN="<token>"

# View records (should work)
curl http://localhost:3000/api/records \
  -H "Authorization: Bearer $ANALYST_TOKEN"

# Try to create (should fail - 403)
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer $ANALYST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"amount":100,"type":"income","categoryId":1,"date":"2024-01-25"}'
```

### Postman Testing

Import these files:

- `Finance_Dashboard_API.postman_collection.json`
- `Finance_Dashboard_Dev.postman_environment.json`

See `POSTMAN_GUIDE.md` for detailed instructions.

---

## Error Handling

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database error |

---

## Security Best Practices

### Implemented ✅

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- SQL injection protection
- Role-based access

---

## Contributing

This is an assignment project demonstrating:

- Clean architecture
- RBAC implementation
- RESTful API design
- Security best practices
- Comprehensive documentation

---

## License

Educational/Assessment purposes

---

**Built with clarity, security, and maintainability in mind** 🚀
