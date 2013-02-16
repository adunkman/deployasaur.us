var Deploy = require("../models/deploy");
var travis = module.exports = {};

travis.script = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var branchName = req.params.branch;
  var buildNumber = req.params.build;
  var buildId = req.query.id;
  var job = req.query.job;

  var query = { repo: fullRepoName, branch: branchName };

  Deploy.findOne(query, function (err, deploy) {
    if (err) return next(err);
    if (!deploy) return res.send(404);

    deploy.builds[buildNumber] = deploy.builds[buildNumber] || [];
    deploy.builds[buildNumber].push({ job: job, checkedInAt: new Date() });

    deploy.save(function (err) {
      if (err) return next(err);

      req.services.travis.getExpectedBuildCount(fullRepoName, buildId, function (err, expectedJobCount) {
        if (err) return next(err);
        var currentJobCount = deploy.builds[buildNumber].length;

        if (currentJobCount < expectedJobCount) {
          return res.send(202, "you are job " + currentJobCount + " of " + expectedJobCount + " to check-in");
        }

        return res.send(200, deploy.script.replace(/\r\n/g, "\n"));
      });
    });
  });
};

travis.status = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var branchName = req.params.branch;
  var buildNumber = req.params.build;
  var job = req.query.job;
  var exitCode = req.body.code;

  var query = { repo: fullRepoName, branch: branchName };

  Deploy.findOne(query, function (err, deploy) {
    if (err) return next(err);
    if (!deploy) return res.send(404);

    var build = deploy.builds[buildNumber] || [];
    var updated = false;

    for (var i = build.length - 1; i >= 0; i--) {
      if (build[i].job == job) {
        build[i].exitCode = exitCode;
        build[i].finishedAt = new Date();
        updated = true;
        break;
      }
    };

    if (!updated) { return res.send(404, "could not find job " + job); }
    deploy.save(function (err) {
      if (err) return next(err);
      return res.send(200);
    });
  });
};