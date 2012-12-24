var mongo = require("../services/mongo");
var deploysCollection = "deploys";

var Deploy = module.exports = function (data) {
  this.populate(data);
};

Deploy.prototype.populate = function (data) {
  this.repo = data.repo;
  this.script = data.script;
  this.builds = data.builds || {};
};

Deploy.prototype.data = function () {
  return {
    repo: this.repo,
    script: this.script,
    builds: this.builds
  };
};

Deploy.prototype.save = function (callback) {
  var q = { repo: this.repo };
  mongo.findAndModify(deploysCollection, q, this.data(), function (err, data) {
    if (err) return callback(err);
    this.populate(data);
    return callback();
  }.bind(this));
};

Deploy.prototype.delete = function (callback) {
  Deploy.delete(this.repo, callback);
};

Deploy.delete = function (repo, callback) {
  mongo.remove(deploysCollection, { repo: repo }, callback);
};

Deploy.save = function (data, callback) {
  return new Deploy(data).save(callback);
};

Deploy.find = function (query, callback) {
  mongo.find(deploysCollection, query, function (err, data) {
    if (err) return callback(err);

    var deploys = [];
    data = data || [];

    for (var i = data.length - 1; i >= 0; i--) {
      deploys.push(new Deploy(data[i]));
    }

    return callback(null, deploys);
  });
};

Deploy.findOne = function (query, callback) {
  mongo.findOne(deploysCollection, query, function (err, data) {
    if (err) return callback(err);
    if (data) return callback(null, new Deploy(data));
    return callback();
  });
};