import { randomUUID } from "crypto";
import { type FastifyInstance } from "fastify";
import { neon } from '@neondatabase/serverless';
import 'dotenv/config'

const sql = neon(String(process.env.DATABASE_URL))

export async function routeProducts(app: FastifyInstance) {
    app.post('/products', async (req, reply) => {
    try {
        const productID = randomUUID()

        const { name, price, stock } = req.body as {
            name: string,
            price: number,
            stock: number
        }
        
        await sql`INSERT INTO products (id, name, price, stock) VALUES (${productID}, ${name}, ${price}, ${stock})`

        return reply.code(201).send()
    }catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
    })

    app.get('/products', async (req, reply) => {
    try {

        const products = await sql`SELECT * FROM products`

        return products
    } catch (error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
    })

    app.get('/products/:name', async (req, reply) => {
    try {
        const { name } = req.params as {
            name: string
        }

        const products = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`}`

        return products
    } catch (error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
    })

    app.put('/products/:id', async (req, reply) => {
    try {
        const { id, name, price, stock  } = req.params as {
            id: string,
            name: string,
            price: number,
            stock: number
        }

        await sql`UPDATE products SET name = ${name}, price = ${price}, stock = ${stock} WHERE id = ${id}`

        return reply.code(204).send()
    } catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
    })

    app.delete('/products/:id', async (req, reply) => {
    try {
        const { id } = req.params as {
            id: string
        }
        
        await sql`DELETE FROM products WHERE id = ${id}`

        return reply.code(204).send()
    } catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
    })
}