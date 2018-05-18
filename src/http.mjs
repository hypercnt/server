import express from 'express'
import path from 'path'

import log from '@magic/log'
import deep from '@magic/deep'

import { render, routes } from './middleware'

// this is needed for ssr rendering.
// if window is not set rendering will throw
global.window = {
  location: {
    pathname: '/',
  },
}

global.history = {
  pushState: () => {},
  replaceState: () => {},
}

export const defaultProps = {
  http: {
    host: 'localhost',
    port: 3000,
    protocol: 'http',
    serve: [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'src', 'client', 'assets')],
  },
  actions: {},
}

export const http = (props = {}) => {
  props = deep.merge(defaultProps, props)

  const { actions, client } = props
  const { host, port, protocol, serve } = props.http

  const app = express()

  serve.forEach(p => app.use(express.static(p, { index: 'index.html' })))

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use('/api', routes({ actions }))

  app.use((req, res, next) => {
    // this is needed for ssr rendering the hyperapp/routes
    global.window.location = {
      pathname: req.path,
    }

    if (props.db) {
      res.db = props.db
    }
    if (props.jwt) {
      res.jwt = props.jwt
    }

    next()
  })

  app.use(render(client))

  app.listen(port, () => log.info(`http server listening to ${port}`))
  return app
}

export default http
