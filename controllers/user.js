var async = require("async"),
    User = require("../models/user"),
    user = module.exports = {};

user.view = function (req, res, next) {
  var user = req.session.user;

  if (!user) return next();

  req.services.github.getRepos(function (err, repos) {
    if (err) return next(err);

    res.render("user/view", {
      user: user,
      repos: repos
    });
  });
};