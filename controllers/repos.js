var async = require("async"),
    Deploy = require("../models/deploy"),
    repos = module.exports = {};

repos.view = function (req, res, next) {
  var user = req.params.user,
      repo = req.params.repo;

  async.parallel({
    repo: function (d) { req.services.github.getRepo(user, repo, d); },
    deploys: function (d) { Deploy.find({ repo: user + "/" + repo }, d); }
  }, function (err, r) {
    if (err) return next(err);
    if (!r.repo) return next();

    res.render("repos/view", {
      repo: r.repo,
      deploys: r.deploys
    });
  });
};