var url = require("url"),
    events = require("events"),
    mongodb = require("mongodb"),
    db = null,
    mongo = module.exports = new events.EventEmitter();

mongodb.MongoClient.connect(process.env.MONGOHQ_URL, function (err, database) {
  if (err) throw err;
  if (!database) throw new Error("Database was not found.");

  db = database;
  mongo.emit("ready");
});

mongo.ObjectID = mongodb.ObjectID;

mongo.findOne = function (collectionName, query, callback) {
  db.collection(collectionName, function (err, collection) {
    if (err) return callback(err);
    collection.findOne(query, callback);
  });
};

mongo.find = function (collectionName, query, callback) {
  db.collection(collectionName, function (err, collection) {
    if (err) return callback(err);
    collection.find(query).toArray(callback);
  });
};

mongo.findAndModify = function (collectionName, query, data, callback) {
  var sort = [["_id", "ascending"]];

  db.collection(collectionName, function (err, collection) {
    if (err) return callback(err);

    collection.findAndModify(query, sort, data, { "new": true, upsert: true }, function (err, data) {
      if (err && err.message === "exception: assertion src/mongo/db/../bson/bsonobjbuilder.h:131") {
        // https://github.com/mongodb/node-mongodb-native/issues/699
        return collection.findOne(query, callback);
      }

      return callback(err, data);
    });
  });
};

mongo.save = function (collectionName, document, callback) {
  db.collection(collectionName, function (err, collection) {
    if (err) return callback(err);
    collection.save(document, function (err, result) {
      if (err) return callback(err);
      return mongo.findOne(collectionName, document, callback);
    });
  });
};

mongo.remove = function (collectionName, query, callback) {
  db.collection(collectionName, function (err, collection) {
    if (err) return callback(err);
    collection.remove(query, callback);
  });
};