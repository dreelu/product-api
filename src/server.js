import Fastify from 'fastify'

import { DatabasePostgres } from './products.js'

const database = new DatabasePostgres()

const fastify = Fastify({
    logger:true
})

fastify.post('/products', async (req, reply) => {
    await database.create(req.body)

    return reply.code(201).send()
})

fastify.get('/products', async (req, reply) => {
    const { nome } = req.query
    console.log(`NOME: ${nome}`)

    const products = await database.list(nome)

    return products
})

fastify.listen({
    port: 3000,
    listenTextResolver: () => console.log('http://localhost:3000')
})