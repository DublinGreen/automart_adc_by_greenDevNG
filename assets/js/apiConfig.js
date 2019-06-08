// USED FOR COMMON OR SHARED JS RESOURCE

//const apiUrl = "http://18.202.215.147:3333/api/v1/";
//const apiUrl = "http://localhost:3333/api/v1/";
const apiUrl = "https://shrouded-springs-77611.herokuapp.com/api/v1/";


const apiLogin = apiUrl.concat("auth/signin");
const apiSignup = apiUrl.concat("auth/signup");

const apiValidateToken = apiUrl.concat("token/validate");
const apiConfirmLogin = apiUrl.concat("token/validateLogin/");//get parameter token needed

const apiPasswordRecovery = apiUrl.concat("user/password/recovery");
const apiPasswordReset = apiUrl.concat("user/password/reset");

const apiCarAdvertCreate = apiUrl.concat("user/car/create");
const apiCarInfo = apiUrl.concat("user/car/info");
const apiCarEdit = apiUrl.concat("user/car/edit");
const apiCarInfoNoTokenNeeded = apiUrl.concat("user/car/info/notoken");
const apiAllUserCars = apiUrl.concat("user/cars/all");// which is basically user UNSOLD cars
const apiAllUserCarsSold = apiUrl.concat("user/cars/sold"); // which is basically user SOLD cars
const apiUserInfo = apiUrl.concat("user/info");
const apiUserInfoNoTokenNeeded = apiUrl.concat("user/info/notoken");
const apiUserEdit = apiUrl.concat("user/info/edit");

const apiAllCars = apiUrl.concat("cars/all");  // which is basically all UNSOLD cars
const apiAllCarsNoTokenNeeded = apiUrl.concat("cars/all/notoken");
const apiAllCarsManufacturerNoTokenNeeded = apiUrl.concat("cars/all/manufacturer/notoken");
const apiAllCarsModelNoTokenNeeded = apiUrl.concat("cars/all/model/notoken");

const CAR_CREATE_STATUS_DEFAULT_AVAILABLE = "AVAILABLE";
const CAR_CREATE_STATUS_DEFAULT_SOLD = "SOLD";

const  currencyFormatter = new Intl.NumberFormat('en-US',{
	style: 'currency',
	currency: 'NGN',
	minimumFractionDigits: 2
})

const storeToken = (token) => {
	if(typeof(Storage) !== "undefined"){
			//local storage 
			sessionStorage.token = token;
	}else{
		alert("Am so sorry but your browser doesn't support local storage ");
	}
}

const storeUserData = (id,email,first_name,last_name,address,is_admin) => {
	if(typeof(Storage) !== "undefined"){
			//local storage 
			sessionStorage.id = id;
			sessionStorage.email = email;
			sessionStorage.first_name = first_name;
			sessionStorage.last_name = last_name;
			sessionStorage.address = address;
			sessionStorage.is_admin = is_admin;
	}else{
		alert("Am so sorry but your browser doesn't support local storage ");
	}
}

const loginUserConfirm = () => {
	let token = sessionStorage.getItem("token");
	if(token != null){
		//not empty
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				
				if(statusObj == 200){
					// close alert box
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					
					storeToken(dataObj.token);
					window.location = "purchase-orders.html"; // login success, so redirect to dashboard page.
				}
				
				if(statusObj == 400){
					logoutUser();
				}			
			}
		};
				
		xhttp.open("GET", `${apiConfirmLogin}${token}`, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send();
		
	}
}

const validateToken = () => {
	let token = sessionStorage.getItem("token");
	console.log("validateToken >>>>> " , token);
	if(token != null){
		//not empty
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				
				if(statusObj == 200){
					// close alert box
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					storeToken(dataObj.token);
				}
				
				if(statusObj == 400){
					sessionStorage.clear();
					localStorage.clear();
					logoutUser();
				}			
			}
		};
				
		xhttp.open("POST", apiValidateToken, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		xhttp.send();
	}else{
		logoutUser();
	}
}

const logoutUser = () => {
	sessionStorage.clear();
	localStorage.clear();
	window.location = "login.html"; // login success, so redirect to dashboard page.
}

const redirectToDashboardAlreadyLogin = () => {
	if(sessionStorage.getItem("token") != null){
		setTimeout( loginUserConfirm ,2000 );// 2 seconds or 2000 milli seconds , after which redirect to dashboard page
	}
}

const closeAlertButtonHandler = () => {
	alertSection.style.display = "none";
	alertSection.style.height = "0px";	
}

const setUserOpFirstName = () => {
	let first_name = getUserFirstName();
	if(first_name != null){
		let usernameBtn = document.getElementById('username') ;
		usernameBtn.innerHTML = first_name;
	}
}

const setVisibilityStatusForAdmin = () => {
	//admin	
	let is_admin = getUserAdminStatus(); // check if this is a boolean but we expecting a boolean
	let admin = document.getElementById('admin') ;
	let adminLinks = document.getElementById('adminLinks') ;
	
	//console.log("is_admin type >>>>>", typeof is_admin);
	//console.log("is_admin >>>>>", is_admin);
	let type_is_admin = typeof is_admin;
	if(type_is_admin == "boolean"){
		if(is_admin){
			admin.style.visibility = "visible";
		}else{
			admin.removeChild(adminLinks);// remove the links, just be be sure, a smart user cannot by pass the logic
			admin.style.visibility = "hidden";
		}
	}

} 

const getUserAdminStatus = () => {
	let is_admin = sessionStorage.getItem("is_admin");
	
	// we want this as a boolean not a string, we using triple operator to check for type and value
	if(is_admin === "false"){
		is_admin = false;
	}else{
		is_admin = true;
	}
	
	return is_admin;
}

const getUserToken = () => {
	let token = sessionStorage.getItem("token");
	return token;
}

const getUserEmail = () => {
	let token = sessionStorage.getItem("token");
	let email = sessionStorage.getItem("email");
	if(token != null && email != null){
		return email;
	}
}

const getUserFirstName = () => {
	let token = sessionStorage.getItem("token");
	let first_name = sessionStorage.getItem("first_name");
	if(token != null && first_name != null){
		return first_name;
	}
} 

const getUserLastName = () => {
	let token = sessionStorage.getItem("token");
	let last_name = sessionStorage.getItem("last_name");
	if(token != null && last_name != null){
		return last_name;
	}
} 

const getUserAddress = () => {
	let token = sessionStorage.getItem("token");
	let address = sessionStorage.getItem("address");
	if(token != null && address != null){
		return address;
	}
} 

const getUserID = () => {
	let token = sessionStorage.getItem("token");
	let id = sessionStorage.getItem("id");
	if(token != null && id != null){
		return id;
	}
}  

const getCurrentDateForJson = () => {
	let dateObj = new Date();
	let month = dateObj.getUTCMonth() + 1;
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	
	return `${year}-${month}-${day}`;
}

const escapeHtml = (str) => {
  
	if ((str===null) || (str===''))
	   return false;
	else
	str = str.toString();

	var map = {
		0 : '&#8358;'
	};

	 if(str === map[0]){
		 return "₦";
	 }		
 
}
