var querystring = require("querystring"),
    request = require("request"),
    User = require("../models/user"),
    clientId = process.env.GITHUB_CLIENT_ID || "fd4e3d65812a657ca014",
    clientSecret = process.env.GITHUB_CLIENT_SECRET || "0fa21fd8086a357bf479c1d7d5099bcf133a87fc",
    auth = module.exports = {};

auth.login = function (req, res, next) {
  var endpoint = "https://github.com/login/oauth/authorize",
      qs = { client_id: clientId },
      url = endpoint + "?" + querystring.stringify(qs);

  return res.redirect(url);
};

auth.callback = function (req, res, next) {
  var endpoint = "https://github.com/login/oauth/access_token",
      options = {
        form: {
          client_id: clientId,
          client_secret: clientSecret,
          code: req.query.code
        },
        headers: {
          "Accept": "application/json"
        }
      };

  request.post(endpoint, options, function (err, r, body) {
    if (err) return next(err);
    if (r.statusCode !== 200) return next("Error fetching token: " + body);

    try { body = JSON.parse(body); }
    catch (e) { return next("Unable to parse token response: " +  e.toString()); }

    if (body.error) return next("Error from token response: " + body.error);

    req.session.oauth = {
      accessToken: body.access_token,
      tokenType: body.token_type
    };

    req.services.github.getUser(function (err, user) {
      if (err) return next(err);

      user.save(function (err) {
        if (err) return next(err);
        req.session.user = user;
        return res.redirect("/" + user.username);
      });
    });
  });
};

auth.logout = function (req, res, next) {
  req.session.destroy();
  return res.redirect("/");
};

auth.middleware = function (req, res, next) {
  res.locals.authUser = req.session.user;
  return next();
};

auth.require = function (req, res, next) {
  var user = req.session.user;
  return user ? next() : next(401);
}