var request = require("request"),
    async = require("async"),
    User = require("../models/user"),
    Repo = require("../models/repo"),
    headers = {
      "User-Agent": "deployasaurus"
    },
    github = module.exports = function (req, res, next) {
      req.services = req.services || {};
      req.services.github = new GithubService(req);
      return next();
    };

var GithubService = function (req) {
  this.session = req.session;
};

GithubService.prototype.doesUserHavePushAccess = function (user, repo, callback) {
  this.getRepo(user, repo, function (err, repo) {
    if (err) return callback(err);
    if (!repo) return callback(null, false);
    return callback(null, repo.canPush);
  });
};

GithubService.prototype.getUser = function (callback) {
  var url = "https://api.github.com/user",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs, headers: headers }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch authenticated user: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching autheticated user: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    return callback(null, new User({
      username: body.login,
      email: body.email,
      gravatarId: body.gravatar_id
    }));
  });
};

GithubService.prototype.getRepos = function (callback) {
  var url = "https://api.github.com/user/orgs",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  async.parallel({
    userRepos: function (done) { this.getUserRepos(done); }.bind(this),
    orgRepos: function (done) {
      request.get(url, { qs: qs, headers: headers }, function (err, res, body) {
        if (err) return callback("Github: unable to fetch orgs: " + err.toString());
        if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching orgs: " + res.statusCode);

        try { body = JSON.parse(body); }
        catch (e) { return callback("Github: unable to parse orgs response: " + e.toString()); }

        var tasks = [];

        for (var i = body.length - 1; i >= 0; i--) {
          (function (orgName) {
            tasks.push(function (completed) { 
              this.getOrgRepos(orgName, completed); 
            }.bind(this));
          }.bind(this))(body[i].login);
        };

        async.parallel(tasks, function (err, results) {
          if (err) return callback(err);
          done(null, [].concat.apply([], results));
        });
      }.bind(this));
    }.bind(this)
  }, function (err, results) {
    if (err) return callback(err);
    callback(null, results.userRepos.concat(results.orgRepos));
  });
};

GithubService.prototype.getUserRepos = function (callback) {
  var url = "https://api.github.com/user/repos",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs, headers: headers }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch repositories: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching repositories: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse repos response: " + e.toString()); }

    var repos = [];

    for (var i = body.length - 1; i >= 0; i--) {
      repos.push(new Repo(body[i]));
    }

    return callback(null, repos);
  });
};

GithubService.prototype.getOrgRepos = function (org, callback) {
  var url = "https://api.github.com/orgs/" + org + "/repos",
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs, headers: headers }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch repositories: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching repositories: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    var repos = [];

    for (var i = body.length - 1; i >= 0; i--) {
      repos.push(new Repo(body[i]));
    }

    return callback(null, repos);
  });
};

GithubService.prototype.getRepo = function (user, repo, callback) {
  var url = "https://api.github.com/repos/" + user + "/" + repo,
      qs = { access_token: this.session.oauth && this.session.oauth.accessToken };

  request.get(url, { qs: qs, headers: headers }, function (err, res, body) {
    if (err) return callback("Github: unable to fetch repositories: " + err.toString());
    if (res.statusCode !== 200) return callback("Github: unexpected status code when fetching repositories: " + res.statusCode);

    try { body = JSON.parse(body); }
    catch (e) { return callback("Github: unable to parse response: " + e.toString()); }

    return callback(null, new Repo(body));
  });
};