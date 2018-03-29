import express from "express"
import path from "path"

// see below.
// import render from './render'

import router from "./router"

export const defaultProps = {
  host: "localhost",
  port: 3000,
  protocol: "http",
  actions: {},
  serve: [
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "src", "client", "public")
  ]
}

export const init = async (props = {}) => {
  const finalProps = Object.assign({}, defaultProps, props)
  const {
    host,
    port,
    protocol,
    actions,
    serve
    // client, // will be needed by ssr
  } = finalProps

  const app = express()

  console.log("server props:", finalProps)

  serve.forEach(s => app.use(express.static(s, { index: "index.html" })))

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use("/api", router({ actions }))

  app.listen(port, () => console.log(`http server listening to ${port}`))
  return app
}

export default init
