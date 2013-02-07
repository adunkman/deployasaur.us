var mongo = require("../services/mongo"),
    usersCollection = "users";

var User = module.exports = function (data) {
  this.populate(data);
};

User.prototype.populate = function (data) {
  this.username = data.username;
  this.email = data.email;
  this.gravatarId = data.gravatarId;
  this.avatarUrl = generateGravatarUrl(data.gravatarId);
};

User.prototype.data = function () {
  return {
    username: this.username,
    email: this.email,
    gravatarId: this.gravatarId
  };
};

User.prototype.save = function (callback) {
  var q = { username: this.username };
  mongo.findAndModify(usersCollection, q, this.data(), function (err, data) {
    if (err) return callback(err);
    this.populate(data);
    return callback();
  }.bind(this));
};

User.save = function (data, callback) {
  return new User(data).save(callback);
};

User.findOne = function (query, callback) {
  mongo.findOne(usersCollection, query, function (err, data) {
    if (err) return callback(err);
    if (data) return callback (null, new User(data));
    return callback();
  });
};

var generateGravatarUrl = function (gravatarId) {
  if (!gravatarId) return null;
  return "http://www.gravatar.com/avatar/" + gravatarId + "?d=https:%2F%2Fa248.e.akamai.net%2Fassets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png";
};