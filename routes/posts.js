var ejs = require("ejs");
var mysql = require('./mysql');
var sendmail = require('sendmail');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');


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
				/*ejs.renderFile('./views/Userhomepage.ejs',{data:jsonParse},function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
				});*/
				res.render("Userhomepage",{data:jsonParse});
			   
			}
			else{
				res.render("failLogin");
			}
		}
		
	},getPosts);
	
	
}

function postMessage(req, res){
	console.log("************REQ:",req.session.username);
	if(req.session.username){
		console.log("************BODY:",req.body);
		var insertPost = "insert into Messages (senderEmail, recieverEmail, msgSubject, msgBody) values ('"+ req.session.username +"', '" + req.body.to +"',  '" + req.body.subject +"', '" + req.body.body + "')";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				//logic to send mail here
				var mailer = require("nodemailer");
				console.log("YAYYY");
// Use Smtp Protocol to send Email
				var smtpTransport = nodemailer.createTransport({
					service: "gmail",
					host: "smtp.gmail.com",
					auth: {
						user: "testmyouth@gmail.com",
						pass: "Testouth1@"
					}
				});


				var mailOptions={
					to : req.body.to,
					subject : req.body.subject,
					text : req.body.body
				}
				console.log(mailOptions);
				smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
						console.log(error);
						res.end("error");
					}else{
						console.log("Message sent: " + response.message);
						res.end("sent");
					}
				});
			}
		},insertPost);
	}
}

function getMessages(req,res)
{
	var getMessages = "select * from Messages where senderEmail = '"+ req.session.username +"'";
	console.log("Query is:"+getMessages);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0)
			{
				var rows = results;
				console.log("rows");
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				console.log(jsonParse);
				res.send(jsonParse);


			}
		}

	},getMessages);
}




exports.addPost = addPost;
exports.addComment = addComment;
exports.getPosts = getPosts;
exports.postMessage = postMessage;
exports.getMessages = getMessages;