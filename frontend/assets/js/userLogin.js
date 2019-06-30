let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

const loginApiCall = (email, password) => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loading.style.display = "none";
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			
			if(statusObj == 200){
				// close alert box
				alertSection.style.display = "none";
				alertSection.style.height = "0px";	
				
				storeToken(dataObj.token);
				storeUserData(dataObj.id,dataObj.email,dataObj.first_name,dataObj.last_name,dataObj.address,dataObj.is_admin);
				window.location = "purchase-orders.html"; // login success, so redirect to dashboard page.
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiLogin, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let parameters = `email=${email}&password=${password}`;
	xhttp.send(parameters);
}

try{						
	alertSection.style.display = "none";
	alertSection.style.height = "0px";

	//check if already logged in
	redirectToDashboardAlreadyLogin();	
	
	
	document.userLoginForm.addEventListener('submit', async e => {
		e.preventDefault();
		
		let email = document.userLoginForm.email.value;
		let password = document.userLoginForm.password.value;
		
		document.userLoginForm.email.value = email;
		document.userLoginForm.password.value = password;
		
		loading.style.display = "block";
		loginApiCall(email,password);			
	});
			
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("userLogin.js operations error : " , err);
}

