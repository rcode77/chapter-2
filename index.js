// Pemanggilan Package Express
const express = require("express");

// Menggunakan Package Express
const app = express();

// Set Template Engine
app.set("view engine", "hbs");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

const isLogin = true;

// Set Endpoint
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/home", function (req, res) {
  res.render("index");
});

app.get("/blog", function (req, res) {
  res.render("blog", { isLogin: isLogin });
});

app.get("/add-blog", function (req, res) {
  res.render("form-blog");
});

app.post("/blog", function (req, res) {
  let title = req.body.title;
  let content = req.body.content;

  console.log(`Data Title : ${title}`);
  console.log(`Data Content : ${content}`);
});

app.get("/blog/:id", function (req, res) {
  let id = req.params.id;

  console.log(`id dari client ${id}`);

  res.render("blog-detail", { id: id });
});

app.get("/contact-me", function (req, res) {
  res.render("contact");
});

// Konfigurasi Port Aplikasi
const port = 5000;
app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
