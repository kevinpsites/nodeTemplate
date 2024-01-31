const ResponseStatus = Object.freeze({
  SUCCESS: "SUCCESS",
  FAILURE: "ERROR",
  INCOMPLETE: "INCOMPLETE",
});

/**
 * Helper class for use by route providers to build version-specific and
 * standardized API success/error responses.
 */
class ResponseBuilder {
  #config;

  constructor({ config }) {
    console.log("RES CONFIG", config);
    this.#config = config;
  }

  #isEmptyText(value) {
    return typeof value === "string" && value.trim().length === 0;
  }

  /**
   * Default API response structure.
   * @param {string} status resulting status (see ResponseStatus)
   * @param {string} message message text (including error messages)
   * @param {string} moreInfo additional details for troubleshooting support
   * @param {Object} responseData operation-specific data/results to return
   * @returns response to return to the API caller
   */
  #default(status, message, moreInfo, responseData) {
    let responseContent = {};

    if (responseData && !this.#isEmptyText(responseData)) {
      responseContent = { result: responseData };
    }

    return {
      status,
      message,
      moreInfo,
      ...responseContent,
    };
  }

  /**
   * Builds a normal response for a successful API call.
   * @param {Object} req request object
   * @param {Object} responseData operation-specific data/results to return
   * @param {string} message message text (default = success)
   * @param {string} moreInfo (optional) additional details for troubleshooting
   * @returns success response
   */
  success(req, responseData, message = "success", moreInfo = null) {
    return this.#default(
      ResponseStatus.SUCCESS,
      message,
      moreInfo,
      responseData
    );
  }

  /**
   * Builds an error response for a failed API call.
   * @param {Object} req request object
   * @param {string} message user-facing error message/text
   * @param {string} moreInfo (optional) additional details for troubleshooting
   * @returns failure response
   */
  failure(req, message, moreInfo = null) {
    return this.#default(
      ResponseStatus.FAILURE,
      message?.error || message,
      moreInfo
    );
  }

  /**
   * Builds a standard (non-legacy) response for an incomplete/partial API call.
   * @param {Object} responseData operation-specific data/results to return
   * @param {string} message message text (default = incomplete)
   * @param {string} moreInfo (optional) additional details for troubleshooting
   * @returns incomplete response
   */
  incomplete(
    responseData,
    message = "incomplete",
    moreInfo = "partially completed with one or more errors"
  ) {
    return this.#default(
      ResponseStatus.INCOMPLETE,
      message,
      moreInfo,
      responseData
    );
  }

  /**
   * Convenient method for building a standard message-only response (no response
   * data).  This is basically similar to ResponseBuilder.failure() with the
   * exception of defaulting to the ResponseStatus.SUCCESS status and assuming
   * the standard response format.
   *
   * @param {string} message user-facing response message/text
   * @returns message-only response
   */
  message(message) {
    return this.#default(ResponseStatus.SUCCESS, message, null);
  }

  /**
   * Creates a wrapper middleware for injecting success, failure, and message
   * convenient methods into the response object so that routes can simply call
   * res.success() or res.failure() without the need to invoke the response
   * builder.  For one-off use cases, response builder can still be utilized
   * directly, for example: res.send(responseBuilder.success(req, result, ...))
   * @returns wrapper middleware (see handler for registration)
   */
  wrapper() {
    return (req, res, next) => {
      /**
       * calls response.send with formatted success response
       * @param {*} result response result/data
       * @param {string} message (optional) response message
       * @param {string} moreInfo (optional) additional details
       */
      res.success = (result, message, moreInfo) => {
        res.send(this.success(req, result, message, moreInfo));
      };

      /**
       * calls response.send with formatted error response
       * @param {string} message use-facing error message
       * @param {string} moreInfo (optional) additional details
       */
      res.failure = (message, moreInfo) => {
        res.send(this.failure(req, message, moreInfo));
      };

      /**
       * calls response.send with formatted incomplete response
       * @param {*} result response result/data
       * @param {string} message (optional) response message
       * @param {string} moreInfo (optional) additional details
       */
      res.incomplete = (result, message, moreInfo) => {
        res.send(this.incomplete(result, message, moreInfo));
      };

      /**
       * calls response.send with formatted message-only response
       * @param {string} message use-facing response message
       */
      res.message = (message) => {
        res.send(this.message(message));
      };

      next();
    };
  }
}

module.exports.responseStatus = ResponseStatus;
module.exports.responseBuilder = ResponseBuilder;
