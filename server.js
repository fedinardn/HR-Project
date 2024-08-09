// const serverExports = {
//   NextRequest: require("next/dist/server/web/spec-extension/request")
//     .NextRequest,
//   NextResponse: require("next/dist/server/web/spec-extension/response")
//     .NextResponse,
//   ImageResponse: require("next/dist/server/web/spec-extension/image-response")
//     .ImageResponse,
//   userAgentFromString: require("next/dist/server/web/spec-extension/user-agent")
//     .userAgentFromString,
//   userAgent: require("next/dist/server/web/spec-extension/user-agent")
//     .userAgent,
//   URLPattern: require("next/dist/server/web/spec-extension/url-pattern")
//     .URLPattern,
//   unstable_after: require("next/dist/server/after").unstable_after,
// };

// // https://nodejs.org/api/esm.html#commonjs-namespaces
// // When importing CommonJS modules, the module.exports object is provided as the default export
// module.exports = serverExports;

// // make import { xxx } from 'next/server' work
// exports.NextRequest = serverExports.NextRequest;
// exports.NextResponse = serverExports.NextResponse;
// exports.ImageResponse = serverExports.ImageResponse;
// exports.userAgentFromString = serverExports.userAgentFromString;
// exports.userAgent = serverExports.userAgent;
// exports.URLPattern = serverExports.URLPattern;
// exports.unstable_after = serverExports.unstable_after;

const express = require("express");
const next = require("next");
const session = require("express-session");
const { samlRoutes } = require("./lib/passport/passport.controller.js");
const { config } = require("./server/config.js");
const { login } = require("./lib/passport/passport.controller.js");
const { createCsrfToken, csrfMiddleware } = require("./lib/csrf.js");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  server.use("/api/", createCsrfToken);
  server.use(csrfMiddleware);

  samlRoutes(server);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
