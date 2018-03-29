# hyperconnect-server

### What ?
This is a very simple server designed to work with hyperapp and the hyperconnect-client.

It wraps a [hyperapp](https://github.com/hyperapp/hyperapp)
  and creates a server to both serve the app using [@hyperapp/render](https://github.com/hyperapp/render) ssr and provide a socket api.

This seamless integration means that server and client
both follow the state/action/view paradigm of hyperapp.

If you can write a client in hyperapp, you also can write a server now.

##### Example
See [hyperconnect-example](https://github.com/hyperapp-connect/example)
for a simple counter example.

### installation

```bash
  npm i --save git@github.com/hyperapp-connect/server
```

##### Todo:
* Add client side http fallback for old clients
