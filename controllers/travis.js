var Deploy = require("../models/deploy");
var travis = module.exports = {};

travis.script = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var buildNumber = req.params.build;
  var buildId = req.query.id;
  var job = req.query.job;

  Deploy.findOne({ repo: fullRepoName }, function (err, deploy) {
    if (err) return next(err);
    if (!deploy) return res.send(404);

    deploy.builds[buildNumber] = deploy.builds[buildNumber] || [];
    deploy.builds[buildNumber].push({ job: job, checkedInAt: new Date() });

    req.services.travis.getExpectedBuildCount(fullRepoName, buildId, function (err, expectedJobCount) {
      if (err) return next(err);
      var currentJobCount = deploy.builds[buildNumber].length;

      if (currentJobCount < expectedJobCount) {
        return res.send(202, "you are job " + currentJobCount + " of " + expectedJobCount + " to check-in");
      }

      return res.send(200, deploy.script);
    });
  });
};


  // if (build.isPullRequest) {
  //   return res.render("scripts/noop.sh.ejs", {
  //     reason: "rawr! dinosaurs never deploy pull requests."
  //   });
  // }

