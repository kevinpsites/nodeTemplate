const createAPI = require("lambda-api");
const axios = require("axios");

const config = require("./config");

const responseBuilderFunctions = require("./middleware/responseBuilder");
const { responseBuilder } = responseBuilderFunctions;

const middlewareFunctions = require("./middleware/middlewareFunctions");
const { verifyAuth0TokenMiddleware, verifyRoutePermissionsMiddleware } =
  middlewareFunctions;

const tokenFunctions = require("./helperFunctions/tokenFunctions");
const attributeFunctions = require("./helperFunctions/attributeFunctions");

const validation = require("./services/validation");
const { schemas, validator } = validation;

const basicFunctions = require("./helperFunctions/basicFunctions");
const { BasicFunctions } = basicFunctions;

const dynamodbClass = require("./services/dynamodb");
const { DynamoDBService } = dynamodbClass;

const auth0TokenClass = require("./services/auth0TokenService");
const { Auth0TokenService } = auth0TokenClass;

// Routes
const accountResources = require("./routes/accountRoutes");
const { AccountResources } = accountResources;

const STAGE_VARIABLE = "";
const routePath = (route, version = "") => {
  return `${STAGE_VARIABLE}${version ? `/${version}` : ""}/${route}`;
};

const createHandler = () => {
  const api = createAPI({
    logger: { level: process.env.LOG_LEVEL || "info" },
  });

  const basicFunctions = new BasicFunctions();
  const dynamoService = new DynamoDBService({ config: config.config });
  const auth0TokenService = new Auth0TokenService({
    config: config.config,
    axios,
  });

  const basicResourcesObj = (additionalParams = {}) => {
    return {
      config: config.config,
      axios,
      basicFunctions,
      dynamoService,
      auth0TokenService,
      validatorService: validator,
      schemas: {
        ...schemas,
      },
      tokenFunctions,
      attributeFunctions,
      routePermissionMiddleware: verifyRoutePermissionsMiddleware,
    };
  };

  const newClass = (classType, additionalParams = {}) => {
    const classInstance = new classType(basicResourcesObj(additionalParams));
    return [
      classInstance.routes,
      {
        prefix: routePath(classInstance.prefix),
      },
    ];
  };

  // register response builder helper methods
  api.use(new responseBuilder({ config }).wrapper());
  api.use(verifyAuth0TokenMiddleware);

  // Register Class Routes
  api.register(...newClass(AccountResources));

  return async (event, context) => {
    return await api.run(event, context);
  };
};

module.exports.createHandler = createHandler;
