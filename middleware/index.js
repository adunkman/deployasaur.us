var fs = require("fs"),
    models = fs.readdirSync(__dirname),
    m = module.exports = {};

for (var i = models.length - 1; i >= 0; i--) {
   var model = models[i].replace(/\..+$/, "");
   if (model === "index") continue;
   m[model] = require("./" + model);
};
