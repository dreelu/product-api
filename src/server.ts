import  Fastify, { FastifyRequest, type FastifyError } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { routeProducts, ping } from './routes/productRoutes.js';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors, type ZodTypeProvider } from 'fastify-type-provider-zod';
import 'dotenv/config';
import fastifyCors from '@fastify/cors';
import jwt from '@fastify/jwt'
import fastifyRequestLogger from "@mgcrea/fastify-request-logger";
import { startTimeHook } from './plugins/observability.js';
import { routeLogin, routeRegister } from './routes/authRoutes.js';

const fastify = Fastify({
    logger: {
      level: 'debug',
      transport: {
        target: "@mgcrea/pino-pretty-compact",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      }
    },
}).withTypeProvider<ZodTypeProvider>()

fastify.register(fastifyRequestLogger)

startTimeHook(fastify)

// ErrorHandling ========================================================

fastify.setErrorHandler((error:FastifyError, req, reply) => {

  const statusCode = error.statusCode ?? 500

  console.error(error)

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: req.method,
        url: req.url,
      },
    });
  }

  return reply.code(statusCode).send({
    message: error.message || "Internal Server Error"
  })
})

// Zod =================================================================

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// CORS ================================================================

fastify.register(fastifyCors, {
    origin: 'false',
    methods: ['GET, POST, PUT, DELETE']
})

// JWT

fastify.register(jwt, {
  secret: String(process.env.JWT_SECRET)
})

// PreHandler

fastify.decorate("authenticate", async function (req) {
  await req.jwtVerify()
})

// Swagger =============================================================

await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
        info: {
            title: 'Product API',
            version: 'Beta 3.2.2',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
    },
    transform: jsonSchemaTransform
})

await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

// Routes ==============================================================

fastify.register(routeProducts, { prefix: '/products' })
fastify.register(routeRegister, {prefix: '/register'})
fastify.register(routeLogin, {prefix: '/login'})
fastify.register(ping, {prefix: '/ping'})

// List ================================================================

const PORT = Number(process.env.PORT) || 3000

fastify.listen({
    port: PORT,
    host: '0.0.0.0',

}).then(() => console.log('Server on!'))
