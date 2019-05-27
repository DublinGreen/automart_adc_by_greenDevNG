const EXPRESS = require('express');
const APP = EXPRESS();
const JWT = require('jsonwebtoken');
const FS = require("fs");
//let SESSION = require('express-session');
const PATH = require('path');
const ROUTER = EXPRESS.Router();

const BODYPARSER = require('body-parser');

APP.use(BODYPARSER.urlencoded({ extended: false }));
APP.use(BODYPARSER.json());

const HELPER = require('./helper');

FS.readFileSync('helper.js');

const HTTP_CODE_OK = 200; // REQUEST FULFILLED
const HTTP_CODE_ACCEPTED = 202; // REQUEST ACCEPTED BUT NOT COMPLETED
const HTTP_CODE_NO_CONTENT = 204; // NO CONTENT
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;
const HTTP_CODE_INTERNAL_SERVER_ERROR = 500;
								
//add the ROUTER
//APP.use(EXPRESS.static(__dirname + '/views'));
//Store all HTML files in view folder.
//APP.use(EXPRESS.static(__dirname + '/public'));
//Store all JS and CSS in Scripts folder.

APP.use('/', ROUTER);
APP.listen(process.env.port || 4333);

APP.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept","Autorization");
  next();
});

APP.post('/api/v1/user/login', function (req, res) {
let email = req.body.email;
	let password = req.body.password;
	
	FS.readFile('./db/users.json', 'utf8', function (err,data) {
		data = JSON.parse(data); 
		
		let loginUser;		  		
		let userExists = false;
		//loop throught users data
		for(let item of data) {
			//user email exists, check if password match
			if(item.email == email){
				let compare = HELPER.comparePassword(password,item.password); // password match boolean
				
				if(compare){	
					loginUser = item;
					userExists = true;
				}
			}
		}
		
		// if true user exists with that email and password combination
		if(userExists){
			let tokenRaw = HELPER.genToken(email + password);
			let token = JWT.sign({username: tokenRaw}, HELPER.getTokenSecret(),{expiresIn: HELPER.getTokenExpire()}); 
					
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"token" : token,
					"id" : loginUser.id,
					"first_name" : loginUser.first_name,
					"last_name" : loginUser.last_name,
					"email" : loginUser.email
				}
			}				
			res.end(JSON.stringify(returnData));				
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "Email and password combination incorrect."
				}
			}
			res.end( JSON.stringify(returnData));
		}
	
	});
})

APP.post('/api/v1/user/password/recovery', function (req, res) {
	let email = req.body.email;
	let hashToken;
	let secretTokenKey;
	
	FS.readFile('./db/users.json', 'utf8', function (err,data) {
		data = JSON.parse(data); 
		
		let user;		  		
		let userExists = false;
		//loop throught users data
		for(let item of data) {
			//user email exists,
			if(item.email == email){
				user = item;
				secretTokenKey = parseInt(item.id) * HELPER.getPasswordResetSecret(); 
				hashToken = item.first_name + secretTokenKey  + item.last_name ; // 
				userExists = true;
			}
			
			if (userExists) break;
		}
		
		// if true user exists with that email and password combination
		if(userExists){
			
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"email" : user.email,
					"reset_token" : secretTokenKey,
					"password_reset_token" : hashToken,
					"password_reset_page" : "passwordreset.html?passwordResetToken=" + hashToken + "&id=" + user.id + "&resetToken=" + secretTokenKey
				}
			}				
			res.end(JSON.stringify(returnData));				
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "No user has registered with that email : " + email
				}
			}
			res.end( JSON.stringify(returnData));
		}
	
	});
})

APP.post('/api/v1/user/password/reset', function (req, res) {
	let password = req.body.password;
	let id = req.body.id;	
	let resetToken = req.body.resetToken;	
	let passwordResetToken = req.body.passwordResetToken;	
	let secretTokenKeyCheck;
	let passwordResetTokenCheck;
				
	FS.readFile('./db/users.json', 'utf8', function (err,data) {
		data = JSON.parse(data); 
		let userExists = false;
		let compare =  false;
		
		//loop throught users data
		for(let item of data) {			
			//user email exists, check if password match
			if(item.id == id){
				secretTokenKeyCheck = parseInt(item.id) * HELPER.getPasswordResetSecret(); 
				passwordResetTokenCheck = item.first_name + secretTokenKeyCheck + item.last_name;
				userExists = true;
				// setting the new password
				data[item.id - 1].password = HELPER.newHashPassword(password); // the - 1 is because array are 0 based
			}
		}
				
		if(userExists && resetToken == secretTokenKeyCheck && passwordResetTokenCheck == passwordResetToken){
			FS.writeFile("./db/users.json",JSON.stringify(data), function (err,data){
			  if(err){throw err;} 
			});
			
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"id" : id,
					"message" : "Password reset success"
				}
			}				
			res.end(JSON.stringify(returnData));				
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "Unable to reset password, User id doesn't exist"
				}
			}
			res.end( JSON.stringify(returnData));
		}
	
	});	
})

APP.post('/api/v1/user/signup', function (req, res) {
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	let password = req.body.password;
	let address = req.body.address;
	let hashPassword = HELPER.newHashPassword(password);
 
	FS.readFile("./db/users.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		let count = 1;
		if(Object.keys(data).length > 1){
			count = Object.keys(data).length;	
		}
		
		let newUser; 
		let userExists = false;
		
		for(let item of data) {
			if(item.email === email){
				userExists = true;
				break;
			}
		}
		
		if(userExists == false){
			newUser = {
				  "id" : count + 1,
				  "email" : email,
				  "first_name" : first_name,
				  "last_name": last_name,
				  "password":  hashPassword,
				  "address":  address,
				  "is_admin": false
			};
		  
			data.push(newUser);
			FS.writeFile("./db/users.json",JSON.stringify(data), function (err,data){
			  if(err){
				  throw err;
			  } 
			});
			
			
			for(let item of data) {
				if(item.email === email){
					let tokenRaw = HELPER.genToken(email + password);
					let token = JWT.sign({username: tokenRaw}, HELPER.getTokenSecret(),{expiresIn: HELPER.getTokenExpire()}); 
					
					let returnUser = {
						"status" : 200,
						"data" : {
							"token" : token,
							"id" : item.id,
							"first_name" : item.first_name,
							"last_name" : item.last_name,
							"email" : item.email
						}
					}
					res.end( JSON.stringify(returnUser));
					break;
				}
			}
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "Email (" + email  + ") already in used"
				}
			}
			res.end( JSON.stringify(returnData));
		}
		
	});
})

APP.post('api/v1/token/:email', function(req, res){
	let email = req.body.email;
	
	   FS.readFile('./db/users.json', 'utf8', function (err,data) {
		data = JSON.parse(data); 
		
		for(let item of data) {
			if(item.email == email){
				
				let token = JWT.sign({username: email}, HELPER.getTokenSecret(),{expiresIn: HELPER.getTokenExpire()}); 
				res.send(token);
				
				let returnData = {
					"status" : 200,
					"data" : {
						"token" : token,
						"expires" : 86400
					}
				}
				res.end( JSON.stringify(returnData));
			}else{
				let returnData = {
					"status" : 200,
					"data" : {
						"token" : token,
						"expires" : 86400
					}
				}
				res.end( JSON.stringify(returnData));
				res.end("Email " + email + " doesn't exist ");		
				
			}
		}
	});
})

APP.post('/api/v1/token/validate', function(req, res){
  let token = req.header("authorization");
    
  JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
    if(!err){
      let returnData = {
		  "status" : HTTP_CODE_OK ,
		  "data" : {
				"tokenStatus" : "valid",
				"token" : token
				}
		  };
      res.json(returnData);
    } else {
		let returnData = {
		  "status" : HTTP_CODE_BAD_REQUEST ,
		  "data" : {
				"tokenStatus" : "invalid",
				"error" : err
				}
		};
      res.send(returnData);
    }
  })
})

APP.get('/api/v1/confirmLogin/:token', function(req, res){
  let token = req.params.token;
    
  JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
    if(!err){
      let returnData = {
		  "status" : HTTP_CODE_OK ,
		  "data" : {
				"tokenStatus" : "valid",
				"token" : token
				}
		  };
      res.json(returnData);
    } else {
		let returnData = {
		  "status" : HTTP_CODE_BAD_REQUEST ,
		  "data" : {
				"tokenStatus" : "invalid",
				"error" : err
				}
		};
      res.send(returnData);
    }
  })
})

APP.get('/', function (req, res) {     
	res.send("Welcome to My API for Andela Bootcamp Cycle 45. ");
})

APP.get('api/v1/test', function (req, res) {     
	res.send("Just a test");
})
		
console.log('Running at Port 4333');


