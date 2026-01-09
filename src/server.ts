import Fastify from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { routeProducts } from './routes/routes.js'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import 'dotenv/config';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({
    logger:true
}).withTypeProvider<ZodTypeProvider>()

// Zod =================================================================

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// CORS ================================================================

fastify.register(fastifyCors, {
    origin: 'false',
    methods: ['GET, POST, PUT, DELETE']
})

// Swagger =============================================================

await fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Product API',
            version: '1.0.0',
        }
    },
    transform: jsonSchemaTransform
})

await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// Routes ==============================================================

fastify.register(routeProducts, { prefix: '/products' })

// List ================================================================
const PORT = Number(process.env.PORT) || 3333

fastify.listen({
    port: PORT,
    host: '0.0.0.0',

}).then(() => console.log('Server on!'))
