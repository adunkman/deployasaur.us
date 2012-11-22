var fs = require("fs"),
    controllers = fs.readdirSync(__dirname),
    c = module.exports = {};

for (var i = controllers.length - 1; i >= 0; i--) {
   var controller = controllers[i].replace(/\..+$/, "");
   if (controller === "index") continue;
   c[controller] = require("./" + controller);
};
