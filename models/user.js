var User = module.exports = function () {
  this.username = "adunkman";

  this.heroku = {
    apiKey: "818193c0a8edd289d284a155b0e112ca"
  };

  this.apps = [{
    host: "heroku",
    name: "adunkman",
    repository: "dunkman.org",
    branch: "nodejs"
  }];
};

User.prototype.getApp = function (repository) {
  for (var i = this.apps.length - 1; i >= 0; i--) {
    var app = this.apps[i];
    if (app.repository === repository) return app;
  };
};