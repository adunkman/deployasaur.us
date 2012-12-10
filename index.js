var express = require("express"),
    HerokuRedisStore = require("connect-heroku-redis")(express),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server)
    c = require("./controllers"),
    m = require("./models"),
    s = require("./services"),
    u = require("./utilities"),
    env = process.env.NODE_ENV || "development",
    port = process.env.PORT || 3000;

app.set("view engine", "jade");

app.use(require("connect-assets")());
app.use(express.static(__dirname + "/public"));
app.use(express.cookieParser("da8493734b04499e80488558cc09da79"));
app.use(express.session({ store: new HerokuRedisStore(), secret: 'da8493734b04499e80488558cc09da79' }));

app.use(s.github);
app.use(c.auth.middleware);

app.post("/build", u.parseEnv, c.travis.build);

app.get("/", c.user.view, c.about.overview);

app.get("/login", c.auth.login);
app.get("/login/callback", c.auth.callback);
app.get("/logout", c.auth.logout);

app.get("/:user/:repo", c.repos.view);

s.mongo.on("ready", function () {
  server.listen(port, function () {
    console.log("deployasaurus rawring at " + port + " in " + env);
  });
});
