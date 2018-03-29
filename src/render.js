import fs from "fs"
import path from "path"

import { h, app } from "hyperapp"
import { withRender } from "@hyperapp/render"

const fp = path.join(process.cwd(), "src", "client", "public", "index.html")
const html = fs.readFileSync(fp).toString()
const [head, footer] = html.split("<div>Loading...</div>")

export const render = props => (req, res) => {
  res.type("text/html")
  res.write(head)

  const { client } = props
  const main = withRender(app)(client.state, client.actions, client.view)
  const stream = main.toStream()

  stream.pipe(res, { end: false })
  stream.on("end", () => {
    res.write(footer)
    res.end()
  })
}

export default render
