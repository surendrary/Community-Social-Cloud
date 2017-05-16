var ejs = require("ejs");
var mysql = require('./mysql');
var sendmail = require('sendmail');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var mongo = require("./mongoConnection");
var mongoURL = "mongodb://Shruti:Nyati123!@cluster0-shard-00-00-m8imh.mongodb.net:27017,cluster0-shard-00-01-m8imh.mongodb.net:27017,cluster0-shard-00-02-m8imh.mongodb.net:27017/CMPE281?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"




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
				res.redirect('/getPosts');
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
						res.redirect('/getPosts');
						
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
			

				console.log("valid Login");
				//res.render("Userhomepage");
				console.log(jsonParse);
				
				//#######################################
				if(req.session.loginType == 2 || req.session.loginType == 0) {
					console.log(req.param("inputLoginAs"));
					ejs.renderFile('./views/Userhomepage.ejs',{data:jsonParse,username:req.session.userfullname},function(err, result) {
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
				else if(req.session.loginType == 1)
				{
					ejs.renderFile('./views/moderatorHomepage.ejs',{data:jsonParse,username:req.session.userfullname},function(err, result) {
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
					
			   

		}
		
	},getPosts);
	
	
}





function postMessage(req, res)
{

	mongo.connect(mongoURL, function(err, db){
		var coll = mongo.collection('Messages');
		coll.insert({"senderEmail" : req.session.username, "recieverEmail":req.body.to, "msgSubject" : req.body.subject, "msgBody" : req.body.body}, function(err, user){
			if (user) {
				var mailer = require("nodemailer");
				console.log("YAYYY");
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
			} else {
				console.log("returned false");
				res.code = 401;

			}
		});

	});



}

function getMessages(req,res)
{



	mongo.connect(mongoURL, function(err, db){
		var coll = mongo.collection('Messages');

		coll.find({"senderEmail" : req.session.username}).toArray(function(err, user){
			if (user)
			{

				console.log("********",user);
				res.send(user);

			} else {
				console.log("returned false");
				throw err;
				res.code = 401;

			}
		});


	});



}




exports.addPost = addPost;
exports.addComment = addComment;
exports.getPosts = getPosts;
exports.postMessage = postMessage;
exports.getMessages = getMessages;