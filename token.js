
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
