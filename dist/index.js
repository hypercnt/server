'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ws = require('ws');
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var hyperapp = require('hyperapp');
var render = require('@hyperapp/render');
var express = _interopDefault(require('express'));

const mapActions = ({ actions, name }) => {
  let action = actions;

  name.split(".").forEach(k => {
    if (typeof action !== "function" && action[k]) {
      action = action[k];
    }
  });

  return action
};

const { Server } = ws;

const defaultProps = {
  host: "localhost",
  port: 3001,
  protocol: "ws",
  actions: {}
};

const init = async props => {
  const server = await new Server(props);

  server.on("connection", client => {
    client.on("message", msg => {
      try {
        msg = JSON.parse(msg);
      } catch (err) {
        props.error(err);
      }

      const [name, body] = msg;

      const request = {
        name,
        body,
        client
      };

      console.log("receive", name, body);

      const response = {
        send: data => {
          const res = [name.replace("v0.", "")];

          if (data) {
            res.push(data);
          }

          console.log("send", res);

          client.send(JSON.stringify(res));
        }
      };

      const action = mapActions({ actions: props.actions, name: request.name });

      if (typeof action === "function") {
        action(request, response);
      } else {
        client.send("Unknown Action");
      }
    });
  });

  console.log(`socket server listening on ${props.port}`);
  return server
};

const fp = path.join(process.cwd(), "src", "client", "index.html");
const html = fs.readFileSync(fp).toString();
const splitPoint = "<body>";
const [head, footer] = html.split(splitPoint);

const render$1 = props => (req, res) => {
  res.type("text/html");
  res.write(head + splitPoint);

  const { client } = props;

  // make the router render the correct view
  client.state.location = {
    pathname: req.path
  };

  const main = render.withRender(hyperapp.app)(client.state, client.actions, client.view);
  const stream = main.toStream();

  stream.pipe(res, { end: false });
  stream.on("end", () => {
    res.write(footer);
    res.end();
  });
};

const router = express.Router();

const routeActions = props => {

  Object.keys(props.actions).forEach(name => {
    const action = props.actions[name];
    const path$$1 = props.parent ? `${props.parent}/${name}` : `/${name}`;

    if (typeof action === "object") {
      routeActions({ parent: path$$1, actions: action, router });
    }

    if (typeof action === "function") {
      props.router.get(path$$1, (req, res) =>
        res.end("GET not supported, use POST")
      );
      props.router.post(path$$1, action);
    }
  });
};

const init$1 = ({ actions }) => {
  // middleware that is specific to this router
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
  });

  // define the home route
  router.get("/", (req, res) => {
    res.redirect("/v0");
  });

  const flattenActions = a => {
    const b = {};
    Object.keys(a).forEach(k => {
      const act = a[k];
      if (typeof act === "object") {
        b[k] = flattenActions(a[k]);
      } else if (typeof act === "function") {
        b[k] = "action";
      }
    });

    return b
  };

  router.get("/v0", (req, res) => {
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
    pathname: "/"
  }
};

const defaultProps$1 = {
  host: "localhost",
  port: 3000,
  protocol: "http",
  actions: {},
  serve: [
    path.join(process.cwd(), "dist"),
    path.join(process.cwd(), "src", "client", "assets")
  ]
};

const init$2 = async (p = {}) => {
  const props = Object.assign({}, defaultProps$1, p);
  const { host, port, protocol, actions, serve, client } = props;

  const app = express();

  serve.forEach(p => app.use(express.static(p, { index: "index.html" })));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api", init$1({ actions }));

  app.use((req, res, next) => {
    // this is needed for ssr rendering the hyperapp/router
    global.window = {
      location: {
        pathname: req.path
      }
    };

    next();
  });

  app.use(render$1(props));

  app.listen(port, () => console.log(`http server listening to ${port}`));
  return app
};

const env = process.env.NODE_ENV || "development";

const quiet = e => {
  console.error(e);
};
const loud = e => {
  if (e instanceof Error) {
    throw e
  } else {
    throw new Error(JSON.stringify(e))
  }
};

const defaultProps$2 = {
  error: env === "development" ? loud : quiet,
  host: "localhost",
  actions: {}
};

const init$3 = async (props = {}) => {
  props = Object.assign({}, defaultProps$2, props);

  const wsProps = Object.assign({}, defaultProps$2, defaultProps, props);
  const httpProps = Object.assign({}, defaultProps$2, defaultProps$1, props);

  const socket = await init(wsProps);
  const http = await init$2(httpProps);

  return { socket, http }
};

module.exports = init$3;
//# sourceMappingURL=index.js.map
