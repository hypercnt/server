# hyperconnect

### What ?
This is a very simple client/server framework.

It wraps a [hyperapp](https://github.com/hyperapp/hyperapp)
and creates a server to both serve the app and provide a socket/http api.

This seamless integration means that server and client both follow the state/action/view paradigm of hyperapp. If you can write a client in hyperapp,
you also can write a server now.

### installation

```bash
  npm i --save git@github.com/jaeh/hyperconnect
```

### Important
Hyperconnect uses es6 modules in nodejs.
This means that you need nodejs >= v9.8.0
and add --experimental-modules to your node command line call

you also need to use the .mjs extension for all files.

#### bare node
```bash
  node --experimental-modules file.mjs
```

#### using nodemon  
##### WILL WORK
```bash
  nodemon -w src/server -- --experimental-modules src/server/index.mjs
```

##### WONT WORK:
```bash
  # note that --experimental-modules will not work if it is appended
  nodemon src/server/index.mjs -- --experimental-modules

```

### Usage:

See [hyperconnect-example](https://github.com/jaeh/hyperconnect-example) for a simple example project.
