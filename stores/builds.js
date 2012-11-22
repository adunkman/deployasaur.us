var store = {},
    builds = module.exports = {};

builds.recordBuild = function (build, callback) {
  builds[build.commit] = builds[build.commit] || [];
  builds[build.commit].push(build.id);

  return callback(null, builds[build.commit].length);
};