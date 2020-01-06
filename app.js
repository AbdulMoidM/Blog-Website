//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my Blog Website! Click the compose button and write a post on anything you like. My website will store it using mongoDB.";
const aboutContent = "This is a fun project I completed for my learning, and hope you enjoy it!.";
const contactContent = "My email is amunawar@u.rochester.edu. Feel free to reach out to me if you would like to!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://abdulmoid:test123@cluster0-pwspc.mongodb.net/test?retryWrites=true&w=majority/blogDB", {useNewUrlParser: true});


const { Schema } = mongoose;
const postSchema = new Schema({

  title: String,
  author: String,
  content: String
}, {timestamps: true});


const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({

    title: req.body.postTitle,
    author:req.body.postAuthor,
    content: req.body.postBody
  }, );


  post.save(function(err){

        res.redirect("/");

  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      author:post.author,
      content: post.content,
      postDate: post.createdAt
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
