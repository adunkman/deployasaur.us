var fs = require("fs"),
    controllers = fs.readdirSync(__dirname);

for (var i = controllers.length - 1; i >= 0; i--) {
   var controller = controllers[i].replace(/\..+$/, "");
   if (controller === "index") continue;
   module.exports[controller] = require("./" + controller);
};
