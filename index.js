var express = require("express"),
    HerokuRedisStore = require("connect-heroku-redis")(express),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    c = require("./controllers"),
    m = require("./models"),
    s = require("./services"),
    env = process.env.NODE_ENV || "development",
    port = process.env.PORT || 3000;

app.set("view engine", "jade");

app.use(require("connect-assets")());
app.use(express.static(__dirname + "/public"));
app.use(express.cookieParser("da8493734b04499e80488558cc09da79"));
app.use(express.bodyParser());
app.use(express.session({ store: new HerokuRedisStore(), secret: 'da8493734b04499e80488558cc09da79' }));
app.use(require("connect-flash")());
app.use(require("./middleware").viewclass);

app.use(s.github);
app.use(s.travis);
app.use(c.auth.middleware);

app.get("/", c.about.overview);

app.get("/login", c.auth.login);
app.get("/login/callback", c.auth.callback);
app.get("/logout", c.auth.logout);

app.get("/create", c.deploy.createForm);
app.post("/create", c.deploy.create);
app.get("/create/examples", c.about.examples);

app.get("/:user", c.user.view);
app.get("/:user/:repo", c.deploy.view);
app.get("/:user/:repo/edit", c.deploy.editForm);
app.post("/:user/:repo/edit", c.deploy.edit);
app.get("/:user/:repo/delete", c.deploy.deleteForm);
app.post("/:user/:repo/delete", c.deploy.delete);
app.get("/:user/:repo/:build/script", c.travis.script);

app.use(app.router);
app.use(c.error.handleErrors);
app.use(c.error.catchAll);

s.mongo.on("ready", function () {
  server.listen(port, function () {
    console.log("deployasaurus rawring at " + port + " in " + env);
  });
});
