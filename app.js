//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-Binu:"+ process.env.password +"@cluster0-9npsv.mongodb.net/postDB", {
  useNewUrlParser: true
});

const homeStartingContent = "In this Daily Journal anyone can write there own Blog post and that blog post will remain here for 1 day. Ranking of Blog post will be given according to their submission. If you want to Delete your post contact at kbinu42@gmail.com.";
const aboutContent = "This Blog post is Created by Binu kumar. He is currently a second year Computer Science undergraduate. I created this website with the user's perspective in mind.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});
const Post = new mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find(function (error, Posts) {
    if (!error) {
      res.render('home', {
        startingContent: homeStartingContent,
        posts: Posts
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});


app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function (error) {
    if (!error) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  Post.findOne({
    _id: requestedId
  }, function (error, post) {
    if (!error) {
      res.render('post', {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
