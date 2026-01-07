import Fastify from 'fastify'
import { Database } from './products.js'

const database = new Database()

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
        const { name } = req.query

        const products = await database.list(name)

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


const PORT = process.env.PORT || 3000

fastify.listen({
    port: PORT,
    host: '0.0.0.0',
    listenTextResolver: () => console.log('http://localhost:3000')
})
