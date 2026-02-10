import { randomUUID } from "crypto";
import { type FastifyTypedInstance } from "../types/types.js";
import { neon } from '@neondatabase/serverless';
import z from 'zod';
import 'dotenv/config'
import { ProductsListResponse, ProductsResponseSchema, BodySchema, ParamsSchema, querySchema, ErrorSchema, ZodTypeErrorSchema } from "../schemas/schemas.js";

const sql = neon(String(process.env.DATABASE_URL))

export async function routeProducts(app: FastifyTypedInstance) {
    app.post('/', {
        schema: {
            tags: ['products'],
            description: 'Create a new product.',
            body: BodySchema,
            response: {
                201: z.null().describe('Productj created.'),
                400: ZodTypeErrorSchema,
            }
        }
    }, async (req, reply) => {
        const productID = randomUUID()

        const { name, price, stock } = req.body as {
            name: string,
            price: number,
            stock: number
        }
        
        await sql`INSERT INTO products (id, name, price, stock) VALUES (${productID}, ${name}, ${price}, ${stock})`

        return reply.code(201).send(null)


    })

    app.get('/', {
        schema: {
            tags: ['products'],
            description: 'List all the products.',
            response: {
                200: ProductsListResponse,
                404: ErrorSchema,
                500: ErrorSchema,
            },
            querystring: querySchema
        }
    }, async (req, reply) => {

        const { id, name } = req.query

        let rawProducts;

        if (id) {
            rawProducts = await sql`SELECT * FROM products WHERE id = ${id}`
        } else if (name) {
            rawProducts = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`}`
        } else {
            rawProducts = await sql`SELECT * FROM products`
        }

        const products = ProductsResponseSchema.array().parse(rawProducts)

        // If not foud.
        if (products.length === 0) {
            return reply.status(404).send({message: "Not found."})
        }

        return reply.status(200).send(products)
    })

    app.put('/:id', {
        schema: {
            tags: ['products'],
            description: 'Update a entire product.',
            params: ParamsSchema,
            body: BodySchema,
            response: {
                204: z.null().describe("Product updated."),
                404: ErrorSchema,
            }
        }
    }, async (req, reply) => {
        const { id } = req.params

        const { name, price, stock  } = req.body

        const result = await sql`UPDATE products SET name = ${name}, price = ${price}, stock = ${stock} WHERE id = ${id} RETURNING id`

        // If not foud.
        if (result.length === 0) {
            return reply.status(404).send({message: "Not found."})
        }

        return reply.code(204).send(null)

    })

    app.delete('/:id', {
        schema: {
            tags: ['products'],
            description: 'Delete a product.',
            params: ParamsSchema,
            response: {
                204: z.null().describe("Product deleted."),
                404: ErrorSchema,
            }
        }
    }, async (req, reply) => {
        const { id } = req.params
        
        const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`

        // If not foud.
        if (result.length === 0) {
            return reply.status(404).send({message: "Not found."})
        }

        return reply.code(204).send(null)
    })
}

export async function ping(app: FastifyTypedInstance) {
    app.get('/', async (req, reply) => {

        const deltaTime = Number(process.hrtime.bigint() - req.startTime) / 1e6

        return {
            latency: `${deltaTime}ms`,
            message: 'pong'
        }
    })
}