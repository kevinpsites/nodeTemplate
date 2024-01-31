const config = {
  mainDynamodbTable: process.env.DYNAMO_TABLE,
  attributeDynamodbTable: process.env.ATTRIBUTE_TABLE,

  JWT_ORGANIZATION_KEY: "org",

  // Auth0
  BASIC_USER_ROLE: process.env.BASIC_USER_ROLE ?? "FILL THIS IN",

  AUTH0_JWKS: process.env.AUTH0_JWKS,
  AUTH0_MANAGEMENT_DOMAIN:
    process.env.AUTH0_MANAGEMENT_DOMAIN ?? "dev-cdy4xvtqdlpi2327.us.auth0.com",
  AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE,
  AUTH0_CLIENT_DOMAIN:
    process.env.AUTH0_DOMAIN ?? "dev-cdy4xvtqdlpi2327.us.auth0.com",
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ?? "FILL THIS IN",

  failureStatusText: "FAILURE",
  successStatusText: "SUCCESS",
  notAuthorizedText: "Not Authorized",
  permissionDeniedText: "Permission Denied",
  missingAttrText: "Missing Required Attributes",

  // Route permissions
  // NOTE: These are the permissions that are required to access the route
  //       If the user has any of these permissions, they will be allowed
  //       to access the route

  // Account Routes
  accountRoutePermissions: {
    create: "create:account",
    read: "read:account",
  },
};

module.exports.config = config;
