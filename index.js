const EXPRESS = require('express');
const APP = EXPRESS();
const JWT = require('jsonwebtoken');
const FS = require("fs");
const PATH = require('path');
const ROUTER = EXPRESS.Router();
const BODYPARSER = require('body-parser');

const CLOUD_NAME = 'cliquedom-technology';
const API_KEY = '253598436213224';
const API_SECRET = '9Vrt_ce2ms3vtO6vnHwSE00Dx-Y' ;
const CLOUDINARY_UPLOAD_DIRECTORY = 'automart_adc';

const MULTER = require('multer');
const CLOUDINARY  = require('cloudinary');
const CLOUDINARY_STORAGE = require('multer-storage-cloudinary');
const UPLOAD = MULTER({ dest: 'uploads/' })

CLOUDINARY.config({ 
  cloud_name: CLOUD_NAME, 
  api_key:  API_KEY, 
  api_secret: API_SECRET 
});

let uniqueFilename = new Date().toISOString(); // used to give each file upload a unique name
let parser = MULTER({ 
  storage: CLOUDINARY_STORAGE({
    cloudinary: CLOUDINARY,
    folder: CLOUDINARY_UPLOAD_DIRECTORY,
    filename: function (req, file, cb) {
      cb(undefined, `${uniqueFilename}${file.originalname}`);
    }
  })
});

APP.use(BODYPARSER.urlencoded({ extended: false }));
APP.use(BODYPARSER.json());
APP.use(BODYPARSER.json({limit: "50mb"}));
APP.use(BODYPARSER.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const HELPER = require('./helper');

const HTTP_CODE_OK = 200; // REQUEST FULFILLED
const HTTP_CODE_ACCEPTED = 202; // REQUEST ACCEPTED BUT NOT COMPLETED
const HTTP_CODE_NO_CONTENT = 204; // NO CONTENT
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;
const HTTP_CODE_INTERNAL_SERVER_ERROR = 500;
								
APP.use('/', ROUTER);
APP.listen(process.env.port || 3333);

//const PORT = process.env.PORT || 3000;
//APP.listen(PORT, () => {
//    console.log(`Our app is running on port ${ PORT }`);
//});
//APP.listen(process.env.port || 3333);

APP.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", "true");
	//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token");
	
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,token");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();	
});

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

process.env.NODE_ENV = 'test';

APP.post('/api/v1/auth/signin', function (req, res) {
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
			let tokenRaw = HELPER.genToken(`${email}${password}`);
			let token = JWT.sign({username: tokenRaw}, HELPER.getTokenSecret(),{expiresIn: HELPER.getTokenExpire()}); 
					
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"token" : token,
					"id" : loginUser.id,
					"first_name" : loginUser.first_name,
					"last_name" : loginUser.last_name,
					"email" : loginUser.email,
					"is_admin" : loginUser.is_admin
				}
			}				
			res.send(returnData);			
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "Email and password combination incorrect."
				}
			}
			res.send(returnData);
		}
	
	});
})

APP.post('/api/v1/auth/signup', function (req, res) {
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
					let tokenRaw = HELPER.genToken(`${email}${password}`);
					let token = JWT.sign({username: tokenRaw}, HELPER.getTokenSecret(),{expiresIn: HELPER.getTokenExpire()}); 
					
					let returnData = {
						"status" : 200,
						"data" : {
							"token" : token,
							"id" : item.id,
							"first_name" : item.first_name,
							"last_name" : item.last_name,
							"email" : item.email,
							"is_admin": false
						}
					}
					res.send(returnData);			
					break;
				}
			}
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : `Email (${email}) already in used`
				}
			}
			res.send(returnData);			
		}
		
	});
})

// RAML READY
APP.post('/api/v1/token/validate', function(req, res){
	let token = req.headers.token;

	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
		  let returnData = {
			  "status" : HTTP_CODE_OK ,
			  "data" : {
					"tokenStatus" : "valid",
					"token" : token
					}
			  };
		  res.send(returnData);
		} else {
			let returnData = {
				  "status" : HTTP_CODE_BAD_REQUEST ,
				  "data" : {
						"tokenStatus" : "invalid",
						"error" :   `${err.name}  (${err.message})`
					}
				};
			  res.send(returnData);
		}
	})
})

// RAML READY
APP.get('/api/v1/token/validate', function(req, res){
  let token = req.query.token; 
    
  JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
    if(!err){
      let returnData = {
		  "status" : HTTP_CODE_OK ,
		  "data" : {
				"tokenStatus" : "valid",
				"token" : token
				}
		  };
      res.send(returnData);
    } else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);
    }
  })
})

// RAML READY
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
				hashToken = `${item.first_name}${secretTokenKey}${item.last_name}`; 
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
					"password_reset_page" : `passwordreset.html?passwordResetToken=${hashToken}&id=${user.id}&resetToken=${secretTokenKey}`
				}
			}				
			res.send(returnData);			
		}else{
			let returnData = {
				"status" : HTTP_CODE_NO_CONTENT,
				"data" : {
					"error" : `No user has registered with that email : ${email}`
				}
			}
			res.send(returnData);			
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
				passwordResetTokenCheck = `${item.first_name}${secretTokenKeyCheck}${item.last_name}`;
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
			res.send(returnData);						
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "Unable to reset password, User id doesn't exist"
				}
			}
			res.send(returnData);			
		}
	
	});	
})

APP.post('/api/v1/user/info', function (req, res) {   
	let id = req.body.id;
	let token = req.headers.token;
	let idDB = id - 1; // zero based used to fetch records from the user.json file
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			FS.readFile("./db/users.json", 'utf8', function (err, data) {
				let users = JSON.parse( data );
				let user = users[idDB]; 
				
				if(user != null){				
					let returnData = {
						"status" : HTTP_CODE_OK ,
						"data" : {
							  "id" : user.id,
							  "email" : user.email,
							  "first_name" : user.first_name,
							  "last_name": user.last_name,
							  "address":  user.address,
							  "is_admin": user.is_admin,
							  "tokenStatus" : "valid"
							}
					};
				  res.send(returnData);				
				}else{
					let returnData = {
						"status" : HTTP_CODE_NO_CONTENT ,
						"data" : {
							"tokenStatus" : "valid",
							"error" : `no result(s) found for user with id : ${id}`,
						}
					};
				  res.send(returnData);									
				}
		   });		 	
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

// RAML READY
APP.get('/api/v1/user/info/notoken', function (req, res) {   
	let id = req.query.id; 
	let idDB = id - 1; // zero based used to fetch records from the user.json file
	
	FS.readFile("./db/users.json", 'utf8', function (err, data) {
		let users = JSON.parse( data );
		let user = users[idDB]; 
		
		if(user != null){				
			let returnData = {
				"status" : HTTP_CODE_OK ,
				"data" : {
					  "id" : user.id,
					  "first_name" : user.first_name,
					}
			};
		  res.send(returnData);				
		}else{
			let returnData = {
				"status" : HTTP_CODE_NO_CONTENT ,
				"data" : {
					"message" : `no result(s) found for user with id : ${id}`,
				}
			};
		  res.send(returnData);									
		}
   });		 	

})

APP.post('/api/v1/user/info/edit', function (req, res) {
	let id = req.body.id;
	let email = req.body.email;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	let address = req.body.address; 
	
	let token = req.headers.token;
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			let carEditStatus = false;
								
			FS.readFile('./db/users.json', 'utf8', function (err,data) {
				data = JSON.parse(data); 
				let userExists = false;
				
				//loop throught cars data
				for(let item of data) {			
					//car id exists
					if(item.id == id){
						userExists = true;

						// the - 1 is because array are 0 based
						data[item.id - 1].id = item.id;
						data[item.id - 1].password = item.password;
						data[item.id - 1].email = email;
						data[item.id - 1].first_name = first_name;
						data[item.id - 1].last_name = last_name;
						data[item.id - 1].address = address;
						data[item.id - 1].is_admin = item.is_admin;
					}
				}
						
				if(userExists){
					FS.writeFile("./db/users.json",JSON.stringify(data), function (err,data){
					  if(err){throw err;} 
					});
					
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
						  "email" : email,
						  "first_name" : first_name,
						  "last_name": last_name,
						  "address":  address
						}
					};
					res.send(returnData);
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `Unable to edit user, user with id :  ${id} does not exist`
						}
					}
					res.send(returnData);
				}
			
			});	
		
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);
		}
	  })
})

APP.post('/api/v1/user/car/create', parser.array('image'), (req, res, next) => {
    
	let token = req.headers.token;
	let owner = req.body.owner;
	let email = req.body.email;
	let created_on = req.body.created_on;
	let manufacturer = req.body.manufacturer;
	let model = req.body.model;
	let price = req.body.price;
	let state = req.body.state;
	let status = req.body.status;
	let body_type = req.body.body_type;
	let description = req.body.description;
	let picture1 = req.body.picture1;

	let file1 = "";
	let file2 = "";
	let file3 = "";
	let file4 = "";
	let file5 = "";
	
	//console.log("FULL REQ.FILES >>>>>>>>> " , req.files);
	//console.log("files length >>>>>>> " , req.files.length);
	let counter = 1;
	for(let item of req.files) {			
		console.log("FULL ITEM OBJ >>>>>>>>> " , item);
		console.log("READY URL >>>>>>>>>>" , item.url);
		
		if(counter <= req.files.length){
			switch(counter){
				case 1:
					file1 = item.url;
				break;
				case 2:
					file2 = item.url;
				break;
				case 3:
					file3 = item.url;
				break;
				case 4:
					file4 = item.url;
				break;
				case 5:
					file5 = item.url;
				break;
				default:
				break;
			}
		}
		counter++;
	}	
	console.log("file1 >>>>", file1);
	console.log("file2 >>>>", file2);
	console.log("file3 >>>>", file3);
	console.log("file4 >>>>", file4);
	console.log("file5 >>>>", file5);
	
  // req.files will show you the uploaded files
  // and req.body will show you the rest of your form data	
	if(req.body.token != "undefined"){
		token = req.body.token;
	}
				
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){				
			
			let carCreateStatus = false;
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 1;
				console.log("file counter >>>>>" , Object.keys(data).length);
				if(Object.keys(data).length > 1){
					count = Object.keys(data).length + 1; 						
				}
				console.log("count from post car >>>>>", count);
				let newCarAd; 
				let adExists = false;
				
				for(let item of data) {
					if(item.email === email){
						adExists = true;
						break;
					}
				}
				
				if(adExists == false){
					newCarAd = {
						"id" : count,
						"owner" : owner.toLowerCase(),
						 "created_on" : created_on.toLowerCase(),
						 "state": state.toUpperCase(),
						 "status": status.toUpperCase(),
						 "price": price.toLowerCase(),
						  "manufacturer": manufacturer.toLowerCase(),
						  "model": model.toLowerCase(),
						  "body_type": body_type.toLowerCase(),
						  "description": description.toLowerCase(),
						  "picture1": file1,
						  "picture2": file2,
						  "picture3": file3,
						  "picture4": file4,
						  "picture5": file5,
					};
					data.push(newCarAd);
					FS.writeFile("./db/cars.json",JSON.stringify(data), function (err,data){
					  if(err){
						  throw err;
					  } 
					});
					
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"owner" : owner,
							"id" : count,
							"manufacturer" : manufacturer,
							"model" : model,
							"message" : "Car advert has been posted",
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : "Unable to post car advert"
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);		
		}
	  })
  	
})		
		
APP.post('/api/v1/user/car/info', function (req, res) {   
	let id = req.body.id;
	let token = req.headers.token;
	let idDB = id - 1; // zero based used to fetch records from the cars.json file
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				let cars = JSON.parse( data );
				let car = cars[idDB]; 
				
				if(car != null){
					let returnData = {
						"status" : HTTP_CODE_OK ,
						"data" : {
							"id" : car.id,
							"owner" : car.owner,
							"created_on" : car.created_on,
							"state" : car.state,
							"status" : car.status,
							"price" : car.price,
							"manufacturer" : car.manufacturer,
							"model" : car.model,
							"body_type" : car.body_type,
							"description" : car.description,
							"picture1" : car.picture1,
							"picture2" : car.picture1,
							"picture3" : car.picture3,
							"picture4" : car.picture4,
							"picture5" : car.picture5,
							"tokenStatus" : "valid"
							}
					};
				  res.send(returnData);	
				}else{
					let returnData = {
						"status" : HTTP_CODE_NO_CONTENT ,
						"data" : {
							"tokenStatus" : "valid",
							"error" : `no result(s) found for car with id : ${id}`
						}
					};
				  res.send(returnData);						
				}
		   });		 	
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);
		}
	  })
	
})

// RAML READY
APP.get('/api/v1/user/car/info/notoken', function (req, res) {   
	let id = req.query.id; 
	let idDB = id - 1; // zero based used to fetch records from the cars.json file

	FS.readFile("./db/cars.json", 'utf8', function (err, data) {
		let cars = JSON.parse( data );
		let car = cars[idDB]; 
		
		if(car != null){
			let returnData = {
				"status" : HTTP_CODE_OK ,
				"data" : {
					"id" : car.id,
					"owner" : car.owner,
					"created_on" : car.created_on,
					"state" : car.state,
					"status" : car.status,
					"price" : car.price,
					"manufacturer" : car.manufacturer,
					"model" : car.model,
					"body_type" : car.body_type,
					"description" : car.description,
					"picture1" : car.picture1,
					"picture2" : car.picture1,
					"picture3" : car.picture3,
					"picture4" : car.picture4,
					"picture5" : car.picture5
					}
			};
		  res.send(returnData);	
		}else{
			let returnData = {
				"status" : HTTP_CODE_NO_CONTENT ,
				"data" : {
					"message" : `no result(s) found for car with id : ${id}`
				}
			};
		  res.send(returnData);						
		}
   });		 	
})

APP.post('/api/v1/user/car/edit', function (req, res) {
	let token = req.headers.token;
	let id = req.body.id;
	
	let manufacturer = req.body.manufacturer;
	let model = req.body.model;
	let price = req.body.price;
	let state = req.body.state;
	let status = req.body.status
	let body_type = req.body.body_type;
	let description = req.body.description;
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
	 	
			let carEditStatus = false;
			
			FS.readFile('./db/cars.json', 'utf8', function (err,data) {
				data = JSON.parse(data); 
				let carExists = false;
				
				//loop throught cars data
				for(let item of data) {			
					//car id exists
					if(item.id == id){
						carExists = true;
	
						// the - 1 is because array are 0 based
						data[item.id - 1].status = status;
						data[item.id - 1].manufacturer = manufacturer;
						data[item.id - 1].model = model;
						data[item.id - 1].price = price;
						data[item.id - 1].state = state;
						data[item.id - 1].body_type = body_type;
						data[item.id - 1].description = description;

					}
				}
						
				if(carExists){
					FS.writeFile("./db/cars.json",JSON.stringify(data), function (err,data){
					  if(err){throw err;} 
					});
	
					let returnData = {
						"status" : HTTP_CODE_OK ,
						"data" : {
							"id" : id,
							"state" : state,
							"price" : price,
							"manufacturer" : manufacturer,
							"model" : model,
							"body_type" : body_type,
							"description" : description,
							"tokenStatus" : "valid"
							}
					};
					res.send(returnData);
				  			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `Unable to edit car, car with id : ${id} does not exist`
						}
					}
					res.end( JSON.stringify(returnData));
				}
			
			});	
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `err.name (${err.message})`
				}
			};
		  res.send(returnData);
		}
	  })

})

APP.get('/api/v1/user/car/delete', function (req, res) {
})

APP.post('/api/v1/user/cars/all', function (req, res) {
	let token = req.headers.token;
	let id = req.body.id;
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let userCars = [] ; // need to init as an empty array to use array push 
					
				for(let item of data) {			
					if(item.owner == id && item.status == "AVAILABLE"){
						userCars.push(item);
					}
				}					
				
				count = userCars.length;
				if(count != 0){
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : userCars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `No cars record(s) for user with id :  ${id}`
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/user/cars/sold', function (req, res) {   
	let token = req.headers.token;
	let id = req.body.id;
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let userCars = [] ; // need to init as an empty array to use array push 
					
				for(let item of data) {			
					if(item.owner == id && item.status == "SOLD"){
						userCars.push(item);
					}
				}	
					
				if(Object.keys(data).length > 1){
					count = Object.keys(userCars).length; 	
				}
				
				if(count > 1){
					count = userCars.length;
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : userCars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `No cars record(s) for user with id :  ${id}`
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/user/purchase/orders', function (req, res) {   
	let token = req.headers.token;
	let id = req.body.id;
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let userCars = [] ; // need to init as an empty array to use array push 
					
				for(let item of data) {			
					if(item.owner == id && item.status == "SOLD"){
						userCars.push(item);
					}
				}	
					
				if(Object.keys(data).length > 1){
					count = Object.keys(userCars).length; 	
				}
				
				if(count > 1){
					count = userCars.length;
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : userCars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `No cars record(s) for user with id :  ${id}`
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/user/order/info', function (req, res) {   
	let id = req.body.id;
	let token = req.headers.token;
	let idDB = id - 1; // zero based used to fetch records from the cars.json file
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			FS.readFile("./db/orders.json", 'utf8', function (err, data) {
				let orders = JSON.parse( data );
				let order = orders[idDB]; 
				
				if(order != null){
					let returnData = {
						"status" : HTTP_CODE_OK ,
						"data" : {
							"id" : order.id,
							"buyer" : order.buyer,
							"car_id" : order.car_id,
							"amount": order.amount,
							"status":order.status,
							"tokenStatus" : "valid"
						}
					};
				  res.send(returnData);	
				}else{
					let returnData = {
						"status" : HTTP_CODE_NO_CONTENT ,
						"data" : {
							"tokenStatus" : "valid",
							"message" : `no result(s) found for order with id : ${id}`
						}
					};
				  res.send(returnData);						
				}
		   });		 	
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
					}
			};
		  res.send(returnData);
		}
	  })
	
})

APP.post('/api/v1/cars/all', function (req, res) {
	let token = req.headers.token;	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let cars = [] ; // need to init as an empty array to use array push 
				
				if(Object.keys(data).length > 1){
					count = Object.keys(data).length; 	
				}
				
				if(count > 1){
					for(let item of data) {			
						if(item.status == "AVAILABLE"){
							cars.push(item);
						}
					}	
					count = cars.length;
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : cars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : "No cars record(s) "
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/cars/all/notoken', function (req, res) {	
					
	FS.readFile("./db/cars.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		let count = 0;
		let cars = [] ; // need to init as an empty array to use array push 

		if(Object.keys(data).length > 1){
			count = Object.keys(data).length; 	
		}
							
		for(let item of data) {			
			if(item.status == "AVAILABLE"){
				cars.push(item);
			}
		}	
		
		if(count > 1){
			count = cars.length;
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"count" : count,
					"object" : cars
				}
			}
			res.send(returnData);			
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "No cars record(s) "
				}
			}
			res.send(returnData);			
		}
		
	});
			
})

APP.post('/api/v1/cars/all/manufacturer/notoken', function (req, res) {	
					
	FS.readFile("./db/cars.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		let count = 0;
		let carsManufacturer = [] ; // need to init as an empty array to use array push 

		if(Object.keys(data).length > 1){
			count = Object.keys(data).length; 	
		}
							
		for(let item of data) {			
			if(item.status == "AVAILABLE"){
				carsManufacturer.push(item.manufacturer);
			}
		}	
		
		if(count > 1){
			count = carsManufacturer.length;
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"count" : count,
					"object" : carsManufacturer
				}
			}
			res.send(returnData);			
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "No cars model(s) "
				}
			}
			res.send(returnData);			
		}
		
	});
			
})

APP.post('/api/v1/cars/all/model/notoken', function (req, res) {	
					
	FS.readFile("./db/cars.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		let count = 0;
		let carsModel = [] ; // need to init as an empty array to use array push 

		if(Object.keys(data).length > 1){
			count = Object.keys(data).length; 	
		}
							
		for(let item of data) {			
			if(item.status == "AVAILABLE"){
				carsModel.push(item.model);
			}
		}	
		
		if(count > 1){
			count = carsModel.length;
			let returnData = {
				"status" : HTTP_CODE_OK,
				"data" : {
					"count" : count,
					"object" : carsModel
				}
			}
			res.send(returnData);			
		}else{
			let returnData = {
				"status" : HTTP_CODE_BAD_REQUEST,
				"data" : {
					"error" : "No cars record(s) "
				}
			}
			res.send(returnData);			
		}
		
	});
			
})

APP.post('/api/v1/user/purchase/create', function (req, res) {	
	let token = req.headers.token;
	let buyer = req.body.buyer;
	let car_id = req.body.car_id;
	let price = req.body.price;
	let description = req.body.description;
	let price_offered = req.body.price_offered;
	let created_on = req.body.created_on;
	
	let newOrder;
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			FS.readFile("./db/orders.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				
				let count = 1;
				if(Object.keys(data).length > 1){
					count = Object.keys(data).length;	
				}
				
				newOrder = {
					  "id" : count + 1,
					  "buyer" : buyer,
					  "car_id" : car_id,
					  "price": price,
					  "description": description,
					  "price_offered":  price_offered,
					  "created_on":  created_on
				};
			  
				data.push(newOrder);
				FS.writeFile("./db/orders.json",JSON.stringify(data), function (err,data){
				  if(err){
					  //throw err;
					  console.log("There was an error with [user/purchase/create]", err);
				  } 
				});
			
				let returnData = {
					"status" : HTTP_CODE_OK,
					"data" : {
						"object" : newOrder
					}
				}
				res.send(returnData);		
			})
			
		}else{
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);
		}
	})			
})

APP.post('/api/v1/user/purchase/info', function (req, res) {   
	let id = req.body.id;
	let token = req.headers.token;
	let idDB = id - 1; // zero based used to fetch records from the cars.json file
	
	if(token == "undefined" || token == null){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);		
	}else{
		JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
			if(!err){
				FS.readFile("./db/orders.json", 'utf8', function (err, data) {
					let orders = JSON.parse( data );
					let order = orders[idDB]; 
					
					if(order != null){
						let returnData = {
							"status" : HTTP_CODE_OK ,
							"data" : {
								"obj" : order,
								"tokenStatus" : "valid"
								}
						};
					  res.send(returnData);	
					}else{
						let returnData = {
							"status" : HTTP_CODE_NO_CONTENT ,
							"data" : {
								"tokenStatus" : "valid",
								"message" : `no result(s) found for order with id : ${id}`
							}
						};
					  res.send(returnData);						
					}
			   });		 	
			} else {
				let returnData = {
				  "status" : HTTP_CODE_BAD_REQUEST ,
				  "data" : {
						"tokenStatus" : "invalid",
						"error" :   `${err.name} (${err.message})`
					}
				};
			  res.send(returnData);
			}
	  })	
	}
		
})

APP.post('/api/v1/user/purchase/edit', function (req, res) {
	let token = req.headers.token;
	let id = req.body.id;
	
	let price = req.body.price;
	let price_offered = req.body.price_offered;
	let description = req.body.description;
	let created_on = req.body.created_on;

	if(token == "undefined" || token == null){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);		
	}else{
		JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
			if(!err){
			
				let orderEditStatus = false;
				
				FS.readFile('./db/orders.json', 'utf8', function (err,data) {
					data = JSON.parse(data); 
					let orderExists = false;
					let order;
					
					for(let item of data) {			
						if(item.id == id){
							orderExists = true;
							order = item;
		
							// the - 1 is because array are 0 based
							data[item.id - 1].price = price;
							data[item.id - 1].price_offered = price_offered;
							data[item.id - 1].description = description;
							data[item.id - 1].created_on = created_on;
						}
					}
							
					if(orderExists){
						FS.writeFile("./db/orders.json",JSON.stringify(data), function (err,data){
						  if(err){
							  //throw err;
						  } 
						});
		
						let returnData = {
							"status" : HTTP_CODE_OK ,
							"data" : {
								"obj" : order,
								"tokenStatus" : "valid"
								}
						};
						res.send(returnData);
								
					}else{
						let returnData = {
							"status" : HTTP_CODE_BAD_REQUEST,
							"data" : {
								"error" : `Unable to edit order, car with id : ${id} does not exist`
							}
						}
						res.end( JSON.stringify(returnData));
					}
				
				});	
			} else {
				let returnData = {
				  "status" : HTTP_CODE_BAD_REQUEST ,
				  "data" : {
						"tokenStatus" : "invalid",
						"error" :   `err.name (${err.message})`
					}
				};
			  res.send(returnData);
			}
		  
	  })	
	}
})

APP.post('/api/v1/user/purchase/sent', function (req, res) {   
	let token = req.headers.token;
	let id = req.body.id;
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/orders.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let userCars = [] ; // need to init as an empty array to use array push 
					
				for(let item of data) {			
					if(item.owner == id && item.status == "SOLD"){
						userCars.push(item);
					}
				}	
					
				if(Object.keys(data).length > 1){
					count = Object.keys(userCars).length; 	
				}
				
				if(count > 1){
					count = userCars.length;
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : userCars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `No cars record(s) for user with id :  ${id}`
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/user/purchase/received', function (req, res) {   
	let token = req.headers.token;
	let id = req.body.id;
	
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
						
			FS.readFile("./db/cars.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				let count = 0;
				let userCars = [] ; // need to init as an empty array to use array push 
					
				for(let item of data) {			
					if(item.owner == id && item.status == "SOLD"){
						userCars.push(item);
					}
				}	
					
				if(Object.keys(data).length > 1){
					count = Object.keys(userCars).length; 	
				}
				
				if(count > 1){
					count = userCars.length;
					let returnData = {
						"status" : HTTP_CODE_OK,
						"data" : {
							"count" : count,
							"object" : userCars
						}
					}
					res.send(returnData);			
				}else{
					let returnData = {
						"status" : HTTP_CODE_BAD_REQUEST,
						"data" : {
							"error" : `No cars record(s) for user with id :  ${id}`
						}
					}
					res.send(returnData);			
				}
				
			});
			
		} else {
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);			
		}
	  })
})

APP.post('/api/v1/user/flag/create', function (req, res) {	
	let token = req.headers.token;

	let car_id = req.body.car_id;
	let created_on = req.body.created_on;
	let reason = req.body.reason;
	let description = req.body.description;
	
	let newFlag;
	if(token == null || token == "undefined"){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);			
	}
	
	JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
		if(!err){
			FS.readFile("./db/flags.json", 'utf8', function (err, data) {
				data = JSON.parse(data);
				
				let count = 1;
				if(Object.keys(data).length > 1){
					count = Object.keys(data).length;	
				}
								
				newFlag = {
					  "id" : count + 1,
					  "car_id" : car_id,
					  "created_on" : created_on,
					  "reason": reason,
					  "description": description
				};
								
				data.push(newFlag);
				FS.writeFile("./db/flags.json",JSON.stringify(data), function (err,data){
				  if(err){
					  //throw err;
					  console.log("There was an error with [user/flag/create]", err);
				  } 
				});
			
				let returnData = {
					"status" : HTTP_CODE_OK,
					"data" : {
						"object" : newFlag
					}
				}
				res.send(returnData);		
			})
			
		}else{
			let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" :   `${err.name} (${err.message})`
				}
			};
		  res.send(returnData);
		}
	})			
})

APP.post('/api/v1/user/flag/info', function (req, res) {   
	let id = req.body.id;
	let token = req.headers.token;
	let idDB = id - 1; // zero based used to fetch records from the cars.json file
	
	if(token == "undefined" || token == null){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);		
	}else{
		JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
			if(!err){
				FS.readFile("./db/flags.json", 'utf8', function (err, data) {
					let orders = JSON.parse( data );
					let order = orders[idDB]; 
					
					if(order != null){
						let returnData = {
							"status" : HTTP_CODE_OK ,
							"data" : {
								"obj" : order,
								"tokenStatus" : "valid"
								}
						};
					  res.send(returnData);	
					}else{
						let returnData = {
							"status" : HTTP_CODE_NO_CONTENT ,
							"data" : {
								"tokenStatus" : "valid",
								"message" : `no result(s) found for order with id : ${id}`
							}
						};
					  res.send(returnData);						
					}
			   });		 	
			} else {
				let returnData = {
				  "status" : HTTP_CODE_BAD_REQUEST ,
				  "data" : {
						"tokenStatus" : "invalid",
						"error" :   `${err.name} (${err.message})`
					}
				};
			  res.send(returnData);
			}
	  })	
	}
		
})

APP.post('/api/v1/user/flag/edit', function (req, res) {
	let token = req.headers.token;
	let id = req.body.id;
	
	let reason = req.body.reason;
	let description = req.body.description;

	if(token == "undefined" || token == null){
		let returnData = {
			  "status" : HTTP_CODE_BAD_REQUEST ,
			  "data" : {
					"tokenStatus" : "invalid",
					"error" : "No token provided"
					}
			};
		  res.send(returnData);		
	}else{
		JWT.verify(token, HELPER.getTokenSecret(), function(err, decoded){
			if(!err){
			
				let orderEditStatus = false;
				
				FS.readFile('./db/flags.json', 'utf8', function (err,data) {
					data = JSON.parse(data); 
					let flagExists = false;
					let flag;
					
					for(let item of data) {			
						if(item.id == id){
							flagExists = true;
							flag = item;
		
							// the - 1 is because array are 0 based
							data[item.id - 1].reason = reason;
							data[item.id - 1].description = description;
						}
					}
							
					if(orderExists){
						FS.writeFile("./db/flags.json",JSON.stringify(data), function (err,data){
						  if(err){
							  //throw err;
						  } 
						});
		
						let returnData = {
							"status" : HTTP_CODE_OK ,
							"data" : {
								"obj" : flag,
								"tokenStatus" : "valid"
								}
						};
						res.send(returnData);
								
					}else{
						let returnData = {
							"status" : HTTP_CODE_BAD_REQUEST,
							"data" : {
								"error" : `Unable to edit flag, flag with id : ${id} does not exist`
							}
						}
						res.end( JSON.stringify(returnData));
					}
				
				});	
			} else {
				let returnData = {
				  "status" : HTTP_CODE_BAD_REQUEST ,
				  "data" : {
						"tokenStatus" : "invalid",
						"error" :   `err.name (${err.message})`
					}
				};
			  res.send(returnData);
			}
		  
	  })	
	}
})

APP.get('/', function (req, res) {     
	res.send("Welcome to My API for Andela Bootcamp Cycle 45.");
})

APP.get('api/v1/test', function (req, res) {     
	res.send("Just a test");
})

APP.post('/upload', (req, res, next) => {
  const upload = MULTER({ STORAGE }).single('name-of-input-key')
  upload(req, res, function(err) {
    if (err) {
      return res.send(err)
    }
    console.log('file uploaded to server')
    console.log(req.file);

    // SEND FILE TO CLOUDINARY
    const cloudinary = require('cloudinary').v2
    cloudinary.config({
		cloud_name: 'cliquedom-technology', 
		api_key: '253598436213224', 
		api_secret: '9Vrt_ce2ms3vtO6vnHwSE00Dx-Y' 
    })
    
    const path = req.file.originalname
    const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(
      path,
      { public_id: `automart_adc/${uniqueFilename}`, tags: 'automart_adc' }, // directory and tags are optional but remember not to change it 
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')
        // remove file from server
        const fs = require('fs')
        fs.unlinkSync(path)
        // return image details
        res.json(image)
      }
    )
  })
})
		
console.log('Running at Port 3333');

module.exports = server;
