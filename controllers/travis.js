var travis = module.exports = {};

travis.script = function (req, res, next) {
  var fullRepoName = req.params.user + "/" + req.params.repo;
  var build = req.params.build;

  //res.send(200, "env");
  //res.send(202, "you are job 2 of 4 to check-in");
  res.send(501);

  // var build = new Build(req.body);

  // if (build.isPullRequest) {
  //   return res.render("scripts/noop.sh.ejs", {
  //     reason: "rawr! dinosaurs never deploy pull requests."
  //   });
  // }

  // s.users.findByUsername(build.user, function (err, user) {
  //   if (err) {
  //     return res.render("scripts/noop.sh.ejs", {
  //       reason: "something went wrong.",
  //       error: err
  //     });
  //   }

  //   if (!user) {
  //     return res.render("scripts/noop.sh.ejs", {
  //       reason: "who's " + build.user + "? i certainly don't know."
  //     });
  //   }

  //   var app = user.getApp(build.repository);

  //   if (!app) {
  //     return res.render("scripts/noop.sh.ejs", {
  //       reason: "i don't recognize the " + build.repository + " repository."
  //     });
  //   }

  //   if (build.branch !== app.branch) {
  //     return res.render("scripts/noop.sh.ejs", {
  //       reason: "i deploy the " + app.branch + " branch only."
  //     });
  //   }

  //   s.builds.recordBuild(build, function (err, similarCount) {
  //     if (err) {
  //       return res.render("scripts/noop.sh.ejs", {
  //         reason: "something went wrong.",
  //         error: err
  //       });
  //     }

  //     s.github.getExpectedBuildCount(build, function (err, expectedCount) {
  //       if (err) {
  //         return res.render("scripts/noop.sh.ejs", {
  //           reason: "something went wrong.",
  //           error: err
  //         });
  //       }

  //       if (expectedCount > similarCount) {
  //         var remaining = expectedCount - similarCount,
  //             plural = remaining === 1 ? "" : "s";

  //         return res.render("scripts/noop.sh.ejs", {
  //           reason: "expecting " + remaining + " more build" + plural + " before deploying."
  //         });
  //       }

  //       return res.render("scripts/deploy." + app.host + ".sh.ejs", {
  //         build: build, user: user, app: app
  //       });
  //     });
  //   });
  // });
};