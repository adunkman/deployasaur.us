var about = module.exports = {};

about.overview = function (req, res, next) {
  return res.render("about/overview");
};

about.examples = function (req, res, next) {
  return res.render("about/examples");
};