import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    startTime: bigint
  }

  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>
  }
}
