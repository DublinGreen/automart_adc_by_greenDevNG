let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

try{						
	validateToken();	
	
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("purchaseOrders.js operations error : " , err);
}

