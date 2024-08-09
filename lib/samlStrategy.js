import { Strategy as SamlStrategy } from "@node-saml/passport-saml";
import { config } from "../server/config";
// import { userService } from "../services/userService"; // Implement this service

const samlStrategy = new SamlStrategy(config, async (profile, done) => {
  try {
    //   const dbUser = await userService.getUserByEmail(profile.email);
    const user = {
      id: profile["urn:oid:0.9.2342.19200300.100.1.1"],
      email: profile.email,
      name: profile["urn:oid:2.16.840.1.113730.3.1.241"],
      role: profile.role,
      netid: profile["urn:oid:0.9.2342.19200300.100.1.1"],
      givenName: profile["urn:oid:2.5.4.42"],
      sn: profile["urn:oid:2.5.4.4"],
      displayname: profile["urn:oid:2.16.840.1.113730.3.1.241"],
    };
    done(null, user);
  } catch (error) {
    done(error);
  }
});
