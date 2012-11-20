var travis = module.exports = {};

travis.notify = function (req, res, next) {
  next();
};

travis.deploy = function (req, res, next) {
  res.locals.app = "adunkman";
  res.locals.key = "818193c0a8edd289d284a155b0e112ca";
  res.locals.branch = "master";

  next();
};