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

    const products = await database.list(nome)

    return products
})

fastify.put('/products/:id', async (req, reply) => {
    const { id } = req.params

    await database.update(id, req.body)

    return reply.code(204).send()
})

fastify.delete('/products/:id', async (req, reply) => {
    const { id } = req.params
    
    await database.delete(id)

    return reply.code(204).send()
})

fastify.listen({
    port: 3000,
    listenTextResolver: () => console.log('http://localhost:3000')
})