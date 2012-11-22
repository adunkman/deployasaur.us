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