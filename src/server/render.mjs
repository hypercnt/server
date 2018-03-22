import fs from 'fs'
import path from 'path'
import hr from '@hyperapp/render'

import { h, app } from 'hyperapp'
import { withRender } from '@hyperapp/render'

const { renderToString, renderToStream } = hr

const fp = path.join(process.cwd(), 'src', 'client', 'public', 'index.html')
const html = fs.readFileSync(fp).toString()

const main = withRender(app)(state, actions, view)

export const render = client => (req, res) => {
  res.write('<!doctype html><html><head>')
  res.write('<title>Page</title>')
  res.write('</head><body><div id="app">')
  const main = withRender(app)(state, actions, view)
  const stream = main.toStream()
  stream.pipe(res, { end: false })
  stream.on('end', () => {
    res.write('</div></body></html>')
    res.end()
  })
}

export default render
