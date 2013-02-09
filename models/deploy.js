var mongo = require("../services/mongo");
var deploysCollection = "deploys";

var Deploy = module.exports = function (data) {
  this.populate(data);
};

Deploy.prototype.populate = function (data) {
  this.repo = data.repo;
  this.branch = data.branch || 'master';
  this.script = data.script;
  this.builds = data.builds || {};
};

Deploy.prototype.data = function () {
  return {
    repo: this.repo,
    branch: this.branch,
    script: this.script,
    builds: this.builds
  };
};

Deploy.prototype.save = function (callback) {
  var q = { repo: this.repo };

  if (this.branch == 'master')
    q["$where"] = "this.branch == null || this.branch == 'master'";
  else
    q.branch = this.branch;

  mongo.findAndModify(deploysCollection, q, this.data(), function (err, data) {
    if (err) return callback(err);
    this.populate(data);
    return callback();
  }.bind(this));
};

Deploy.prototype.delete = function (callback) {
  Deploy.delete(this.repo, callback);
};

Deploy.delete = function (query, callback) {
  mongo.remove(deploysCollection, query, callback);
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