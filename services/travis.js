var request = require("request");

var travis = module.exports = function (req, res, next) {
  req.services = req.services || {};
  req.services.travis = new TravisService();
  return next();
};

var TravisService = function () {};

TravisService.prototype.getExpectedBuildCount = function (repo, buildId, callback) {
  var url = "https://api.travis-ci.org/repos/" + repo + "/builds/" + buildId;

  request.get(url, function (err, res, body) {
    if (err) return callback("Travis: unable to fetch build configuration: " + err.toString());
    if (res.statusCode !== 200) return callback("Travis: unexpected status code when fetching build configuration: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Travis: unable to parse response: " + e.toString()); }

    return callback(null, body.matrix.length);
  });
};