var Build = module.exports = function (data) {
  var pwd = parsePwd(data.PWD);

  this.id = data.TRAVIS_JOB_ID;
  this.user = pwd.user;
  this.repository = pwd.repository;
  this.commit = data.COMMIT;
  this.branch = parseRefs(data.REFS);
  this.isPullRequest = data.TRAVIS_PULL_REQUEST === "true";
};

var parsePwd = function (pwd) {
  var parts = pwd.split("/"),
      length = parts.length;

  return {
    user: parts[length - 2],
    repository: parts[length - 1]
  };
};

var parseRefs = function (refs) {
  var list = refs.match(/[\w/]+/g);
  return list[list.length - 1];
};