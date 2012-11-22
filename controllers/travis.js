var request = require("request"),
    travis = module.exports = {},
    pending = {};

travis.test = function (req, res, next) {
  console.log("body:", req.body);
  next();
};

travis.deploy = function (req, res, next) {
  var commit = req.body.commit,
      repo = "adunkman/dunkman.org",
      app = "adunkman",
      key = "818193c0a8edd289d284a155b0e112ca",
      branch = "master";

  res.locals.app = app;
  res.locals.key = key;
  res.locals.branch = branch;

  res.writeHead(200);

  pending[commit] = pending[commit] || [];

  pending[commit].push({
    res: res,
    next: next
  });

  getBuildMatrix(repo, commit, function (err, matrix) {
    if (err) return next(err);

    if (matrix.length === pending[commit].length) {
      pending[commit][0].next();

      for (var i = pending[commit].length - 1; i >= 1; i--) {
        pending[commit][i].res.end();
      };

      delete pending[commit];
    }
  });
};

var getBuildMatrix = function (repo, commit, callback) {
  var yml = "https://raw.github.com/" + repo + "/" + commit + "/.travis.yml";

  request.get(yml, function (err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(res.statusCode);

    // TODO: Parse YAML body and determine all build configurations that
    // travis will run.

    return callback(["0.8", "0.6"]);
  });
};

var keepalive = function () {
  for (var i = pending.length - 1; i >= 0; i--) {
    pending[i].res.write(" ");
  };

  setTimeout(keepalive, 20000);
};

keepalive();