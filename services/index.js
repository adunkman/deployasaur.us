var fs = require("fs"),
    services = fs.readdirSync(__dirname),
    s = module.exports = {};

for (var i = services.length - 1; i >= 0; i--) {
  var service = services[i].replace(/\..+$/, "");
  if (service === "index") continue;
  s[service] = require("./" + service);
};
