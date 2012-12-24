var async = require("async"),
    User = require("../models/user"),
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
  var user = req.session.user;
  var script = req.body.script;
  var repo = req.body.repo;

  // TODO: Validate this form.

  user.deploys.push({
    script: script,
    repo: repo
  });

  User.save(user, function (err) {
    return err
      ? next(err)
      : res.redirect("/" + repo);
  });
};

deploy.view = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var repo = (function () {
    for (var i = user.deploys.length - 1; i >= 0; i--) {
      var obj = user.deploys[i];

      if (obj.repo === fullRepoName) {
        return obj;
      }
    }
  })();

  if (!repo) return next();

  res.render("deploy/view", {
    deploy: repo
  });
};

deploy.editForm = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var repo = (function () {
    for (var i = user.deploys.length - 1; i >= 0; i--) {
      var obj = user.deploys[i];

      if (obj.repo === fullRepoName) {
        return obj;
      }
    }
  })();

  if (!repo) return next();

  res.render("deploy/edit", {
    deploy: repo
  });
};

deploy.edit = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var repo = (function () {
    for (var i = user.deploys.length - 1; i >= 0; i--) {
      var obj = user.deploys[i];

      if (obj.repo === fullRepoName) {
        return obj;
      }
    }
  })();

  if (!repo) return next();

  // TODO: Validate this form.

  repo.script = req.body.script;

  User.save(user, function (err) {
    return err
      ? next(err)
      : res.redirect("/" + repo.repo);
  });
};

deploy.deleteForm = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var repo = (function () {
    for (var i = user.deploys.length - 1; i >= 0; i--) {
      var obj = user.deploys[i];

      if (obj.repo === fullRepoName) {
        return obj;
      }
    }
  })();

  if (!repo) return next();

  res.render("deploy/delete", {
    deploy: repo
  });
};

deploy.delete = function (req, res, next) {
  var user = req.session.user;
  var fullRepoName = req.params.user + "/" + req.params.repo;

  for (var i = user.deploys.length - 1; i >= 0; i--) {
    var obj = user.deploys[i];

    if (obj.repo === fullRepoName) {
      user.deploys.splice(i, 1);
    }
  }

  User.save(user, function (err) {
    return err
      ? next(err)
      : res.redirect("/");
  });
};