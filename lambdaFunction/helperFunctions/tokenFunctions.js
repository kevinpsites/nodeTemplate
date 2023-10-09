const getUserId = (req) => {
  return req.user.token?.sub;
};

module.exports.getUserId = getUserId;
