var Validator = require("jsonschema").Validator;
var validate = new Validator();

// example
const exampleSchema = {
  id: "/item",
  type: "object",
  properties: {
    hashID: { type: "string" },
    rangeID: { type: "string" },
    userID: { type: "string" },
    createdOn: { type: "integer" },
    modifiedOn: { type: "integer" },
    tags: { type: "array" },
  },
  required: ["hashID", "rangeID", "userID"],
};

// console.log(v.validate(p, schema));
module.exports.exampleSchema = exampleSchema;
module.exports.validator = validate;
