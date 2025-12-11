import Fastify from 'fastify'

import { DatabasePostgres } from './products.js'

const database = new DatabasePostgres()

const fastify = Fastify({
    logger:true
})

fastify.post('/products', async (req, reply) => {
    try {
        await database.create(req.body)

        return reply.code(201).send()
    }catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
})

fastify.get('/products', async (req, reply) => {
    try {
        const { nome } = req.query

        const products = await database.list(nome)

        return products
    } catch (error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
})

fastify.put('/products/:id', async (req, reply) => {
    try {
        const { id } = req.params

        await database.update(id, req.body)

        return reply.code(204).send()
    } catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
})

fastify.delete('/products/:id', async (req, reply) => {
    try {
        const { id } = req.params
        
        await database.delete(id)

        return reply.code(204).send()
    } catch(error) {
        console.error(error)
        return reply.status(500).send( {error: 'Internal server error'})
    }
})

fastify.listen({
    port: 3000,
    listenTextResolver: () => console.log('http://localhost:3000')
})