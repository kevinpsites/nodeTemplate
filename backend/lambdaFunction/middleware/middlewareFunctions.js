const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const jwksClient = require("jwks-rsa");
const c = require("../config");

const tokenFunctions = require("../helperFunctions/tokenFunctions");

const notAuthorizedText = c.config.notAuthorizedText;
const verifyAuth0TokenMiddleware = async (req, res, next) => {
  let auth = req.auth;
  req.user = {};

  console.log(`Route found: ${req.route} - ${req.method} - ${req.path}`);

  if (auth["type"] !== "Bearer") {
    console.log("AUTHORIZATION denied no Bearer Token");
    res.status(401).failure({}, notAuthorizedText, c.config.failureStatusText);
    return;
  }

  var client = jwksClient({
    jwksUri: c.config.AUTH0_JWKS,
  });

  const signedKeys = await client.getSigningKeys();

  async function getKey(signedKey) {
    const foundKey = await client.getSigningKey(signedKey.kid);
    return foundKey.publicKey || foundKey.rsaPublicKey;
  }

  for (let index = 0; index < signedKeys.length; index++) {
    let signingKey = await getKey(signedKeys[index]);

    try {
      var decoded = jwt.verify(auth["value"], signingKey, {
        audience: c.config.AUTH0_API_AUDIENCE.split(","),
      });

      req.user.token = decoded;
      console.log("----decoded----");
      console.log(decoded);
      next();
      return;
    } catch (err) {
      if (index === signedKeys.length - 1) {
        console.log(`AUTHORIZATION denied, not signed: ${JSON.stringify(err)}`);
        res
          .status(401)
          .failure({}, notAuthorizedText, c.config.failureStatusText);

        return;
      }
    }
  }
};

const verifyRoutePermissionsMiddleware =
  (permission = "") =>
  async (req, res, next) => {
    const userPermissions = tokenFunctions.getPermissions(req);

    if (!permission) {
      next();
      return;
    }

    if (userPermissions?.includes(permission)) {
      next();
      return;
    } else {
      console.log(`AUTHORIZATION denied, missing permision`);
      res
        .status(401)
        .failure({}, notAuthorizedText, c.config.failureStatusText);

      return;
    }
  };

module.exports.verifyAuth0TokenMiddleware = verifyAuth0TokenMiddleware;
module.exports.verifyRoutePermissionsMiddleware =
  verifyRoutePermissionsMiddleware;
