var async = require("async");
var Deploy = require("../models/deploy");
var user = module.exports = {};

user.view = function (req, res, next) {
  var user = req.session.user;
  if (!user) return next();

  req.services.github.getRepos(function (err, repos) {
    if (err) return next(err);

    var repoNames = [];

    for (var i = repos.length - 1; i >= 0; i--) {
      repoNames.push(repos[i].name);
    }

    Deploy.find({ repo: { $in: repoNames }}, function (err, deploys) {
      if (err) return next(err);

      res.render("user/view", { user: user, deploys: deploys });
    });
  });
};