var s = require("../stores"),
    about = module.exports = {};

about.overview = function (req, res, next) {
  s.builds.count(function (err, count) {
    if (err) return next(err);

    return res.render("about", {
      builds: count
    });
  });
};