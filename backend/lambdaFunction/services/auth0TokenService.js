class Auth0TokenService {
  #config;
  #axios;

  #managementToken = "";
  constructor({ config, axios }) {
    this.#config = config;
    this.#axios = axios;
  }

  getAuth0URL() {
    return `https://${this.#config.AUTH0_CLIENT_DOMAIN}/api/v2`;
  }

  async getManagementToken() {
    if (this.#managementToken !== "") {
      return this.#managementToken;
    }

    const options = {
      method: "POST",
      url: "https://" + this.#config.AUTH0_CLIENT_DOMAIN + "/oauth/token",
      json: true,
      data: {
        grant_type: "client_credentials",
        client_id: this.#config.AUTH0_CLIENT_ID,
        client_secret: this.#config.AUTH0_CLIENT_SECRET,
        audience: "https://" + this.#config.AUTH0_CLIENT_DOMAIN + "/api/v2/",
      },
    };

    try {
      const res = await this.#axios.request(options);

      this.#managementToken = res.data["access_token"];
      return res.data["access_token"];
    } catch (error) {
      console.error("Failed to get Management Token: " + error);
      return "";
    }
  }

  async addRoleToUser(userID, roleID) {
    await this.getManagementToken();
    const options = {
      method: "POST",
      url: `${this.getAuth0URL()}/users/${userID}/roles`,
      json: true,
      data: {
        roles: [roleID],
      },
      headers: {
        Authorization: `Bearer ${this.#managementToken}`,
      },
    };

    try {
      const res = await this.#axios.request(options);

      return true;
    } catch (error) {
      console.error("Failed to get Management Token: " + error);
      return false;
    }
  }
}

module.exports.Auth0TokenService = Auth0TokenService;
