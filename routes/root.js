export default async function (fastify, opts) {
  fastify.get('/u', async function (request, reply) {
    return { root: true }
  })
}
