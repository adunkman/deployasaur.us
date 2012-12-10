var crypto = require("crypto"),
    mongo = require("../services/mongo"),
    usersCollection = "users";

var User = module.exports = function (data) {
  this.populate(data);
};

User.prototype.populate = function (data) {
  this.username = data.username;
  this.email = data.email;
  this.avatarUrl = generateGravatarUrl(this.email);
};

User.prototype.save = function (callback) {
  var q = { username: this.username };
  mongo.findAndModify(usersCollection, q, this, function (err, data) {
    if (err) return callback(err);
    this.populate(data);
    return callback();
  }.bind(this));
};

User.findOne = function (query, callback) {
  mongo.findOne(usersCollection, query, function (err, data) {
    if (err) return callback(err);
    if (data) return callback (null, new User(data));
    return callback();
  });
};

var generateGravatarUrl = function (email) {
  if (!email) return null;

  var hash = crypto.createHash("md5");
  hash.update(email.trim().toLowerCase());
  return "http://www.gravatar.com/avatar/" + hash.digest("hex") + "?d=https:%2F%2Fa248.e.akamai.net%2Fassets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png";
};

var save = function (data, callback) {
  return mongo.save(usersCollection, data, function (err) {
    if (err) return callback(err);
    mongo.findOne(usersCollection, data, callback);
  });
};