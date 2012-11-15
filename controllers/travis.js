var travis = module.exports = {};

travis.complete = function (req, res, next) {
  var exitCode = req.body.status,
      branch = req.body.branch,
      repository = req.body.repository.url,
      commit = req.body.commit;

  if (exitCode === 0) {
    if (branch === "master") {
      console.log("tests pass, returning deploy script for " + repository);

      lookup(repository, function (err, app, key) {
        if (err || !(app && key)) {
          if (err) console.error(err);

          res.locals({
            error: "rawr! deployasaurus is unable to find heroku app info."
          });
        }
        else {
          res.locals({
            app: app,
            key: key,
            branch: branch
          });
        }

        next();
      });
    }
    else {
      console.warn("tests pass, but branch " + branch + " != master. not deploying " + repository);
    }
  }
  else {
    console.warn("tests fail, rawr! not deploying " + repository);
  }

  next();
};

var lookup = function (repository, callback) {
  if (repository === "https://github.com/adunkman/dunkman.org") {
    var key = "818193c0a8edd289d284a155b0e112ca",
        app = "adunkman";

    callback(null, app, key);
  }
  else {
    callback(null, null, null);
  }
};