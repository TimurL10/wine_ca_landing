import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import path from 'node:path'
import fs from 'fs'
import { fileURLToPath } from 'node:url'
import users_routes from './routes/root.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  const app = fastify({
    routerOptions: {
      ignoreTrailingSlash: true,
    },
  });
  app.addHook('onRequest', (req, reply, done) => {
    console.log('onRequest url:', req.raw.url)
    done()
  })
  const port = Number(process.env.PORT) || 3000

  // Подключаем pug через плагин
  await app.register(view, { engine: { pug } })

  await app.register(users_routes);

  //await app.register(courses_routes,{prefix:'/courses'});

  app.get('/', (req, reply) => {
    return reply.view('views/users.pug')
  })

  app.get('/images/:name', (req, reply) => {
    console.log('images route hit', req.raw.url, req.params)
    const rel = req.params.name
    const filePath = path.join(__dirname, 'public', 'images', rel)
    console.log('images route filePath', filePath, fs.existsSync(filePath))
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase()
      const type = ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream'
      reply.type(type).send(fs.readFileSync(filePath))
      return
    }
    reply.callNotFound()
  })

  await app.listen({
  port,
  host: '0.0.0.0',  
}, () => console.log(`App listening on port ${port}`))


}
catch (e) {
  throw e;
}
