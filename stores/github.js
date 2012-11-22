var request = require("request"),
    github = module.exports = {};

github.getExpectedBuildCount = function (build, callback) {
  var url = "https://raw.github.com/" + build.user + "/" +
    build.repository + "/" + build.commit + "/.travis.yml";

  request.get(url, function (err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) {
      return callback(new Error("Unable to retrieve .travis.yml: " +
        res.statusCode));
    }

    // TODO: Parse YAML body and determine all build configurations that
    // travis will run.

    return callback(null, 2);
  });
};