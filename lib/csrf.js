const Tokens = require("csrf");
const { serialize, parse } = require("cookie");
const { getApiResponse } = require("../helpers/utils");

const tokens = new Tokens();

async function createCsrfToken(req, res, next) {
  try {
    if (!req.session.csrfSecret) {
      console.log("initializeCsrfProtection: generating token");
      const secret = await tokens.secret();
      const token = tokens.create(secret);
      req.session.csrfSecret = secret;
      res.cookie("XSRF-TOKEN", token);
    }
    next();
  } catch (error) {
    console.error("initializeCsrfProtection: Error in CSRF middleware");
    next(error);
  }
}

async function validateCsrfToken(req, res, next) {
  // console.log("csrfValidationMiddleware req headers", req.headers);
  const cookies = parse(req.headers.cookie || "");
  const csrfSecret = req.session.csrfSecret; // Use session secret
  const receivedToken = cookies["XSRF-TOKEN"]; // Get token from cookie

  if (csrfSecret && tokens.verify(csrfSecret, receivedToken)) {
    console.log("SUCCESS: csrf token verified");
    next();
  } else {
    console.log("FAILURE: csrf token NOT verified");
    return res.status(403).json(getApiResponse("Invalid CSRF token.", 403));
  }
}

async function csrfMiddleware(req, res, next) {
  const nonIdempotentMethods = ["POST", "PUT", "PATCH", "DELETE"];
  const ignorePaths = ["/api/login/callback"];

  if (
    nonIdempotentMethods.includes(req.method.toUpperCase()) &&
    !ignorePaths.includes(req.path)
  ) {
    return await validateCsrfToken(req, res, next);
  }
  next();
}

module.exports = {
  createCsrfToken,
  validateCsrfToken,
  csrfMiddleware,
};
