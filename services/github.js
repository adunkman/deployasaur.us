var request = require("request"),
    User = require("../models/user"),
    Repo = require("../models/repo"),
    github = module.exports = function (req, res, next) {
      req.services = req.services || {};
      req.services.github = new GithubService(req);
      return next();
    };

var GithubService = function (req) {
  this.session = req.session;
};

GithubService.prototype.getUser = function (callback) {
  var url = "https://api.github.com/user",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch authenticated user: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching autheticated user: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    return callback(null, new User({
      username: body.login,
      email: body.email
    }));
  });
};

GithubService.prototype.getRepos = function (callback) {
  var url = "https://api.github.com/user/repos",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch repositories: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching repositories: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    var repos = [];

    for (var i = body.length - 1; i >= 0; i--) {
      repos.push(new Repo(body[i]));
    };

    return callback(null, repos);
  });
};

GithubService.prototype.getRepo = function (user, repo, callback) {
  var url = "https://api.github.com/repos/" + user + "/" + repo,
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch repositories: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching repositories: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    return callback(null, new Repo(body));
  });
};