import { randomUUID } from "crypto";
import { type FastifyTypedInstance } from "../types/types.js";
import { neon } from '@neondatabase/serverless';
import z from 'zod';
import 'dotenv/config'
import { ProductsListResponse, ProductsResponseSchema, BodySchema, ParamsSchema, querySchema, ErrorSchema, ZodTypeErrorSchema, HeaderSchema } from "../schemas/schemas.js";

const sql = neon(String(process.env.DATABASE_URL))

export async function routeProducts(app: FastifyTypedInstance) {
    app.post('/', {
        schema: {
            tags: ['Products'],
            description: 'Create a new product.',
            body: BodySchema,
            headers: HeaderSchema,
            security: [{ bearerAuth: [] }],
            response: {
                201: z.null().describe('Product created.'),
                400: ZodTypeErrorSchema,
            }
        },
        preHandler: [app.authenticate]
    }, async (req, reply) => {
        const productID = randomUUID()

        const { name, price, stock } = req.body
        const owner_uid = req.user.uid
        
        await sql`INSERT INTO products (id, name, price, stock, owner_uid) VALUES (${productID}, ${name}, ${price}, ${stock}, ${owner_uid})`

        return reply.code(201).send(null)


    })

    app.get('/', {
        schema: {
            tags: ['Products'],
            description: 'List all the products.',
            response: {
                200: ProductsListResponse,
                401: ErrorSchema,
                404: ErrorSchema,
                500: ErrorSchema,
            },
            security: [{ bearerAuth: [] }],
            querystring: querySchema
        },
        preHandler: [app.authenticate]
    }, async (req, reply) => {

        const { id, name } = req.query
        const {role, uid} = req.user

        let rawProducts;

        // If the user tried to show all the products, but it isen't an adm
        if (!id && !name) {
            if (role == 'adm') {
                rawProducts = await sql`SELECT * FROM products`
            } else{
                rawProducts = await sql`SELECT * FROM products WHERE owner_uid = ${uid}`
            }
        } else if (id) {
            rawProducts = await sql`SELECT * FROM products WHERE id = ${id} AND owner_uid = ${uid}`
        } else if (name) {
            rawProducts = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`} AND owner_uid = ${uid}`
        }
        
        console.log(`USER INFO \n NAME: ${name}\n ROLE: ${role}`) //debug

        
        const products = ProductsResponseSchema.array().parse(rawProducts)

        // If not foud.
        if (products.length === 0) {
            return reply.status(404).send({message: "Not found."})
        }

        return reply.status(200).send(products)
    })

    app.put('/:id', {
        schema: {
            tags: ['Products'],
            description: 'Update a entire product.',
            params: ParamsSchema,
            body: BodySchema,
            security: [{ bearerAuth: [] }],
            response: {
                204: z.null().describe("Product updated."),
                404: ErrorSchema,
            }
        },
        preHandler: [app.authenticate]
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
            tags: ['Products'],
            description: 'Delete a product.',
            params: ParamsSchema,
            security: [{ bearerAuth: [] }],
            response: {
                204: z.null().describe("Product deleted."),
                404: ErrorSchema,
            }
        },
        preHandler: [app.authenticate]
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