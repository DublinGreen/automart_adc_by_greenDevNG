let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

const signupApiCall = (email,first_name,last_name,password,address) => {
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
				
				console.log(dataObj);
				storeToken(dataObj.token);
				storeUserData(dataObj.id,dataObj.email,dataObj.first_name,dataObj.last_name,dataObj.address,dataObj.is_admin);
				window.location = "purchase-orders.html"; // registration success, so redirect to dashboard page.
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiSignup, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let parameters = `email=${email}&first_name=${first_name}&last_name=${last_name}&password=${password}&address=${address}`;
	xhttp.send(parameters);
}

try{						
	alertSection.style.display = "none";
	alertSection.style.height = "0px";

	//check if already logged in
	redirectToDashboardAlreadyLogin();	
	
	document.userSignup.addEventListener('submit', async e => {
		e.preventDefault();
		
		let email = document.userSignup.email.value;
		let first_name = document.userSignup.first_name.value;
		let last_name = document.userSignup.last_name.value;
		let password = document.userSignup.password.value;
		let address = document.userSignup.address.value;
				
		document.userSignup.email.value = email;
		document.userSignup.first_name.value = first_name;
		document.userSignup.last_name.value = last_name;
		document.userSignup.password.value = password;
		document.userSignup.address.value = address;
		
		loading.style.display = "block";
		signupApiCall(email,first_name,last_name,password,address);					
	});
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("userSignup.js operations error : " , err);
}

