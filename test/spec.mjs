import { is } from '@magic/test'

import lib from '../dist/index.js'
const { socket, http, init } = lib

export default [
  { fn: () => lib, expect: is.object, info: 'init is a function' },
  { fn: () => lib.init, expect: is.function, info: 'lib.init is a function' },
  { fn: () => lib.socket, expect: is.function, info: 'init.socket is a function' },
  { fn: () => lib.http, expect: is.function, info: 'init.http is a function' },
  { fn: () => socket, expect: is.function, info: 'socket is a function' },
  { fn: () => http, expect: is.function, info: 'http is a function' },
]
