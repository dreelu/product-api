import { randomUUID } from "crypto";
import bcrypt from "bcrypt"
import { type FastifyTypedInstance } from "../types/types.js";
import { neon } from '@neondatabase/serverless';
import z from 'zod';
import Fastify from 'fastify'
import 'dotenv/config'
import { ErrorSchema, LoginBodySchema, RegisterBodySchema, AuthResponseSchema } from "../schemas/schemas.js";

const sql = neon(String(process.env.DATABASE_URL))
const fastify = Fastify()

export async function routeRegister(app: FastifyTypedInstance) {
    app.post('/', {
        schema: {
            body: RegisterBodySchema,
            response: {
                201: AuthResponseSchema,
                400: ErrorSchema
            }
        }
    }, async(req, reply) => {
        const {email ,name, password} = req.body

        const res = await sql`SELECT * FROM users WHERE email = ${email}`

        // If user is already registred
        if (res.length != 0) {
            return reply.status(400).send({ message: "User already registred." }) //400?
        }
        
        const password_hash = await bcrypt.hash(password, 10)
        const id = randomUUID()
        const token = req.server.jwt.sign(
            { id: id, email: email },
            { expiresIn: '1h' }
        )

        await sql`INSERT INTO users (id, email, name, password_hash) VALUES (${id}, ${email}, ${name}, ${password_hash})`

        return reply.status(201).send({message: "User created.", token: token})

    })
}

export async function routeLogin(app: FastifyTypedInstance) {
    app.post('/', {
        schema: {
            body: LoginBodySchema,
            response: {
                200: AuthResponseSchema,
                400: ErrorSchema
            }
        }
    }, async(req, reply) => {
        const {email, password} = req.body

        const res = await sql`SELECT email, id FROM users WHERE email = ${email}`

        // If user isen't registred yet
        if (res.length === 0) {
            return reply.status(400).send({ message: "User not registred yet." }) //400?
        }

        const id = res[0].id
        const token = req.server.jwt.sign(
            { id: id, email: email },
            { expiresIn: '1h' }
        )

        return reply.status(200).send({ message: "Login sucessful.", token: token })

    })
}