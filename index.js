var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server)
    c = require("./controllers"),
    m = require("./models"),
    u = require("./utilities"),
    env = process.env.NODE_ENV || "development",
    port = process.env.PORT || 3000;

app.set("view engine", "jade");

app.use(require("connect-assets")());

app.get("/", c.about.overview, u.render("about"));

app.post("/build", u.parseEnv, m.build.middleware, c.travis.build);

server.listen(port, function () {
  console.log("deployasaurus rawring at " + port + " in " + env);
});
