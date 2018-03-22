import express from 'express'
import path from 'path'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
// see below.
// import render from './render'

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
    // client, // will be needed by ssr
  } = Object.assign({}, defaultProps, props)

  const app = express()

  // not yet.
  // @hyperapp/render needs jsx
  // which would force us to babelify/rollup the server.
  // since es6 modules in the form of mjs files are finally in testing
  // not yet.
  // app.get('/', render(client))

  app.use(serveStatic(serve, { index: ['index.html'] }))

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use('/api', router({ actions }))

  app.listen(port, () => console.log(`http server listening to ${port}`))
  return app
}

export default init
