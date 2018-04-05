import fs from "fs"
import path from "path"

import { h, app } from "hyperapp"
import { withRender } from "@hyperapp/render"

const fp = path.join(process.cwd(), "src", "client", "index.html")
const html = fs.readFileSync(fp).toString()
const splitPoint = "<body>"
const [head, footer] = html.split(splitPoint)

export const render = props => (req, res) => {
  res.type("text/html")
  res.write(head + splitPoint)

  const { client } = props

  // make the router render the correct view
  client.state.location = {
    pathname: req.path
  }

  const main = withRender(app)(client.state, client.actions, client.view)
  const stream = main.toStream()

  stream.pipe(res, { end: false })
  stream.on("end", () => {
    res.write(footer)
    res.end()
  })
}

export default render
