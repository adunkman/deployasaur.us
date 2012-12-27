var http = require("http");
var error = module.exports = {};

error.handleErrors = function (err, req, res, next) {
  var statusCode = 500;

  if (!isNaN(err)) {
    statusCode = err;
  }
  else {
    console.error(err);
  }

  // TODO: redirect to login if unauthorized
//  if (statusCode === 401 && !req.session.user) {
//    return res.redirect("/login?returnUrl=" + encodeURIComponent(req.originalUrl));
//  }

  res.statusCode = statusCode;
  res.render("error", {
    statusCode: statusCode,
    statusDescription: http.STATUS_CODES[statusCode]
  });
};

error.catchAll = function (req, res, next) {
  res.render("error", {
    statusCode: 404,
    statusDescription: http.STATUS_CODES[404]
  });
};