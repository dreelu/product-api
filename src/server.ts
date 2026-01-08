import Fastify from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { routeProducts } from './routes/routes.js'
import 'dotenv/config';

const fastify = Fastify({
    logger:true
})

// Swagger =============================================================

await fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Product API',
            version: '1.0.0',
        }
    }
})

await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// Routes =============================================================

fastify.register(routeProducts, { prefix: '/products' })

// List =============================================================
const PORT = Number(process.env.PORT) || 3000

fastify.listen({
    port: PORT,
    host: '0.0.0.0',

}).then(() => console.log('Server on!'))
