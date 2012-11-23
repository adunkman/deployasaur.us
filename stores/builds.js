var store = {},
    builds = module.exports = {};

builds.recordBuild = function (build, callback) {
  builds[build.commit] = builds[build.commit] || [];
  builds[build.commit].push(build.id);

  return callback(null, builds[build.commit].length);
};

builds.count = function (callback) {
  var count = 0;

  for (var build in store) {
    count += build.length;
  }

  return callback(null, count);
};

builds.historyForUser = function (username, callback) {
  return callback(null, []);
};