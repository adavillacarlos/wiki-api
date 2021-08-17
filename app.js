//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { runInNewContext } = require("vm");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Create schema
const articleSchema = {
    title: String, 
    content: String
}

//Create model
const Article = mongoose.model("Article", articleSchema);

//Request targeting all Articles

app.route("/articles")
.get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err)
            res.send(foundArticles);
        else 
            res.send(err);
    }); 
})
.post(function(req, res){
    //create a new data to the collection
    const newArticle = new Article ({
        title: req.body.title, 
        content: req.body.content
    }); 
    newArticle.save(function(err){
        if(err)
            console.log(err); 
        else   
            console.log("Added a new article"); 
    });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(err)
            res.send(err); 
        else
            res.send("Deleted articles");
    }); 
}); 


//Request targetting a specific articles
app.route("/articles/:articleTitle")
    
    .get(function(req,res){
        Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
            if(foundArticle)
                res.send(foundArticle); 
            else   
                res.send("No article found"); 
        }); 
    }) 
    
    .patch(function(req,res){
        //may need $ in the set to update it.
        //may also use update but it is deprecated. 
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {$set: req.body}, function(err){
                if(err) 
                    res.send(err); 
                else
                    res.send("updated article"); 
            }); 
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
            if(err)
                res.send(err); 
            else
                res.send("delete an article")
        }); 
    }); 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
