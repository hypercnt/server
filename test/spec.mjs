import { is } from '@magic/test'

import lib, { socket, http, init } from '../src'

export default [
  { fn: () => lib, expect: is.function, info: 'init is a function' },
  { fn: () => lib.init, expect: is.function, info: 'lib.init is a function' },
  { fn: () => lib.init, expect: is.function, info: 'lib.init equals lib' },
  { fn: () => lib.socket, expect: is.function, info: 'init.socket is a function' },
  { fn: () => lib.http, expect: is.function, info: 'init.http is a function' },
  { fn: () => socket, expect: is.function, info: 'socket is a function' },
  { fn: () => http, expect: is.function, info: 'http is a function' },
  { fn: () => lib, expect: is.deep.eq(lib.init), info: 'lib equals lib.init' },
  { fn: () => lib, expect: is.deep.eq(init), info: 'lib equals init' },
  { fn: () => http, expect: is.deep.eq(lib.http), info: 'http equals lib.http' },
  { fn: () => socket, expect: is.deep.eq(lib.socket), info: 'socket equals lib.socket' },
]
