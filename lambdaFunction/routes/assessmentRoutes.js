class AssessmentResources {
  #dynamoService;
  #routePermissionMiddleware;

  constructor({ dynamoService, routePermissionMiddleware }) {
    this.#dynamoService = dynamoService;
    this.#routePermissionMiddleware = routePermissionMiddleware;
  }

  routes = (api, opts) => {
    api.get(
      "get",
      //   verifyRoutePermissionsMiddleware("read:thoughts"),
      async (req, res) => {
        const query = req.query ?? {};
        // const userId = getUserId(req);

        // const dynamoRes = await new DynamoDBService().queryAllUserThoughts(
        //   userId,
        //   query.nextPageKey
        // );

        return res.success({ test: "assess" });
      }
    );
  };
}

module.exports.AssessmentResources = AssessmentResources;
