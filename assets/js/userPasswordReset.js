let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

const passwordReset = (password,id,passwordResetToken,resetToken) => {
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
				alertContent.innerHTML = "Password Reset Success <a href='login.html' title='back to login' >Back to login</a> ";
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiPasswordReset, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let parameters = "password=" + password + "&id=" + id + "&passwordResetToken=" + passwordResetToken + "&resetToken=" + resetToken;
	xhttp.send(parameters);
}

try{
	let passwordResetToken;
	let id;
	let resetToken;
							
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	if(URL){
		// Got URL Obj
		let currentPage = window.location.href;
		let lastPosOfSlash = currentPage.lastIndexOf("/") + 1; // i don't need the slash
		let justPageNameWithExtension = currentPage.substring(lastPosOfSlash, currentPage.length);
		
		let url = new URL("http://" + justPageNameWithExtension);
		
		passwordResetToken = url.searchParams.get("passwordResetToken");
		id = url.searchParams.get("id");
		resetToken = url.searchParams.get("resetToken");
				
		document.passwordReset.passwordResetToken.value = passwordResetToken;
		document.passwordReset.id.value = id;
		document.passwordReset.resetToken.value = resetToken;
		
		document.passwordReset.action = justPageNameWithExtension;
	}	
	
	document.passwordReset.onsubmit = function(){		
		let password = document.passwordReset.password.value;
		document.passwordReset.password.value = password;
		
		let formPasswordResetToken = document.passwordReset.passwordResetToken.value;
		let formID = document.passwordReset.id.value;
		let formResetToken = document.passwordReset.resetToken.value;
		
		let passwordConfirm = document.passwordReset.passwordConfirm.value;
		document.passwordReset.passwordConfirm.value = passwordConfirm;
		
		if(password !== passwordConfirm){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";	
			alertContent.innerHTML = "Passwords do not match";			
		}else if(formPasswordResetToken != passwordResetToken || formID != id || formResetToken != resetToken){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";	
			alertContent.innerHTML = "tokens do not match. Try recovery password again <a href='passwordrecovery.html'>Recovery Password</a>";			
		}else{
			loading.style.display = "block";
			passwordReset(password,id,passwordResetToken, resetToken);						
		}

		return false; // i don't need the form to submit to any action page
	};
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("userPasswordReset.js operations error : " , err);
}


