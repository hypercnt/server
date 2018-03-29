# hyperconnect-server

### What ?
This is a very simple server designed to work with hyperapp and the hyperconnect-client.

It wraps a [hyperapp](https://github.com/hyperapp/hyperapp)
and creates a server to both serve the app and provide a socket/http api.

This seamless integration means that server and client
both follow the state/action/view paradigm of hyperapp.

If you can write a client in hyperapp, you also can write a server now.

##### Usage
See [hyperconnect](https://github.com/hyperapp-connect/connect)
for full usage instructions.

##### Example
See [hyperconnect-example](https://github.com/hyperapp-connect/example)
for a simple counter example.

### installation

```bash
  npm i --save git@github.com/hyperapp-connect/server
```
