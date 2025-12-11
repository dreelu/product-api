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

## Requirements
- Node.js 18+
- PostgreSQL installed or running via Docker
- `.env` file configured

## Environment Variables
Create a `.env` file:

```env
PGHOST=localhost
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=loja
PGPORT=5432
PORT=3000
```

# Installation

```bash
git clone https://github.com/YOUR-USER/YOUR-REPO.git
cd YOUR-REPO
npm install
```

## Start the server
`npm start`

## Routes
### GET /products

Returns all products.

### GET /products/search?nome=value

Search products by name (ILIKE).

### GET /products/:id

Returns a specific product.

### POST /products

Creates a product.
Expected body:

```json
{
  "nome": "Martelo",
  "preco": 10.00,
  "estoque": 50
}
```

### PUT /products/:id

Updates a product.

### DELETE /products/:id

Deletes a product.

## Database table

```sql
CREATE TABLE produtos (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  estoque INT NOT NULL
);
```

# Notes
- This project focuses only on the backend (no frontend included).
- Ready to evolve with validation, error handling, and Docker support.
- Default server: `http://localhost:3000`