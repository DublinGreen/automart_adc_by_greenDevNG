const includeHTMLSegments = () => {
  let tags, i, elmnt, file, xhttp;
  let pageLoadingStatus = false;
  
  /*loop through a collection of all HTML elements:*/
  tags = document.getElementsByTagName("*");
  for (i = 0; i < tags.length; i++) {
    elmnt = tags[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
			  elmnt.innerHTML = this.responseText;
			  pageLoadingStatus = true;
		  }
          if (this.status == 404) {
			  elmnt.innerHTML = "Page not found.";
		  }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTMLSegments();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      
      return pageLoadingStatus;
    }
  }
};

const prepEventHandlersConfirmationPurchaseOrderReject = () => {		
	let answer = confirm("Are you sure you want to reject this purchase order?");		
	
	if(answer == true){
		return true;
	}else{
		return false;
	}
}

const confirmAcceptOrderDialog = () => {
	
}

const loadScriptsAsNeeded = () => {
	let currentPage = window.location.href;
	let lastPosOfSlash = currentPage.lastIndexOf("/") + 1; // i don't need the slash
	let justPageNameWithExtension = currentPage.substring(lastPosOfSlash, currentPage.length);
	let lookingForHash = currentPage.lastIndexOf("#") + 1; // we don't want hash #
	
	// not 0, means there is a # in the url
	if(lookingForHash !== 0 && justPageNameWithExtension != "passwordreset.html"){
		//window.location = "login.html"; // We don't want hash, it will break this logic
	}
	
	console.log("justPageNameWithExtension >>>>>" , justPageNameWithExtension);
	if(justPageNameWithExtension === "login.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/userLogin.js';
		document.head.appendChild(pageJs);	
	}
	
	if(justPageNameWithExtension === "purchase-orders.html"){
		
	}
	
	if(justPageNameWithExtension === "passwordrecovery.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/userPasswordRecovery.js';
		document.head.appendChild(pageJs);	
	}
	
	if(justPageNameWithExtension === "signup.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/userSignup.js';
		document.head.appendChild(pageJs);
	}
	
	if(justPageNameWithExtension === "about.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/about.js';
		document.head.appendChild(pageJs);
	}
}

const prepareHandlers = () => {
	includeHTMLSegments();	
	
	try{
		let confirmAcceptOrder = document.getElementById("confirmAcceptOrder");
		
		if(confirmAcceptOrder != null){
			confirmAcceptOrder.onsubmit = function(){
				let answer = confirm("Are you sure you want to accept this purchase order?");		
					
				if(answer == true){
					return true;
				}else{
					return false;
				}
			};	
		}
	}catch(err) {
		console.log("Problems with confirmAcceptOrder (ID) form submission" , err);
	}
		
	try{
		let confirmVehicleDataUpdate = document.getElementById("confirmVehicleDataUpdate");
		if(confirmVehicleDataUpdate != null){
			confirmVehicleDataUpdate.onsubmit = function(){
				let answer = confirm("Are you sure you want to update this car sale advert?");		
				
				if(answer == true){
					return true;
				}else{
					return false;
				}
			};				
		}		
	}catch(err) {
		console.log("Problems with confirmVehicleDataUpdate (ID) form submission", err);
	}
}

try{
	loadScriptsAsNeeded();
	let loading = document.getElementById('loading') ;
	loading.style.display = "none";	
}catch(err){
	console.log("Importing other needed scripts file failed : " , err);
}
	
window.onload = function(){
	prepareHandlers();	
}

