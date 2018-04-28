import express from 'express'
import path from 'path'

import log from '@magic/log'

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
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  actions: {},
  serve: [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'src', 'client', 'assets')],
}

export const http = (props = {}) => {
  props = { ...defaultProps, ...props }
  const { host, port, protocol, actions, serve, client } = props

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

    next()
  })

  app.use(render(props))

  app.listen(port, () => log.info(`http server listening to ${port}`))
  return app
}

export default http
