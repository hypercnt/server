import express from 'express'

import mapActions from './mapActions'

const router = express.Router()

const routeActions = (props) => {
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

const init = ({ actions }) => {
  // middleware that is specific to this router
  router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })

  // define the home route
  router.get('/', (req, res) => {
    res.redirect('/api/v0')
  })

  router.get('/v0', (req, res) => {
    const actionNames = Object.keys(actions)
    res.send(JSON.stringify(actionNames))
  })

  routeActions({ actions, router })

  return router
}

export default init
