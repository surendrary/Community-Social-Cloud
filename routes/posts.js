var ejs = require("ejs");
var mysql = require('./mysql');

function addPost(req, res){
	if(req.session.username){
		var insertPost = "insert into posts (description, moderator, postTime, moderatorName) values ('"+ req.param('post') +"', " + req.session.userId +", CURRENT_TIMESTAMP(), '" + req.session.userfullname + "')";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				var json_responses = {
					"statusCode" : 200
				}
				res.render("moderatorHomepage");
			}
		},insertPost);
	}
}

function addComment(req, res){
	if(req.session.username){
		var insertComment = "insert into comments (postId, comment, commentor, commentTime, commentorName) values (" + req.param("postId") + ",'" + req.param("comment") + "', " + req.session.userId + ", CURRENT_TIMESTAMP() ,'" + req.session.userfullname + "')";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				var updatePosts = "update posts set noOfComments = noOfComments + 1 where id = " + req.param("postId") + "";
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						var json_responses = {
							"statusCode" : 200
						}
						res.send(json_responses);
						
					}
				},updatePosts);
			}
		},insertComment);
	}
}

function getPosts(req,res){
	
	var getPosts = "SELECT ID, posts.moderatorName,posts.postTime,posts.Description, GROUP_CONCAT(Comment) AS comments,GROUP_CONCAT(commentTime) as commentTime, GROUP_CONCAT(commentorName) as commentorName FROM posts LEFT JOIN comments ON posts.ID = comments.postId GROUP BY ID";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			var rows = results;
			console.log("rows");
			var jsonString = JSON.stringify(results);
			var jsonParse = JSON.parse(jsonString);
			
			if(results.length > 0){
				console.log("valid Login");
				//res.render("Userhomepage");
				console.log(jsonParse);
				ejs.renderFile('./views/Userhomepage.ejs',{data:jsonParse},function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
				});
			   
			}
			else{
				res.render("failLogin");
			}
		}
		
	},getPosts);
	
	
}







exports.addPost = addPost;
exports.addComment = addComment;
exports.getPosts = getPosts;