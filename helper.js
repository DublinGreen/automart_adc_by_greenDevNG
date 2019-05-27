const BCRYPT = require('bcrypt');
const SALT_ROUNDS = 10;
const TOKENSECRET = "supersecret"// YOU CANNOT CHANGE IT 
const TOKEN_EXPIRE = 86400; // 86400 = 24 hours
const PASSWORDRESETSECRET = 1123 * 57 + 3 / 2 * 122;

// helper.js
// ========
module.exports = {	
	newHashPassword : function (password){
		let salt = BCRYPT.genSaltSync(SALT_ROUNDS);
		let hash = BCRYPT.hashSync(password,salt);
		return hash;
	},
	
	hashPassword: function (password) {
		let hash = BCRYPT.hashSync(password, 0);
		return hash;
	},
	  
	comparePassword: function (password,hash) {
		if(BCRYPT.compareSync(password, hash)) {
			// Passwords match
			return true;
		} else {
			// Passwords don't match
			return false;
		}
	},
	
	genToken: function (string) {
		string = string + "ADC_CYCLE_45_greenDevNG" + new Date();
		let token = BCRYPT.hashSync(string, 10);
		return token;
	},
	
	getTokenSecret : function (){
		return TOKENSECRET;
	},
	
	getTokenExpire : function (){
		return TOKEN_EXPIRE;
	},
	
	getPasswordResetSecret : function (){
		return PASSWORDRESETSECRET;
	}
};
