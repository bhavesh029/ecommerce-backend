<p align="center">
<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A robust E-Commerce Backend API built with <a href="http://nodejs.org" target="_blank">Node.js</a>, <strong>NestJS</strong>, <strong>TypeORM</strong>, and <strong>PostgreSQL</strong>.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.google.com/search?q=https://img.shields.io/badge/Docker-Enabled-blue" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/Docker-Enabled-blue" alt="Docker" /></a>
<a href="https://www.google.com/search?q=https://img.shields.io/badge/PostgreSQL-Ready-336791" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/PostgreSQL-Ready-336791" alt="Postgres" /></a>
<a href="https://www.google.com/search?q=http://localhost:3000/api" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/Swagger-Docs-85EA2D" alt="Swagger" /></a>
</p>

Description

This is a fully containerized E-Commerce Backend Application. It manages the complete lifecycle of online shopping, including product inventory, smart cart management, user orders, and a complex "Nth Customer" discount system.

🚀 Key Features

🛍 Products & Inventory: Full CRUD with strict stock validation (Integer IDs & Quantities).

🛒 Smart Cart: Add/Remove items with real-time inventory checks. Supports persistent user carts.

📦 Checkout Transaction: ACID-compliant order processing that freezes item prices and deducts stock.

🎟 Nth Order Coupons: Unique logic that rewards specific users on their Nth order (configurable via .env).

📊 Admin Analytics: Secured endpoints (API Key protected) to view sales stats and manually trigger coupons.

🐳 Dockerized: Zero-config setup with Docker Compose (supports Hot Reload for dev).

✅ CI/CD: GitHub Actions pipeline for Linting, Type Checking, and Testing.

Database Schema

erDiagram
    User ||--o{ Cart : "has"
    User ||--o{ Order : "places"
    
    Cart ||--o{ CartItem : "contains"
    CartItem }|--|| Product : "references"
    
    Order ||--o{ OrderItem : "contains"
    OrderItem }|--|| Product : "snapshots"
    
    Coupon {
        string code
        int discountPercentage
        boolean isUsed
    }

    User {
        int id
        string email
        string name
    }

    Product {
        int id
        string name
        decimal price
        int quantity
    }


Prerequisites

Ensure you have the following installed:

Docker & Docker Compose (Recommended approach)

Node.js (v18+) & npm (Only if running locally without Docker)

Environment Setup

Create a .env file in the root directory:

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=ecommerce_db

# Application
PORT=3000
DISCOUNT_NTH_INTERVAL=5   # Every 5th order per user gets a coupon
ADMIN_API_KEY=mySuperSecretKey # Header: x-admin-api-key


Project setup (Local)

$ npm install


Compile and run the project

Using Docker (Recommended)

# Build and start the application (with Hot Reload)
$ docker-compose up --build

# Stop the application
$ docker-compose down


Using NPM (Local)

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


Run tests

You can run tests locally or inside the Docker container to match the CI environment.

# unit tests (Local)
$ npm run test

# unit tests (Inside Docker)
$ docker-compose run --rm api npm run test

# test coverage
$ npm run test:cov


API Documentation

The application uses Swagger for interactive API documentation.

👉 Access here: http://localhost:3000/api

Core Endpoints:

POST /products: Create inventory.

POST /cart/add: Add item to user's cart.

POST /orders/checkout: Finalize purchase.

POST /coupons/request-nth: Check eligibility for Nth order reward.

GET /admin/stats: View store analytics (Requires x-admin-api-key).

Technical Approach

The "Nth Order" Logic

We implemented a logic where every Nth order for a specific user triggers a reward.

Configuration: DISCOUNT_NTH_INTERVAL in .env sets N (e.g., 5).

Algorithm: The system counts the specific user's previous orders. If (count + 1) % N === 0, a unique coupon is generated.

Uniqueness: Codes are generated as LUCKY-{UserId}-{OrderIndex} to prevent collisions.

Inventory Management

To prevent overselling:

Cart Level: Adding an item checks product.quantity.

Checkout Level: A database transaction creates the order and decrements product stock atomically. If stock runs out mid-transaction, the entire order rolls back.

Deployment

This project is containerized using Dockerfile, making it easy to deploy to any cloud provider supporting Docker (AWS ECS, Google Cloud Run, DigitalOcean, etc.).

The standard build command for production is:

$docker build -t ecommerce-backend .$ docker run -p 3000:3000 ecommerce-backend


Resources

Check out a few resources that may come in handy when working with NestJS:

Visit the NestJS Documentation to learn more about the framework.

For questions and support, please visit our Discord channel.

To dive deeper and get more hands-on experience, check out our official video courses.

Visualize your application graph and interact with the NestJS application in real-time using NestJS Devtools.

License

Nest is MIT licensed.