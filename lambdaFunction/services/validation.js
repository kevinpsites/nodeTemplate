var Validator = require("jsonschema").Validator;
var validate = new Validator();

// example
const exampleSchema = {
  id: "/item",
  type: "object",
  properties: {
    hashId: { type: "string" },
    rangeId: { type: "string" },
    userId: { type: "string" },
    createdOn: { type: "integer" },
    modifiedOn: { type: "integer" },
    tags: { type: "array" },
  },
  required: ["hashId", "rangeId", "userId"],
};

// console.log(v.validate(p, schema));
module.exports.exampleSchema = exampleSchema;
module.exports.validator = validate;
