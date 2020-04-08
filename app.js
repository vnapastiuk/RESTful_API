const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require('ejs');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});;
const articlesSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}

const Article = mongoose.model('article', articlesSchema);
///request targeting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added some item");
      }
    })
  })
  .delete(function(res, req) {
    Article.deleteMany(function(err, res) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });
///request targeting a specific article
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (!err) {
        if (article) {
          res.send(article);
        } else {
          res.send("No article matching that title was found");
        }
      } else {
        res.send(err);
      }
    });
  })
  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      },{
        title: req.body.title,
         content: req.body.content
       },
       function(err) {
          if (!err){
            res.status(200).send("Record successfully updated.");
          }else{
            res.send(err);
          }
      });
  })
  .patch(function(req,res){
    Article.updateOne({
      title: req.params.articleTitle
    },{
      $set: req.body
    },function(err){
      if(!err){
        res.send("Successfully updated data!");
      }
    }
  );
  })
  .delete(function(req,res){
    Article.deleteOne({
      title: req.params.articleTitle
    },function(err){
      if(!err){
        res.send("Successfully deleted the specified article");
      }else{
        res.send(err);
      }
    }
  )
  })



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
