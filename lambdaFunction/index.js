const handle = require("./handler");

exports.handler = async (event, context) => {
  return await handle.createHandler()(event, context);
};
