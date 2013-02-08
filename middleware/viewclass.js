var path = require("path");

module.exports = function(req, res, next) {
   res.locals.viewClass = function(locals) {
        viewFile = locals.filename;
        viewDir = path.join(__dirname, "/../views/");

        return viewFile.replace(viewDir, "")
                       .replace(".jade", "")
                       .replace(/\//g, "-");
    };

    next();
}