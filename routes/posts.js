var ejs = require("ejs");
var mysql = require('./mysql');

function addPost(req, res){
	if(req.session.username){
		var insertPost = "insert into posts (description) values ('"+ req.param('post') +"')";
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
		},insertPost);
	}
}

function addComment(req, res){
	if(req.session.username){
		var insertComment = "insert into comments (postId, comment) values (" + req.param("postId") + ",'" + req.param("comment") + "')";
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

exports.addPost = addPost;
exports.addComment = addComment;