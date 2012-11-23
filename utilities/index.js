var u = module.exports = {};

u.parseEnv = function (req, res, next) {
  var buffer = "";
  req.body = {};

  req.setEncoding("utf8");
  req.on("data", function (chunk) { buffer += chunk; });
  req.on("end", function () {
    var lines = buffer.trim().split("\n");

    for (var i = lines.length - 1; i >= 0; i--) {
      var line = lines[i],
          parts = line.split("=");

      req.body[parts[0].trim()] = parts[1].trim();
    };

    next();
  });
};

var taglines = [
  "run your tests or i’ll eat you.",
  "deploy early, deploy often or you’ll go extinct preparing releases.",
  "you’re prehistoric without automated deployments."
];

u.tagline = function (req, res, next) {
  var line = taglines[Math.floor(Math.random() * 100) % taglines.length];
  res.locals.tagline = line;
  next();
};