// USED FOR COMMON OR SHARED JS RESOURCE

//const apiUrl = "http://18.202.215.147:3000/api/v1/";
const apiUrl = "http://localhost:4333/api/v1/";
const apiLogin = apiUrl.concat("user/login");
const apiSignup = apiUrl.concat("user/signup");
const apiValidateToken = apiUrl.concat("token/validate");
const apiConfirmLogin = apiUrl.concat("confirmLogin/");//get parameter token needed
const apiPasswordRecovery = apiUrl.concat("user/password/recovery");
const apiPasswordReset = apiUrl.concat("user/password/reset");

const loginUserConfirm = () => {
	let token = sessionStorage.getItem("token");
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
				// well don't think i need to do any thing with this status
			}			
		}
	};
	xhttp.open("GET", apiConfirmLogin + token, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

const logoutUser = () => {
	let token = sessionStorage.getItem("token");
	sessionStorage.clear();
	localStorage.clear();
	window.location = "login.html"; // login success, so redirect to dashboard page.
}

const redirectToDashboardAlreadyLogin = () => {
	if(sessionStorage.getItem("token") != ""){
		setTimeout( loginUserConfirm ,2000 );// 2 seconds or 2000 milli seconds , after which redirect to dashboard page
	}
}

const closeAlertButtonHandler = () => {
	alertSection.style.display = "none";
	alertSection.style.height = "0px";	
}

const storeToken = (token) => {
	if(typeof(Storage) !== "undefined"){
			//local storage 
			sessionStorage.token = token;
			//sessionStorage.getItem("token");
	}else{
		alert("Am so sorry but your browser doesn't support local storage ");
	}
}
