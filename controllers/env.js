var env = module.exports = {};

env.parse = function (req, res, next) {
  var buffer = "";
  req.body = {};

  req.setEncoding("utf8");
  req.on("data", function (chunk) { buffer += chunk; });
  req.on("end", function () {
    console.log(buffer);

    var lines = buffer.trim().split("\n");

    for (var i = lines.length - 1; i >= 0; i--) {
      var line = lines[i],
          parts = line.trim().split("=");

      req.body[parts[0]] = parts[1];
    };

    next();
  });
};