'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ws = require('ws');
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var hyperapp = require('hyperapp');
var render = require('@hyperapp/render');
var express = _interopDefault(require('express'));

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

const { Server } = ws;

const init = async props => {
  const server = await new Server(props);

  server.on('connection', client => {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg);
      } catch (err) {
        props.error(err);
      }

      const [name, body] = msg;
      console.log('receive', name, body);

      const request = {
        name,
        body,
        client,
      };

      const response = {
        send: data => {
          const res = [name.replace('v0.', '')];

          if (data) {
            res.push(data);
          }

          console.log('send', res);

          client.send(JSON.stringify(res.filter(e => typeof e !== 'undefined')));
        },
      };

      const action = mapActions({ actions: props.actions, name: request.name });

      if (typeof action === 'function') {
        if (props.db) {
          response.db = props.db;
        }

        action(request, response);
      } else {
        client.send('Unknown Action');
      }
    });
  });

  console.log(`socket server listening on ${props.port}`);
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
      props.router.get(path$$1, (req, res) =>
        res.end('GET not supported, use POST'),
      );
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

const defaultProps$1 = {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  actions: {},
  serve: [
    path.join(process.cwd(), 'dist'),
    path.join(process.cwd(), 'src', 'client', 'assets'),
  ],
};

const start = async (p = {}) => {
  const props = Object.assign({}, defaultProps$1, p);
  const { host, port, protocol, actions, serve, client } = props;

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

    next();
  });

  app.use(render$1(props));

  app.listen(port, () => console.log(`http server listening to ${port}`));
  return app
};

const env = process.env.NODE_ENV || 'development';

const init$1 = async (props = {}) => {
  const socket = await init(props);
  const http = await start(props);

  return { socket, http }
};

init$1.socket = init;
init$1.http = start;

module.exports = init$1;
//# sourceMappingURL=index.js.map
