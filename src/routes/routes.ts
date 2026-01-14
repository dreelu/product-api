import { randomUUID } from "crypto";
import { type FastifyTypedInstance, type Product } from "../types/types.js";
import { neon } from '@neondatabase/serverless';
import z from 'zod';
import 'dotenv/config'
import { ProductsListResponse, ProductsResponseSchema, BodySchema, ParamsSchema, querySchema } from "../schemas/schemas.js";

const sql = neon(String(process.env.DATABASE_URL))

export async function routeProducts(app: FastifyTypedInstance) {
    app.post('/', {
        schema: {
            tags: ['products'],
            description: 'Create a new product.',
            body: BodySchema,
            response: {
                201: z.null().describe('User created.')
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

        return reply.code(201).send()


    })

    app.get('/', {
        schema: {
            tags: ['products'],
            description: 'List all the products.',
            response: {
                200: ProductsListResponse,
            },
            querystring: querySchema
        }
    }, async (req, reply) => {

        const { id, name } = req.query as Pick<Product, 'id' | 'name'>

        let rawProducts;

        if (id) {
            rawProducts = await sql`SELECT * FROM products WHERE id ILIKE ${`%${id}%`}`
        } else if (name) {
            rawProducts = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`}`
        } else {
            rawProducts = await sql`SELECT * FROM products`
        }

        const products = ProductsResponseSchema.array().parse(rawProducts)

        console.log(products) //DEBUG

        return reply.status(200).send(products)
    })

    // app.get('/:name', {
    //     schema: {
    //         tags: ['products'],
    //         description: 'List products by name.',
    //         params: ParamsSchema.pick({name:true}),
    //         response: {
    //             200: ProductsListResponse,
    //         }
    //     }
    // }, async (req, reply) => {

    //     const { name } = req.params as {
    //         name: string
    //     }

    //     const rawProducts = await sql`SELECT * FROM products WHERE name ILIKE ${`%${name}%`}`

    //     const products = ProductsResponseSchema.array().parse(rawProducts)

    //     return reply.status(200).send(products)

    // })

    app.put('/:id', {
        schema: {
            tags: ['products'],
            description: 'Update a entire product.',
            params: ParamsSchema.pick({id:true}),
            body: BodySchema,
            response: {
                204: ProductsResponseSchema,
            }
        }
    }, async (req, reply) => {
        const { id, name, price, stock  } = req.params as Product

        await sql`UPDATE products SET name = ${name}, price = ${price}, stock = ${stock} WHERE id = ${id}`

        return reply.code(204).send()

    })

    app.delete('/:id', {
        schema: {
            tags: ['products'],
            description: 'Delete a product.',
            params: ParamsSchema.pick({id:true}),
            response: {
                204: ProductsResponseSchema,
            }
        }
    }, async (req, reply) => {
        const { id } = req.params as {
            id: string
        }
        
        await sql`DELETE FROM products WHERE id = ${id}`

        return reply.code(204).send()
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