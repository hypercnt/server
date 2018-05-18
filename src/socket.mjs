import ws from 'ws'

import log from '@magic/log'

import { mapActions } from './lib'

export const defaultProps = {
  socket: {
    host: 'localhost',
    port: 3001,
    protocol: 'ws',
    actions: {},
  },
}

export const socket = props => {
  props = { ...defaultProps, ...props }
  const server = new ws.Server(props.socket)

  server.on('connection', (client, req) => {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg)
      } catch (err) {
        props.error(err)
      }

      const [name, body] = msg
      log.info('receive', name, body, req)

      const request = {
        req,
        name,
        client,
        body,
      }

      const response = {
        send: data => {
          const res = [name.replace('v0.', '')]

          if (data) {
            res.push(data)
          }

          log.info('send', res)

          client.send(JSON.stringify(res.filter(e => typeof e !== 'undefined')))
        },
      }

      const action = mapActions({ actions: props.actions, name: request.name })

      if (typeof action === 'function') {
        if (props.db) {
          response.db = props.db
        }
        if (props.jwt) {
          response.jwt = props.jwt
        }

        action(request, response)
      } else {
        client.send('Unknown Action')
      }
    })
  })

  log.info(`socket server listening on ${props.port}`)
  return server
}

export default socket