const config = {
  mainDynamodbTable: process.env.DYNAMO_TABLE,
  AUTH0_JWKS: process.env.AUTH0_JWKS,
  AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE,
  JWT_ORGANIZATION_KEY: "org",

  failureStatusText: "FAILURE",
  successStatusText: "SUCCESS",
  notAuthorizedText: "Not Authorized",
  permissionDeniedText: "Permission Denied",
  missingAttrText: "Missing Required Attributes",
};

module.exports.config = config;
