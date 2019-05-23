const api = apiUrl.concat("user/login");
const alertSection = document.getElementById("alert");

const loginApiCall = () => {
	console.log("Calling api");
	console.log("API >>>>>" , api);
	
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const obj = JSON.parse(this.response);        
			console.log("Got somethine for you!!!");
			 //displayUserPhotoAndName(obj);
			 console.log(obj);
			 alert(obj);
		}else{
			alertSection.style.visibility = "block";
			alertSection.style.height = "auto";
	  }
	};
	xhttp.open("POST", api, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("email=greendublin007@gmail.com&password=Steeldubs0077!@#");
}


try{
	alertSection.style.visibility = "hidden";
	alertSection.style.height = "0px";
}catch(err){
	//console.log("Problems with alert (ID), most likely javascript cannot find this block");
}

try{				
	document.userLoginForm.onsubmit = function(){		
		let email = document.userLoginForm.email.value;
		let password = document.userLoginForm.password.value;
		
		document.userLoginForm.email.value = email;
		document.userLoginForm.password.value = password;
		
		loginApiCall();			
		
		return false; // i don't need the form to submit to any action page
	};
	
	loginApiCall();			
}catch(err) {
	console.log("userLogin.js global functions and operations error.");
}


