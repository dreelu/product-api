import { FastifyInstance } from "fastify"

export function startTimeHook(app:FastifyInstance) {
app.addHook('onRequest', (request, reply, done) => {

    request.startTime = process.hrtime.bigint()
    done()
})
}