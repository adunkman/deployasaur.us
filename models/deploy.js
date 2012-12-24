var mongo = require("../services/mongo"),
    deploysCollection = "deploys";

var Deploy = module.exports = function (data) {
  this.populate(data);
};

Deploy.prototype.populate = function (data) {
  this.script = data.script;
  this.repo = data.repo;
};

Deploy.prototype.getValidationErrors = function () {
  return [];
};