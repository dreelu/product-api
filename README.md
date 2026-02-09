# Product CRUD (Node.js + Fastify + PostgreSQL)

Simple backend project for product management.  
Built to practice Node.js, Fastify, PostgreSQL, and basic REST API structure.

## Technologies
- ![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- postgres.js (driver)

## Features
- Create product  
- List all products  
- Search products by name (query)  
- Get product by ID  
- Update product  
- Delete product  

## Deploy

[Documentation](https://product-api-ee86.onrender.com/docs)

## Requirements
- Node.js 18+
- PostgreSQL installed or running via Docker
- `.env` file configured

## Environment Variables
Create a `.env` file:

```env
DATABASE_URL='YOUR-DATABASE-URL-HERE'
PORT=YOURPORT
```

# Installation

```bash
git clone https://github.com/dreelu/product-api
cd product-api
npm install
```

## Start the server
`npm start`

## Routes
### GET /products

Returns all products.
Expected response:

```json
{
  "id": "uuid",
  "name": "Hammer",
  "price": 10.00,
  "stock": 50
}
```

### GET /products?name=value

Search products by name (ILIKE).

### GET /products?id=value

Search products by id

### POST /products

Creates a product.
Expected body:

```json
{
  "name": "Hammer",
  "price": 10.00,
  "stock": 50
}
```

### PUT /products/:id

Updates a product.

### DELETE /products/:id

Deletes a product.

## Database table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL
);
```

# Notes
- This project focuses only on the backend (no frontend included).
- Ready to evolve with validation, error handling, and Docker support.
- Default server: `http://localhost:3000`
