let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;
let userInfo;

let userType = document.getElementById('userType') ;
let email = document.getElementById('email') ;
let first_name = document.getElementById('first_name') ;
let last_name = document.getElementById('last_name') ;
let address = document.getElementById('address');

let form = document.userEditProfile;

let getUserInfo = (id) => {
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
					
					userInfo = dataObj;
					//console.log("userInfo >>>>>" , userInfo);
					
					if(userInfo.is_admin == true){
						userType.innerHTML = "( ADMIN USER )";	
					}else{
						userType.innerHTML = "( NORMAL USER )";	
					}
					
					email.value = userInfo.email;
					first_name.value = userInfo.first_name;
					last_name.value = userInfo.last_name;
					address.value = userInfo.address;					
				}
				loading.style.display = "none";				
				
				if(statusObj == 400){
				}	
						
			}
		};
		xhttp.open("POST", apiUserInfo, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		let parameters = `id=${id}`;
		xhttp.send(parameters);
	}else{
		logoutUser();
	}
}

const editUserApiCall = (email,first_name,last_name,address,token,id) => {
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
				
				storeUserData(id,email,first_name,last_name,address);
				setUserOpFirstName(); 
				optSetNameDisplay();
				alertContent.innerHTML = "Your profile has been updated.";
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiUserEdit, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.setRequestHeader("token", token);
	let parameters = `email=${email}&first_name=${first_name}&last_name=${last_name}&address=${address}&id=${id}`;
	xhttp.send(parameters);
}

try{						
	validateToken();	
	
	alertSection.style.display = "none";
	alertSection.style.height = "0px";

	let token = getUserToken();
	let id = getUserID();
	getUserInfo(id);
		
	try{
		
		form.addEventListener('submit', async e => {
			e.preventDefault();

			let answer = confirm("Are you sure you want to edit your profile?");						
			if(answer == true){
				if(token != null){
					editUserApiCall(email.value,first_name.value,last_name.value,address.value,token,id);		
				}
			}						
		});					
	}catch(err) {
		console.log("Problems with userEditProfile (name) form submission", err);
	}
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("profile.js operations error : " , err);
}

