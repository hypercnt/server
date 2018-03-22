import { send } from './ws'

export const map = (actions = {}, remote = {}, parent = null) => {
  Object.keys(remote).forEach(name => {
    const action = remote[name]

    if (typeof action === 'function') {
      actions[name + '_done'] = action

      actions[name] = (state, actions) => data => {
        const key = parent ? `${parent}.${name}` : name
        const msg = data === null ? [key] : [key, data]

        send(msg)
      }

      return
    }

    if (typeof action === 'object') {
      const remoteActions = map({}, action, name)
      actions[name] = Object.assign({}, actions[name], remoteActions)
      return
    }
  })

  return actions
}

export default map
