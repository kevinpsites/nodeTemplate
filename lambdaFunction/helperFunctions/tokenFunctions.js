const getUserID = (req) => {
  return req.user.token?.sub;
};

const getPermissions = (req) => {
  return req.user.token?.permissions ?? [];
};

module.exports.getUserID = getUserID;
module.exports.getPermissions = getPermissions;
