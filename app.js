var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var session = require('client-sessions');
var home = require('./routes/home');
var posts = require('./routes/posts');

var app = express();

app.use(session({

	cookieName : 'session',
	secret : 'cmpe273_test_string',
	duration : 30 * 60 * 1000, // setting the time for active session
	activeDuration : 5 * 60 * 1000,
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());
app.use(express.cookieParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.signin);
app.post('/afterRegister', home.afterRegister);
app.get('/signin', home.signin);
app.post('/afterSignIn', home.afterSignIn);
app.post('/addPost', posts.addPost);
app.post('/addComment', posts.addComment);
app.get('/getPosts',posts.getPosts);
app.get('/getModerator',home.getModerators);
app.get('/getUsers', home.getUsers);
app.get('/logout',home.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
