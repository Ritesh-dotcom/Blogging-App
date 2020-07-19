var express=require('express'),
    app=express(),
	bodyParser=require('body-parser'),
	methodOverride=require('method-override'),
	mongoose=require('mongoose');
//Configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/Blog_App", {useNewUrlParser: true, useUnifiedTopology: true});
//Schema SetUp
var blogSchema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now} 
	
});

var Blog= mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
	Blog.find({}, function(err, blogposts){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogsposts:blogposts});
		}
	});
});

//Index
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogposts){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogsposts:blogposts});
		}
	});
});


app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	//create blog
	Blog.create(req.body.blog, function(err, blogposts){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog:foundBlog});
		}
	})
});

//Edit
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blogpost){
		if(err){
			console.log(err);
		}
		else{
			res.render("edit",{blog:blogpost});
		}
	});
});

//Update Route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundPost){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

//Delete
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});
app.listen(8000, function(){
	console.log("Server is Started");
});