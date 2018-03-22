import ws from 'ws'

import mapActions from './mapActions'

const { Server } = ws

export const defaultProps = {
  host: 'localhost',
  port: 3001,
  protocol: 'ws',
  actions: {},
}

export const init = async (props) => {
  const server = await new Server(props)

  server.on('connection', client => {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg)
      } catch (err) {
        props.error(err)
      }
      console.log('receive', msg)

      const request = {
        name: msg[0],
        body: msg[1],
        client,
      }

      const response = {
        send: (data) => {
          console.log('send', { data })
          if (typeof data !== 'string' && typeof data !== 'number') {
            data = JSON.stringify(data)
          }
          client.send(data)
        },
      }

      const action = mapActions({ actions: props.actions, name: request.name })

      if (typeof action === 'function') {
        action(request, response)
      }
      else {
        client.send('Unknown Action')
      }
    })
  })

  console.log(`socket server listening on ${props.port}`)
  return server
}

export default init
