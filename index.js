// Pemanggilan Package Express
const express = require("express");

// Import db Connection
const db = require("./connection/db");

// Menggunakan Package Express
const app = express();

// Set Template Engine
app.set("view engine", "hbs");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

const isLogin = true;

let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Desember",
];

// Set Endpoint
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/home", function (req, res) {
  res.render("index");
});

app.get("/blog", function (req, res) {
  let query = "SELECT * FROM tb_blog ORDER BY id DESC";

  db.connect((err, client, done) => {
    if (err) throw err;

    client.query(query, (err, result) => {
      done();

      if (err) throw err;
      let data = result.rows;

      console.log(data);

      data = data.map((blog) => {
        return {
          ...blog,
          post_at: getFullTime(blog.post_date),
          post_age: getDistanceTime(blog.post_date),
          isLogin: isLogin,
        };
      });
      res.render("blog", { isLogin: isLogin, blogs: data });
    });
  });
});

app.get("/add-blog", function (req, res) {
  res.render("form-blog");
});

app.post("/blog", function (req, res) {
  // let title = req.body.title;
  // let content = req.body.content;
  let { title, content } = req.body;

  let blog = {
    title: title,
    content,
    image: "image.png",
  };

  db.connect((err, client, done) => {
    if (err) throw err;

    let query = `INSERT INTO tb_blog(title, content, image) VALUES
                        ('${blog.title}', '${blog.content}', '${blog.image}')`;

    client.query(query, (err, result) => {
      done();
      if (err) throw err;

      res.redirect("/blog");
    });
  });
});

app.get("/blog/:id", function (req, res) {
  let { id } = req.params;

  db.connect((err, client, done) => {
    if (err) throw err;

    let query = `SELECT * FROM tb_blog WHERE id=${id}`;
    client.query(query, (err, result) => {
      done();
      if (err) throw err;

      result = result.rows[0];

      res.render("blog-detail", { blog: result });
    });
  });
});

app.get("/delete-blog/:id", function (req, res) {
  let { id } = req.params;

  db.connect((err, client, done) => {
    if (err) throw err;

    let query = `DELETE FROM tb_blog WHERE id=${id}`;

    client.query(query, (err, result) => {
      done();
      if (err) throw err;

      res.redirect("/blog");
    });
  });
});

app.get("/update-blog/:id", function (req, res) {
  let { id } = req.params;

  db.connect((err, client, done) => {
    if (err) throw err;

    let query = `SELECT * FROM tb_blog WHERE id=${id}`;

    client.query(query, (err, result) => {
      done();
      if (err) throw err;

      result = result.rows[0];

      res.render("blog-update", { blog: result });
    });
  });
});

app.post("/update-blog/:id", function (req, res) {
  let { id } = req.params;
  let { title, content } = req.body;

  let query = `UPDATE tb_blog SET title='${title}', content='${content}' WHERE id=${id}`;

  db.connect((err, client, done) => {
    if (err) throw err;

    client.query(query, (err, result) => {
      done();
      if (err) throw err;

      res.redirect("/blog");
    });
  });
});

app.get("/contact-me", function (req, res) {
  res.render("contact");
});

// Konfigurasi Port Aplikasi
const port = 5000;
app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});

function getFullTime(time) {
  let date = time.getDate();
  let monthIndex = time.getMonth();
  let year = time.getFullYear();

  let hours = time.getHours();
  let minutes = time.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`;
}

function getDistanceTime(time) {
  //Time Now - Time Post
  const distance = new Date() - new Date(time);

  // Convert to Day
  const miliseconds = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const secondsInHour = secondsInMinute * minutesInHour;
  const hoursInDay = 23;

  let dayDistance = distance / (miliseconds * secondsInHour * hoursInDay);

  if (dayDistance >= 1) {
    return Math.floor(dayDistance) + " day ago";
  } else {
    let hourDistance = Math.floor(distance / (miliseconds * secondsInHour));

    if (hourDistance > 0) {
      return hourDistance + " hour ago";
    } else {
      const minuteDistance = Math.floor(
        distance / (miliseconds * secondsInMinute)
      );
      return minuteDistance + " minute ago";
    }
  }

  console.log(dayDistance);
}
