var async = require("async"),
    Repo = require("../models/repo"),
    repos = module.exports = {};

repos.view = function (req, res, next) {
  var user = req.params.user,
      repo = req.params.repo;

  req.services.github.getRepo(user, repo, function (err, repo) {
    if (err) return next(err);
    if (!repo) return next();

    res.render("repos/view", {
      repo: repo
    });
  });
};