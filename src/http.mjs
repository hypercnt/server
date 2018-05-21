import express from 'express'
import path from 'path'

import log from '@magic/log'
import deep from '@magic/deep'

import { render, routes } from './middleware'

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
