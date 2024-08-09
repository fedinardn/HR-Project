const { passport, samlStrategy } = require("./passport");
const { config } = require("../../server/config");
const { getApiResponse } = require("../../helpers/utils");

// Authenticate middleware for login routes
const authenticate = passport.authenticate("saml", {
  failureRedirect: "/403",
  failureFlash: true,
});

function loginFail(req, res) {
  console.log("hit this time");
  console.log(res.status(403).json(getApiResponse("Access Forbidden", 403)));
}

function logout(req, res) {
  console.info("logout", "User logging out:", req?.user?.uid);
  req.logout({}, (err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json(getApiResponse("Internal Server Error", 500));
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Failed to destroy session:", sessionErr);
        return res
          .status(500)
          .json(getApiResponse("Internal Server Error", 500));
      }
      console.log("logout", "SUCCESS: Session destroyed. Redirecting to '/'.");
      const cookieName = "XSRF-TOKEN";
      res.clearCookie(cookieName);
      res.redirect("/logout");
    });
  });
}

function login(req, res, next) {
  console.log("login hit again");

  // req.query.RelayState = JSON.stringify({
  //   source: req.query.source || "",
  //   redirect_uri: req.query.redirect_uri || "",
  // });
  // console.log(req.query.RelayState);
  passport.authenticate(
    "saml",
    { failureRedirect: "/api/login" },
    { callback: "/api/login/callback" }
  )(req, res, next);
}

function loginCallback(req, res) {
  console.log({ "/api/login/callback/": req?.user });
  if (!req.user || !req.user.uid) {
    return res.status(500).json(getApiResponse("Internal Server Error", 500));
  }
  const relay = JSON.parse(req.body.RelayState);
  const redirect_uri = relay.redirect_uri || "/";
  return res.redirect(`${redirect_uri}?referral=saml`);
}

function metadata(req, res) {
  res.type("application/xml");
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        config.saml.signingCert,
        config.saml.signingCert
      )
    );
}

const samlRoutes = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.route("/api/login").get(login);
  app.route("/api/logout").get(logout);
  app.route("/api/loginFail").get(loginFail);
  // app.route("/api/login/callback/").get(loginFail);

  app.route("/api/login/callback/").post(authenticate, loginCallback);
  app.route("/api/Shibboleth.sso/Metadata").get(metadata);
};

module.exports = {
  //   authenticate,
  samlRoutes,
  //   login,
  //   loginCallback,
  //   logout,
  //   loginFail,
  //   metadata,
};
