var fs = require("fs"),
    stores = fs.readdirSync(__dirname),
    s = module.exports = {};

for (var i = stores.length - 1; i >= 0; i--) {
   var store = stores[i].replace(/\..+$/, "");
   if (store === "index") continue;
   s[store] = require("./" + store);
};
