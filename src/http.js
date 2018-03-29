import express from "express"
import path from "path"

import render from "./render"
import router from "./router"

export const defaultProps = {
  host: "localhost",
  port: 3000,
  protocol: "http",
  actions: {},
  serve: [
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "src", "client", "assets")
  ]
}

export const init = async (p = {}) => {
  const props = Object.assign({}, defaultProps, p)
  const { host, port, protocol, actions, serve, client } = props

  const app = express()

  serve.forEach(p => app.use(express.static(p, { index: "index.html" })))

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use("/api", router({ actions }))
  app.use(render(props))

  app.listen(port, () => console.log(`http server listening to ${port}`))
  return app
}

export default init
