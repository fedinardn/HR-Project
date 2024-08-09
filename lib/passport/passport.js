const passport = require("passport");
const { Strategy: SamlStrategy } = require("@node-saml/passport-saml");
const { config } = require("../../server/config");
// const { userService } = require("../../modules/user/UserService");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const signOnVerify = async (req, profile, done) => {
  if (!profile) {
    return done(new Error("No profile"));
  }
  //   const dbUser = await userService.getUserByEmail(profile.email);
  const user = {
    // id: dbUser?.id,
    uid: profile["urn:oid:0.9.2342.19200300.100.1.1"],
    netid: profile["urn:oid:0.9.2342.19200300.100.1.1"],
    email: profile.email,
    firstName: profile["urn:oid:2.5.4.42"],
    lastName: profile["urn:oid:2.5.4.4"],
    displayName: profile["urn:oid:2.16.840.1.113730.3.1.241"],
    // role: dbUser?.role,
  };
  return done(null, user);
};

const logOutVerify = () => {
  console.log("logOutVerify");
};

const samlStrategy = new SamlStrategy(config.saml, signOnVerify, logOutVerify);

passport.use(samlStrategy);

module.exports = { passport, samlStrategy };
