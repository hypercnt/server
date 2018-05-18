import fs from 'fs'
import path from 'path'

import hyper from 'hyperapp'
import prepare from '@hyperapp/render'

let fp = path.join(process.cwd(), 'src', 'client', 'index.html')
// default index.html file
if (!fs.existsSync(fp)) {
  fp = path.normalize('../../client/index.html')
}

const html = fs.readFileSync(fp).toString()
const splitPoint = '<body>'
const [head, footer] = html.split(splitPoint)

export const render = props => (req, res) => {
  res.type('text/html')
  res.write(head + splitPoint)

  const { client } = props

  const pathname = req.path
  // make the router render the correct view
  client.state.location = {
    pathname,
    prev: pathname,
  }

  const main = prepare.withRender(hyper.app)(client.state, client.actions, client.view)
  const stream = main.toStream()

  stream.pipe(res, { end: false })
  stream.on('end', () => {
    res.write(footer)
    res.end()
  })
}

export default render
