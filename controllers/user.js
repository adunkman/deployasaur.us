var user = module.exports = {};

user.profile = function (req, res, next) {
  if (!req.profile) return next();
  req.profile.isYou = (req.user && req.user.username === req.profile.username);

  s.builds.historyForUser(req.profile.username, function (err, history) {
    if (err) return next(err);

    return res.render("profile", {
      profile: req.profile,
      history: history
    });
  });
};

user.login = function (req, res, next) {
  // TODO: redirect to github auth endpoint
};

user.logout = function (req, res, next) {
  // TODO: destroy session
};