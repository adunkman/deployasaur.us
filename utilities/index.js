var u = module.exports = {};

u.render = function (viewName) {
  return function (req, res) {
    return res.render(viewName);
  };
};

u.send = function (statusCode) {
  return function (req, res) {
    return res.send(statusCode);
  };
};