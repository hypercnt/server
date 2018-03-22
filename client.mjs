import { withLogger } from "@hyperapp/logger"

import map from './src/client/mapActions'
import socket from './src/client/ws'

// default action for connected actions.
// will expect the response from the server to be a slice of the state.
// this slice will then be updated.
export const rem = res => () => res

export const log = withLogger
export const connect = socket
export const mapActions = map

export default connect
