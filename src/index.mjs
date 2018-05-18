export { socket } from './socket'
export { http } from './http'
import start from './init'

export const init = start
init.init = start

export default init
