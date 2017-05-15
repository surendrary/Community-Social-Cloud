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
	if(loginAs == 0 || loginAs == 2)
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
				req.session.userId = results[0].userId;
					//**********************************************8
					var getPosts ="SELECT ID, posts.Description, GROUP_CONCAT(Comment) AS comments FROM posts LEFT JOIN comments ON posts.ID = comments.postId GROUP BY ID";
					console.log("Query is:"+getUser);
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
								if(req.param("inputLoginAs") == 2) {
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
							else if(req.param("inputLoginAs") == 1)
							{
								ejs.renderFile('./views/moderatorHomepage.ejs',{data:jsonParse},function(err, result) {
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
							else
                                {
                                    res.render("adminHomepage");
                                }
						}
							else{
								res.render("failLogin");
							}
						}		
							
						},getPosts);
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
			


function afterRegister(req,res)
{
	var json_responses;
	var registerUser;
	if(req.param("empId") !=null)
	{
		registerUser="insert into users(username,password,firstname,lastname,usertype,empId) values('"+req.param("username")+"','"+req.param("password")+"','"+req.param("firstname")+"','"+req.param("lastname")+"',1,'"+req.param("empId")+"')";

	}
	else {
		registerUser="insert into users(username,password,firstname,lastname,usertype) values('"+req.param("username")+"','"+req.param("password")+"','"+req.param("firstname")+"','"+req.param("lastname")+"',2)";

	}
		mysql.fetchData(function(err,results){
		if(err)
		{

			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
		else
		{

			if(req.param("empId") !=null)
			{
				res.render("adminHomepage");
			}
			else {
				res.render("index");
			}



		}
	},registerUser);

}



function getModerators(req,res)
{
	var getModerator = "select * from users where userType = 1"
	console.log("Query is:"+getModerator);
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
				/*ejs.renderFile('./views/adminHomepage.ejs',{data:jsonParse},function(err, result) {
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

			}
		}

	},getModerator);
}

function getUsers(req,res)
{
	var getUsercount = "select userType,count(*) from users group by userType"
	console.log("Query is:"+getUsercount);
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
				/*ejs.renderFile('./views/adminHomepage.ejs',{data:jsonParse},function(err, result) {
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

			}
		}

	},getUsercount);
}








exports.getModerators= getModerators;
exports.afterRegister=afterRegister;
exports.getUsers = getUsers;
exports.signin=signin;
exports.afterSignIn=afterSignIn;
