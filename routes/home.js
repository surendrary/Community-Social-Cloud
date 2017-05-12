var ejs = require("ejs");
var mysql = require('./mysql');


function signin(req,res) {

	ejs.renderFile('./views/index.ejs',function(err, result) {
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


function afterSignIn(req,res)
{


	var loginAs= req.param("inputLoginAs");
	var getUser;
	if(loginAs == 0 || loginAs == 1)
	{
		getUser="select * from users where username='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'and userType ='" + req.param("inputLoginAs") +"'";

	}
	else
	{
		getUser = "select * from users where username='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'and empId ='" + req.param("inputEmployeeId") +"'"

	}

		console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				req.session.username = results[0].username;
				if(req.param("inputLoginAs") == 2) {
					res.render("Userhomepage");
				}
				else if(req.param("inputLoginAs") == 1)
					res.render("moderatorHomepage");
				else
					res.render("failLogin");

			}
			else {    
				
				console.log("Invalid Login");
				ejs.renderFile('./views/index.ejs',function(err, result) {
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
	},getUser);
}

function getAllUsers(req,res)
{
	var getAllUsers = "select * from users";
	console.log("Query is:"+getAllUsers);
	if(req.session.username){
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					
					var rows = results;
					var jsonString = JSON.stringify(results);
					var jsonParse = JSON.parse(jsonString);

					ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result) {
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
				else {    
					
					console.log("No users found in database");
					ejs.renderFile('./views/failLogin.ejs',function(err, result) {
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
		},getAllUsers);
	}
}


function afterRegister(req,res)
{
	var json_responses;
	var registerUser="insert into users(username,password,firstname,lastname,usertype) values('"+req.param("username")+"','"+req.param("password")+"','"+req.param("firstname")+"','"+req.param("lastname")+"',2)";
	mysql.fetchData(function(err,results){
		if(err){

			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
		else {

			res.render("index");


		}
	},registerUser);

}











exports.afterRegister=afterRegister;
exports.signin=signin;
exports.afterSignIn=afterSignIn;
exports.getAllUsers=getAllUsers;