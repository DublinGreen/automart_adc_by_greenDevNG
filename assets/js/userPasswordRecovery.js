let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

const passwordRecovery = (email) => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loading.style.display = "none";
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			
			if(statusObj == 200){
				// close alert box
				alertSection.style.display = "block";
				alertSection.style.height = "100px";	
				alertContent.innerHTML = "Email (" + dataObj.email +  ") has been confirmed, Click link to reset password <a href='" +  dataObj.password_reset_page + "'  title='Reset password' >Reset Passowrd</a> ";
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiPasswordRecovery, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let parameters = "email=" + email;
	xhttp.send(parameters);
}

try{						
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	document.passwordRecovery.onsubmit = function(){		
		let email = document.passwordRecovery.email.value;
		document.passwordRecovery.email.value = email;
		
		loading.style.display = "block";
		passwordRecovery(email);			
		return false; // i don't need the form to submit to any action page
	};
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("userPasswordRecovery.js operations error : " , err);
}


