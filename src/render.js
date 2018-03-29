import fs from "fs"
import path from "path"

import { h, app } from "hyperapp"
import { withRender } from "@hyperapp/render"

const fp = path.join(process.cwd(), "src", "client", "public", "index.html")
const html = fs.readFileSync(fp).toString()
console.log({ html })

export const render = props => (req, res) => {
  console.log("start render")
  const { client } = props
  res.type("text/html")
  const [head, footer] = html.split("<div>Loading...</div>")
  res.write(head)
  const main = withRender(app)(client.state, client.actions, client.view)
  const stream = main.toStream()
  console.log({ main, s: main.toString() })
  stream.pipe(res, { end: false })
  stream.on("end", () => {
    res.write(footer)
    res.end()
  })
}

export default render
