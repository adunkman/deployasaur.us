var mongo = require("../services/mongo");

var Repo = module.exports = function (data) {
  this.description = data.description;
  this.url = data.html_url;
  this.isFork = data.fork;
  this.name = data.full_name;
  this.canAdmin = data.permissions.admin;
  this.canPush = data.permissions.push;
  this.isPrivate = data.private;
};