import express from 'express'
import path from 'path'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import render from './render'

import router from './router'

export const defaultProps = {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  actions: {},
  serve: path.join(process.cwd(), 'src', 'client', 'public'),
}

export const init = async (props = {}) => {
  const {
    host,
    port,
    protocol,
    actions,
    serve,
    client,
  } = Object.assign({}, defaultProps, props)

  const app = express()

  app.get('/', render(client))

  // app.use(serveStatic(serve, { index: ['index.html'] }))

  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())

  app.use('/api', router({ actions }))

  app.listen(port, () => console.log(`http server listening to ${port}`))
  return app
}

export default init
