class AccountResources {
  prefix = "account";

  #config;
  #auth0TokenService;
  #tokenFunctions;

  constructor({ config, auth0TokenService, tokenFunctions }) {
    this.#config = config;
    this.#auth0TokenService = auth0TokenService;
    this.#tokenFunctions = tokenFunctions;
  }

  routes = (api, opts) => {
    api.get("/", async (req, res) => {
      const userID = this.#tokenFunctions.getUserID(req);
      const userPermissions = this.#tokenFunctions.getPermissions(req);

      let refresh = false;
      let errorMessage = "";
      if (userPermissions.length === 0) {
        const newRole = await this.#auth0TokenService.addRoleToUser(
          userID,
          this.#config.BASIC_USER_ROLE
        );

        errorMessage = newRole ? "" : "Failed to add role to user";
        refresh = true;
      }

      return res.success({
        userID: userID,
        userPermissions,
        refresh,
        errorMessage,
      });
    });
  };
}

module.exports.AccountResources = AccountResources;
