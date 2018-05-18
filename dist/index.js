'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ws = require('ws');
var log = _interopDefault(require('@magic/log'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var hyperapp = require('hyperapp');
var render = require('@hyperapp/render');
var express = _interopDefault(require('express'));
var deep = _interopDefault(require('@magic/deep'));

const flattenActions = a => {
  const b = {};
  Object.keys(a).forEach(k => {
    const act = a[k];
    if (typeof act === 'object') {
      b[k] = flattenActions(a[k]);
    } else if (typeof act === 'function') {
      b[k] = 'action';
    }
  });

  return b
};

const mapActions = ({ actions, name }) => {
  let action = actions;

  name.split('.').forEach(k => {
    if (typeof action !== 'function' && action[k]) {
      action = action[k];
    }
  });

  return action
};

const defaultProps = {
  socket: {
    host: 'localhost',
    port: 3001,
    protocol: 'ws',
    actions: {},
  },
};

const socket$1 = props => {
  props = { ...defaultProps, ...props };
  const server = new ws.Server(props.socket);

  server.on('connection', (client, req) => {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg);
      } catch (err) {
        props.error(err);
      }

      const [name, body] = msg;
      log.info('receive', name, body, req);

      const request = {
        req,
        name,
        client,
        body,
      };

      const response = {
        send: data => {
          const res = [name.replace('v0.', '')];

          if (data) {
            res.push(data);
          }

          log.info('send', res);

          client.send(JSON.stringify(res.filter(e => typeof e !== 'undefined')));
        },
      };

      const action = mapActions({ actions: props.actions, name: request.name });

      if (typeof action === 'function') {
        if (props.db) {
          response.db = props.db;
        }
        if (props.jwt) {
          response.jwt = props.jwt;
        }

        action(request, response);
      } else {
        client.send('Unknown Action');
      }
    });
  });

  log.info(`socket server listening on ${props.port}`);
  return server
};

const fp = path.join(process.cwd(), 'src', 'client', 'index.html');
const html = fs.readFileSync(fp).toString();
const splitPoint = '<body>';
const [head, footer] = html.split(splitPoint);

const render$1 = props => (req, res) => {
  res.type('text/html');
  res.write(head + splitPoint);

  const { client } = props;

  const pathname = req.path;
  // make the router render the correct view
  client.state.location = {
    pathname,
    prev: pathname,
  };

  const main = render.withRender(hyperapp.app)(client.state, client.actions, client.view);
  const stream = main.toStream();

  stream.pipe(res, { end: false });
  stream.on('end', () => {
    res.write(footer);
    res.end();
  });
};

const router = express.Router();

const routeActions = (props = {}) => {

  Object.keys(props.actions).forEach(name => {
    const action = props.actions[name];
    const path$$1 = props.parent ? `${props.parent}/${name}` : `/${name}`;

    if (typeof action === 'object') {
      routeActions({ parent: path$$1, actions: action, router });
    }

    if (typeof action === 'function') {
      props.router.get(path$$1, (req, res) => res.end('GET not supported, use POST'));
      props.router.post(path$$1, action);
    }
  });
};

const routes = ({ actions }) => {
  // define the home route
  router.get('/', (req, res) => {
    res.redirect('/v0');
  });

  router.get('/v0', (req, res) => {
    const actionNames = flattenActions(actions);
    res.send(actionNames);
  });

  routeActions({ actions, router });

  return router
};

// this is needed for ssr rendering.
// if window is not set rendering will throw
global.window = {
  location: {
    pathname: '/',
  },
};

global.history = {
  pushState: () => {},
  replaceState: () => {},
};

const defaultProps$1 = {
  http: {
    host: 'localhost',
    port: 3000,
    protocol: 'http',
    serve: [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'src', 'client', 'assets')],
  },
  actions: {},
};

const http$1 = (props = {}) => {
  props = deep.merge(defaultProps$1, props);

  console.log({ props });

  const { actions, client } = props;
  const { host, port, protocol, serve } = props.http;

  const app = express();

  serve.forEach(p => app.use(express.static(p, { index: 'index.html' })));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/api', routes({ actions }));

  app.use((req, res, next) => {
    // this is needed for ssr rendering the hyperapp/routes
    global.window.location = {
      pathname: req.path,
    };

    if (props.db) {
      res.db = props.db;
    }
    if (props.jwt) {
      res.jwt = props.jwt;
    }

    next();
  });

  app.use(render$1(props));

  app.listen(port, () => log.info(`http server listening to ${port}`));
  return app
};

const env = process.env.NODE_ENV || 'development';

const init = async (props = {}) => {
  const socketServer = await socket(props);
  const httpServer = await http(props);

  return { socket: socketServer, http: httpServer }
};

init.socket = socket;
init.http = http;

exports.default = init;
exports.socket = socket$1;
exports.http = http$1;
//# sourceMappingURL=index.js.map
