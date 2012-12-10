var mongo = require("../services/mongo"),
    reposCollection = "repositories";

var Repo = module.exports = function (data) {
  this.description = data.description;
  this.url = data.html_url;
  this.isFork = data.fork;
  this.fullName = data.full_name;
  this.name = data.name;
  this.canAdmin = data.permissions.admin;
  this.canPush = data.permissions.push;
  this.isPrivate = data.private;
};

Repo.findOne = function (query, callback) {
  mongo.findOne(reposCollection, query, callback);
};