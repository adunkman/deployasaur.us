var User = require("../models/user"),
    users = module.exports = {};

users.findByUsername = function (username, callback) {
  if (username === "adunkman") {
    return callback(null, new User());
  }
  else {
    return callback(null, null);
  }
};

users.findByParam = function (param) {
  return function (req, res, next) {
    var username = req.params[param];

    users.findByUsername(username, function (err, user) {
      if (err) return next(err);
      req.profile = user;

      next();
    });
  };
};