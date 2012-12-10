var about = module.exports = {};

about.overview = function (req, res, next) {
  return res.render("about/overview");
};