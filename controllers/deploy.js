var Deploy = require("../models/deploy");
var deploy = module.exports = {};

var isEmpty = function(object) {
  var key;

  for (key in object)
    return false;

  return true;
}

deploy.createForm = function (req, res, next) {
  var error = req.flash('error');
  var data = req.flash('data');

  req.services.github.getRepos(function (err, repos) {
    if (err) return next(err);
    if (!repos) return next();

    res.render("deploy/create", {
      repos: repos,
      data: data[0] || {},
      error: error[0] || {}
    });
  });
};

deploy.create = function (req, res, next) {
  var user = req.session.user;
  var script = req.body.script;
  var repo = req.body.repo;
  var branchName = req.body.branch;
  
  var error = {};

  if (!repo)
    error['repo'] = "You must specify a repository";
  if (!branchName)
    error['branch'] = "You must specify a branch";
  if (!script)
    error['script'] = "Dinosaurs can not deploy without a script"

  if (!isEmpty(error)) {
    req.flash('error', error);
    req.flash('data', req.body);
    res.redirect("/create")
    return;
  }


  var repoParts = repo.split("/");

  req.services.github.doesUserHavePushAccess(repoParts[0], repoParts[1], function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var d = new Deploy({
      script: script,
      branch: branchName,
      repo: repo
    });

    d.save(function (err) {
      return err
        ? next(err)
        : res.redirect("/" + repo + "/" + branchName);
    });
  });
};

deploy.view = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var branchName = req.params.branch;

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var query = { repo: fullRepoName, branch: branchName };

    Deploy.findOne(query, function (err, d) {
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
  var branchName = req.params.branch;

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var query = { repo: fullRepoName, branch: branchName };

    Deploy.findOne(query, function (err, d) {
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
  var branchName = req.params.branch;

  // TODO: Validate this form.

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var query = { repo: fullRepoName, branch: branchName };

    Deploy.findOne(query, function (err, d) {
      if (err || !d) return next(err);

      d.script = req.body.script;

      d.save(function (err) {
        return err
          ? next(err)
          : res.redirect("/" + d.repo + "/" + d.branch);
      });
    });
  });
};

deploy.deleteForm = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var branchName = req.params.branch;

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var query = { repo: fullRepoName, branch: branchName };

    Deploy.findOne(query, function (err, d) {
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
  var branchName = req.params.branch;

  req.services.github.doesUserHavePushAccess(req.params.user, req.params.repo, function (err, userHasPushAccess) {
    if (err) return next(err);
    if (!userHasPushAccess) return next(401);

    var query = { repo: fullRepoName, branch: branchName };

    Deploy.delete(query, function (err) {
      return err
        ? next(err)
        : res.redirect("/" + req.session.user.username);
    });
  });
};