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
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/purchaseOrders.js';
		document.body.appendChild(pageJs);	
	}
	
	if(justPageNameWithExtension === "passwordrecovery.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/userPasswordRecovery.js';
		document.body.appendChild(pageJs);	
	}
	
	if(justPageNameWithExtension === "signup.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/userSignup.js';
		document.body.appendChild(pageJs);
	}
	
	if(justPageNameWithExtension === "about.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/about.js';
		document.body.appendChild(pageJs);
	}
	
	if(justPageNameWithExtension === "post-car-sale-advert.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/postCarSaleAdvert.js';
		document.body.appendChild(pageJs);
	}
	
	if(justPageNameWithExtension === "profile.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/profile.js';
		document.body.appendChild(pageJs);
	}

	if(justPageNameWithExtension === "view-all-car-posts.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/viewAllCarPosts.js';
		document.body.appendChild(pageJs);
	}
	
	if(justPageNameWithExtension === "index.html"){		
		let pageJs = document.createElement('script');
		pageJs.src = 'assets/js/index.js';
		document.body.appendChild(pageJs);
	}
		
}

const prepareHandlers = () => {	
	try{
		let confirmAcceptOrder = document.getElementById("confirmAcceptOrder");
		
		if(confirmAcceptOrder != null){
			confirmAcceptOrder.onsubmit = function(){
				let answer = confirm("Are you sure you want to make this purchase order?");		
					
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
	
	
	try{
		let confirmRejectOrder = document.getElementById("confirmRejectOrder");
		
		if(confirmRejectOrder != null){
			confirmRejectOrder.onsubmit = function(){
				let answer = confirm("Are you sure you want to flag this advert?");		
					
				if(answer == true){
					return true;
				}else{
					return false;
				}
			};	
		}
	}catch(err) {
		console.log("Problems with confirmRejectOrder (ID) form submission" , err);
	}
	
}

try{
	includeHTMLSegments();	
	loadScriptsAsNeeded();
	
	let loading = document.getElementById('loading') ;
	loading.style.display = "none";	
}catch(err){
	console.log("Importing other needed scripts file failed : " , err);
}

const optSetNameDisplay = () => {
	let userFirstAndLastName = document.getElementById('userFirstAndLastName') ;
	if(userFirstAndLastName != null){
		let firstName = getUserFirstName();
		let lastName = getUserLastName();
		if(firstName != null || lastName != null){
			userFirstAndLastName.innerHTML = `Welcome, ${firstName.toUpperCase()} ${lastName.toUpperCase()}`;		
		}
	}	
}

const getUserCarsCountUnsold = () => {
	let id = getUserID();
	let token = getUserToken();
	let totalUserUnsoldCarsCount = document.getElementById("totalUserUnsoldCarsCount");
	
	if(token != null){
		let dataObjCount;
		let dataObjResults;
		
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				dataObjCount = dataObj.count;
				dataObjResults = dataObj.object;
				
				if(statusObj == 200){
					let alertSection = document.getElementById("alert");
					let alertContent = document.getElementById("alertContent");
					
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					loading.style.display = "none";
					
					try{
						totalUserUnsoldCarsCount.innerHTML = dataObjCount ;		
					}catch(err){
						// no need to do anything with the err
					}
					
				}
				
				if(statusObj == 400){
					loading.style.display = "none";
					totalUserUnsoldCarsCount.innerHTML = 0;
				}			
			}
		};
		xhttp.open("POST", apiAllUserCars, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		let parameters = `id=${id}`;
		xhttp.send(parameters);
	}

}

const getUserCarsCountSold = () => {
	let id = getUserID();
	let token = getUserToken();
	let totalUserSoldCarsCount = document.getElementById("totalUserSoldCarsCount");
	
	if(token != null){
		let dataObjCount;
		let dataObjResults;
		
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				dataObjCount = dataObj.count;
				dataObjResults = dataObj.object;
				
				if(statusObj == 200){
					// close alert box
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					loading.style.display = "none";
					
					try{
						totalUserSoldCarsCount.innerHTML = dataObjCount ;		
					}catch(err){
						// no need to do anything with the err
					}
					
				}
				
				if(statusObj == 400){
					loading.style.display = "none";
					//totalUserSoldCarsCount.innerHTML = 0;
				}			
			}
		};
		xhttp.open("POST", apiAllUserCarsSold, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		let parameters = `id=${id}`;
		xhttp.send(parameters);
	}
}

const getAllCarsCount = () => {
	let token = getUserToken();
	let totalAutoMartCount = document.getElementById("totalAutoMartCount");
	
	if(token != null){
		let dataObjCount;
		let dataObjResults;
		
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				dataObjCount = dataObj.count;
				dataObjResults = dataObj.object;
				
				if(statusObj == 200){
					let alertSection = document.getElementById("alert");
					let alertContent = document.getElementById("alertContent");
					
					// close alert box
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					loading.style.display = "none";
					
					try{
						totalAutoMartCount.innerHTML = dataObjCount ;			
					}catch(err){
						// no need to do anything with the err
					}
					
				}
				
				if(statusObj == 400){
					loading.style.display = "none";
					//totalAutoMartCount.innerHTML = 0;
				}			
			}
		};
		xhttp.open("POST", apiAllCars, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		xhttp.send();
	}
}

const getCarsModelNoTokenNeededForSearchDataList = () => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			let dataObjCount = dataObj.count;
			let dataObjResults = dataObj.object;
						
			if(statusObj == 200){				
				let carsInfo = new Set(dataObjResults) ; // distinct values;
				let iterator = carsInfo.values();
				let searchBox = document.getElementById("cars");	
				
				let tempCounter = 0; // very important
				while(tempCounter < carsInfo.size){
					let tempValue =iterator.next().value;
					tempValue = tempValue.toLowerCase();
					
					let option = document.createElement("option");
					option.setAttribute("label",tempValue);
					if( typeof option.textContent === "function"){
							option.textContent(tempValue);	
					}else{
						option.innerText = tempValue;	
					}
					
					searchBox.appendChild(option);
					tempCounter++; // very important, if you don't want an infinite loop
				}
				
			}
			
			if(statusObj == 400){
				// the datalist is not critical to the app operations
			}			
		}
	};
	
	xhttp.open("POST", apiAllCarsModelNoTokenNeeded, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

const getCarsManufacturerNoTokenNeededForSearchDataList = () => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			let dataObjCount = dataObj.count;
			let dataObjResults = dataObj.object;
			
			if(statusObj == 200){				
				let carsInfo = new Set(dataObjResults) ; // distinct values;
				let iterator = carsInfo.values();
				let searchBox = document.getElementById("cars");	
				
				let tempCounter = 0; // very important
				while(tempCounter < carsInfo.size){
					let tempValue =iterator.next().value;
					tempValue = tempValue.toLowerCase();
					
					let option = document.createElement("option");
					option.setAttribute("label",tempValue);
					if( typeof option.textContent === "function"){
							option.textContent(tempValue);	
					}else{
						option.innerText = tempValue;	
					}
					
					searchBox.appendChild(option);
					tempCounter++; // very important, if you don't want an infinite loop
				}
				
			}
			
			if(statusObj == 400){
				// the datalist is not critical to the app operations
			}			
		}
	};
	
	xhttp.open("POST", apiAllCarsManufacturerNoTokenNeeded, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}
	
window.onload = function(){	
	prepareHandlers();	
	
	try{
		// we really want this operating after the page is fully loaded
		
		setTimeout(getAllCarsCount ,1000 ); // set the count for all Cars in the secondary menu ,did this to ensure all is loaded before display opt
		setTimeout(getUserCarsCountUnsold ,1000 );  // set the count for user's cars (unsold) in the secondary menu ,did this to ensure all is loaded before display opt
		setTimeout(getUserCarsCountSold ,1000 );  // set the count for user's cars (sold) in the secondary menu ,did this to ensure all is loaded before display opt
		
		let logout = document.getElementById('logout') ;
		logout.addEventListener("click", logoutUser);// set the click for logout
		
		setTimeout(setVisibilityStatusForAdmin ,1000 ); // set the admin links if user has admin status
		setTimeout(setUserOpFirstName ,1000 ); // sets the userButton name to first_name ,  did this to ensure all is loaded before display opt
		setTimeout(optSetNameDisplay ,1000 ); // did this to ensure all is loaded before display opt
		
	}catch(err){
		console.log("error in main.js : " , err);
	}
}

