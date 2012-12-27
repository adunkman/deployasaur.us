var Deploy = require("../models/deploy");
var deploy = module.exports = {};

deploy.createForm = function (req, res, next) {
  if (!req.session.user) return next(401);

  req.services.github.getRepos(function (err, repos) {
    if (err) return next(err);
    if (!repos) return next();

    res.render("deploy/create", {
      repos: repos
    });
  });
};

deploy.create = function (req, res, next) {
  var user = req.session.user;
  var script = req.body.script;
  var repo = req.body.repo;
  var repoParts = req.params.repo.split("/");

  if (!user) return next(401);

  // TODO: Validate this form.

  req.services.github.doesUserHavePushAccess(repoParts[0], repoParts[1], function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var d = new Deploy({
      script: script,
      repo: repo
    });

    d.save(function (err) {
      return err
        ? next(err)
        : res.redirect("/" + repo);
    });
  });
};

deploy.view = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  if (!user) return next(401);

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    Deploy.findOne({ repo: fullRepoName }, function (err, d) {
      if (err || !d) return next(err);

      res.render("deploy/view", {
        deploy: d
      });
    });
  });
};

deploy.editForm = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  if (!user) return next(401);

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    Deploy.findOne({ repo: fullRepoName }, function (err, d) {
      if (err || !d) return next(err);

      res.render("deploy/edit", {
        deploy: d
      });
    });
  });
};

deploy.edit = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  if (!user) return next(401);

  // TODO: Validate this form.

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    Deploy.findOne({ repo: fullRepoName }, function (err, d) {
      if (err || !d) return next(err);

      d.script = req.body.script;

      d.save(function (err) {
        return err
          ? next(err)
          : res.redirect("/" + d.repo);
      });
    });
  });
};

deploy.deleteForm = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  if (!user) return next(401);

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    Deploy.findOne({ repo: fullRepoName }, function (err, d) {
      if (err || !d) return next(err);

      res.render("deploy/delete", {
        deploy: d
      });
    });
  });
};

deploy.delete = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  if (!user) return next(401);

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    Deploy.delete(fullRepoName, function (err) {
      return err
        ? next(err)
        : res.redirect("/" + req.session.user.username);
    });
  });
};