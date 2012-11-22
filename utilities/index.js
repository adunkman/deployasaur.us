var u = module.exports = {};

u.render = function (viewName) {
  return function (req, res) {
    return res.render(viewName);
  };
};

u.send = function (statusCode) {
  return function (req, res) {
    return res.send(statusCode);
  };
};

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