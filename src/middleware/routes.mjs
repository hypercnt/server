import express from 'express'

import { flattenActions, mapActions } from '../lib'

const router = express.Router()

const routeActions = (props = {}) => {
  const actions = {}

  Object.keys(props.actions).forEach(name => {
    const action = props.actions[name]
    const path = props.parent ? `${props.parent}/${name}` : `/${name}`

    if (typeof action === 'object') {
      routeActions({ parent: path, actions: action, router })
    }

    if (typeof action === 'function') {
      props.router.get(path, (req, res) => res.end('GET not supported, use POST'))
      props.router.post(path, action)
    }
  })
}

export const routes = ({ actions }) => {
  // define the home route
  router.get('/', (req, res) => {
    res.redirect('/api/v0')
  })

  router.get('/v0', (req, res) => {
    const actionNames = flattenActions(actions)
    res.send(actionNames)
  })

  routeActions({ actions, router })

  return router
}

export default routes
