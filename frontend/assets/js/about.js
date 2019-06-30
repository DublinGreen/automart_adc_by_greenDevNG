let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

try{						
	alertSection.style.display = "none";
	alertSection.style.height = "0px";

	//check if already logged in
	redirectToDashboardAlreadyLogin();	
	
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("about.js operations error : " , err);
}

