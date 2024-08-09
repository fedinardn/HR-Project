const { ValidateInResponseTo } = require("@node-saml/passport-saml");
const path = require("path");

const projectRoot = path.resolve(__dirname);
const certPath = path.join(projectRoot, "cornell-idp-test.crt");
const idpCertPath = path.join(projectRoot, "cornell-idp.crt");
const config = {
  saml: {
    callbackUrl: "https://localhost:3000/api/login/callback/",
    idpCert: idpCertPath,
    signingCert: certPath,
    entryPoint: process.env.SHIB_IDP_ENTRY_POINT,
    issuer: "https://localhost:3000/api/Shibboleth.sso/Metadata",
    passReqToCallback: true,
    decryptionPvk: undefined,
    privateKey: undefined,
    acceptedClockSkewMs: -1,
    identifierFormat: null,
    passReqToCallback: true,
    disableRequestedAuthnContext: true,
    // wantAssertionsSigned: false,
    // validateInResponseTo: ValidateInResponseTo.always,
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

module.exports = { config };
