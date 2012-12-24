var async = require("async"),
    User = require("../models/user"),
    Deploy = require("../models/deploy"),
    deploy = module.exports = {};

deploy.createForm = function (req, res, next) {
  req.services.github.getRepos(function (err, repos) {
    if (err) return next(err);
    if (!repos) return next();

    res.render("deploy/create", {
      repos: repos
    });
  });
};

deploy.create = function (req, res, next) {
  var script = req.body.script;
  var repo = req.body.repo;

  // TODO: Validate this form.

  var d = new Deploy({
    script: script,
    repo: repo
  });

  d.save(function (err) {
    return err
      ? next(err)
      : res.redirect("/" + repo);
  });
};

deploy.view = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;

  Deploy.findOne({ repo: fullRepoName }, function (err, d) {
    if (err || !d) return next(err);

    res.render("deploy/view", {
      deploy: d
    });
  });
};

deploy.editForm = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;

  Deploy.findOne({ repo: fullRepoName }, function (err, d) {
    if (err || !d) return next(err);

    res.render("deploy/edit", {
      deploy: d
    });
  });
};

deploy.edit = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;

  // TODO: Validate this form.

  Deploy.findOne({ repo: fullRepoName }, function (err, d) {
    if (err || !d) return next(err);

    d.script = req.body.script;

    d.save(function (err) {
      return err
        ? next(err)
        : res.redirect("/" + d.repo);
    });
  });
};

deploy.deleteForm = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;

  Deploy.findOne({ repo: fullRepoName }, function (err, d) {
    if (err || !d) return next(err);

    res.render("deploy/delete", {
      deploy: d
    });
  });
};

deploy.delete = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;

  Deploy.delete({ repo: fullRepoName }, function (err) {
    return err
      ? next(err)
      : res.redirect("/");
  });
};