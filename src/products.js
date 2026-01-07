import { randomUUID } from "crypto";
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(String(process.env.DATABASE_URL))

export class Database {
    #videos = new Map()

    async create(produto) {
        
        const produtoID = randomUUID()

        const { name, price, stock } = produto
        
        await sql`INSERT INTO products (id, name, price, stock) VALUES (${produtoID}, ${name}, ${price}, ${stock})`
    }

    async list(name) {
        let products

        if (name && name != '') {
            products = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`}`
        } else {
            products = await sql`SELECT * FROM products`
        }
        
        return products
    }

    async update(id, produto) {
        const { name, price, stock } = produto

        await sql`UPDATE products SET name = ${name}, price = ${price}, stock = ${stock} WHERE id = ${id}`
    }

    async delete(id) {
        await sql`DELETE FROM products WHERE id = ${id}`
    }
}