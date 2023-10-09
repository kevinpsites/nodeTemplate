const createAPI = require("lambda-api");

const config = require("./config");

const responseBuilderFunctions = require("./middleware/responseBuilder");
const { responseBuilder } = responseBuilderFunctions;

const middlewareFunctions = require("./middleware/middlewareFunctions");
const { verifyAuth0TokenMiddleware, verifyRoutePermissionsMiddleware } =
  middlewareFunctions;

const tokenFunctions = require("./helperFunctions/tokenFunctions");
const { getUserId } = tokenFunctions;

const validation = require("./services/validation");
const { exampleSchema, validator } = validation;

const dynamodbClass = require("./services/dynamodb");
const { DynamoDBService } = dynamodbClass;

// Routes
const assessmentResources = require("./routes/assessmentRoutes");
const { AssessmentResources } = assessmentResources;

const STAGE_VARIABLE = "/prod";
const routePath = (route, version = "") => {
  return `${STAGE_VARIABLE}${version ? `/${version}` : ""}/${route}`;
};

const createHandler = () => {
  const api = createAPI({
    logger: { level: process.env.LOG_LEVEL || "info" },
  });

  const dynamoService = new DynamoDBService();

  const basicResourcesObj = (additionalParams = {}) => {
    return {
      dynamoService,
      validatorService: validator,
      routePermissionMiddleware: verifyRoutePermissionsMiddleware,
    };
  };

  const newClass = (classType, additionalParams = {}) => {
    return new classType(basicResourcesObj(additionalParams));
  };

  // register response builder helper methods
  api.use(new responseBuilder({ config }).wrapper());

  // Check Token
  // api.use(
  //   [
  //     routePath("search", "v2"),
  //     routePath("thoughts", "v2"),
  //     routePath("threads", "v2"),
  //     routePath("thought", "v2"),
  //     routePath(":threadId/thoughts", "v2"),
  //     routePath(":threadId/thoughts/:thoughtId", "v2"),
  //     routePath("exising/thought", "v2"),
  //   ],
  //   verifyAuth0TokenMiddleware
  // );

  // Register Class Routes
  api.register(newClass(AssessmentResources).routes, {
    prefix: routePath("assessment"),
  });

  return async (event, context) => {
    return await api.run(event, context);
  };
};

module.exports.createHandler = createHandler;
