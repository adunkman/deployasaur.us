var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server)
    c = require("./controllers"),
    u = require("./utilities"),
    env = process.env.NODE_ENV || "development",
    port = process.env.PORT || 3000;

app.set("view engine", "jade");

app.use(express.logger());
app.use(require("connect-assets")());
app.use(express.json());

app.get("/", c.about.overview, u.render("about"));

app.post("/travis/notify", c.travis.notify, u.send(200));
app.get("/travis/deploy/:commit", c.travis.deploy, u.render("deploy.sh.ejs"));

server.listen(port, function () {
  console.log("deployasaurus rawring at " + port + " in " + env);
});
