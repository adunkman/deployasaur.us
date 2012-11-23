var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server)
    c = require("./controllers"),
    m = require("./models"),
    s = require("./stores"),
    u = require("./utilities"),
    env = process.env.NODE_ENV || "development",
    port = process.env.PORT || 3000;

app.set("view engine", "jade");

app.use(require("connect-assets")());
app.use(u.tagline);

app.post("/build", u.parseEnv, m.build.middleware, c.travis.build);

app.get("/", c.about.overview);
app.get("/login", c.user.login);
app.get("/:u", s.users.findByParam("u"), c.user.profile);

server.listen(port, function () {
  console.log("deployasaurus rawring at " + port + " in " + env);
});
