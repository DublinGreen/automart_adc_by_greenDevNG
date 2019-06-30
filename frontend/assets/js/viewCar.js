let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

let userInfo;
let carInfo;
let urlID;

let tokenValidation = () => {
		
	let tokenSuccessResponse = (data) => {
		const obj = data;

		let statusObj = obj['status'];
		let dataObj = obj['data'];
		
		if(statusObj == 200){
			alertSection.style.display = "none";
			alertSection.style.height = "0px";	
			storeToken(dataObj.token);
		}
		
		if(statusObj == 400){
			sessionStorage.clear();
			localStorage.clear();
			logoutUser();
		}		
	}

	let tokenErrorResponse = (error) => {
		alertSection.style.display = "block";
		alertSection.style.height = "100px";
		alertContent.innerHTML = error;
		
		console.log("Error >>>>>>", error);
	}

	sendPOSTCallwithToken(apiValidateToken, {})
	.then(data => tokenSuccessResponse(data))
	.catch(error => tokenErrorResponse(error));
}

let getCarAndUserInfo = (id) => {

	let userSuccessResponse = (data) => {
		let userName = document.getElementById('userName') ;
		let userEmail = document.getElementById('userEmail') ;
		let userAddress = document.getElementById('userAddress') ;
		let userMail = document.getElementById('userMail') ;
		let editCarAdvertLink = document.getElementById('editCarAdvertLink') ;
		let carActionForms = document.getElementById('carActionForms') ;
		
		const obj = data;        
		let statusObj = obj['status'];
		let dataObj = obj['data'];

		if(statusObj == 200){
			// close alert box
			alertSection.style.display = "none";
			alertSection.style.height = "0px";	
			
			userInfo = dataObj;
			//console.log("userInfo >>>>>>", userInfo);
			userName.innerHTML = 	` ${userInfo.first_name} ${userInfo.last_name} `;		
			
			userEmail.innerHTML = 	userInfo.email;		
			userAddress.innerHTML = 	userInfo.address;		
			userMail.href = `mailto: ${userInfo.email}`;
								

			if(carInfo.status.toUpperCase() == "SOLD"){
				vechicleStatus.setAttribute("class","vehicleStatusOnSale");
				vechicleStatus.innerHTML = `<blink>${carInfo.status.toUpperCase()}</blink>`;
			}else{
				vechicleStatus.innerHTML = `<blink>${carInfo.status.toUpperCase()}</blink>`;
				vechicleStatus.setAttribute("class","vehicleStatusAvailableSmall");
			}
									
			let loggedUserID = getUserID();				
			//console.log("loggedUserID >>>>>>>", loggedUserID);	
			
			if(carInfo.owner == loggedUserID || carInfo.status.toUpperCase() == "SOLD"){
				// if carInfo.owner == userInfo.id or carInfo.status == SOLD
				// do not give the user ability to make purchase order or flag the car post
				carActionForms.style.display = "none";
			}else{
				carActionForms.style.display = "block";
			}
			
			if(carInfo.owner == loggedUserID && carInfo.status.toUpperCase() != "SOLD"){
				// if carInfo.owner == userInfo.id and carInfo.status != SOLD
				// then give the user ability to edit the car post details
				editCarAdvertLink.href = `edit-car-sale-advert.html?id=${carInfo.id} `;	
			}else{
				editCarAdvertLink.href = `#`;
				editCarAdvertLink.style.visibility = "hidden";
			}
							
			loading.style.display = "none";
		}

		if(statusObj == 204){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";
			alertContent.innerHTML = dataObj.error;		
		}
	}

	let userErrorResponse = (error) => {
		alertSection.style.display = "block";
		alertSection.style.height = "100px";
		alertContent.innerHTML = error;
		
		console.log("Error >>>>>>", error);
	}
	
	let carSuccessResponse = (data) => {
		let mainImage = document.getElementById('mainImage') ;
		let mainImage2 = document.getElementById('mainImage2') ;
		let mainImage3 = document.getElementById('mainImage3') ;
		let mainImage4 = document.getElementById('mainImage4') ;
		let mainImage5 = document.getElementById('mainImage5') ;

		let carFullName = document.getElementById('carFullName') ;
		let carDescription = document.getElementById('carDescription') ;
		let carManufacturer = document.getElementById('carManufacturer') ;
		let carState = document.getElementById('carState') ;
		let carModel = document.getElementById('carModel') ;
		let carBodyType = document.getElementById('carBodyType') ;
		let carPrice = document.getElementById('carPrice') ;
		let vechicleStatus = document.getElementById('vechicleStatus') ;

		const obj = data;        
		let statusObj = obj['status'];
		let dataObj = obj['data'];

		if(statusObj == 200){
			// close alert box
			alertSection.style.display = "none";
			alertSection.style.height = "0px";	
			carInfo	= dataObj;
					
			if(carInfo.picture1 != ""){
				mainImage.setAttribute("src",carInfo.picture1);
				mainImage.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			if(carInfo.picture2 != ""){
				mainImage2.setAttribute("src",carInfo.picture2);
				mainImage2.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage2.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			if(carInfo.picture3 != ""){
				mainImage3.setAttribute("src",carInfo.picture3);
				mainImage3.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage3.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			if(carInfo.picture4 != ""){
				mainImage4.setAttribute("src",carInfo.picture4);
				mainImage4.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage4.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			if(carInfo.picture5 != ""){
				mainImage5.setAttribute("src",carInfo.picture5);
				mainImage5.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage5.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			carFullName.innerHTML = `${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`; 				
			carDescription.innerHTML = 	carInfo.description;		
			carManufacturer.innerHTML = carInfo.manufacturer.toUpperCase();
			carState.innerHTML = carInfo.state.toUpperCase();
			carModel.innerHTML = carInfo.model; 
			carBodyType.innerHTML = carInfo.body_type;
			
			let tempNGNCurrencyString = currencyFormatter.format(carInfo.price);
			let cleanNGNCurrencyString = tempNGNCurrencyString.replace("NGN", '&#8358;');
			carPrice.innerHTML = cleanNGNCurrencyString;
			
			if(carInfo.status.toUpperCase() == "SOLD"){
				vechicleStatus.setAttribute("class","vehicleStatusOnSale");
				vechicleStatus.innerHTML = `<blink>${carInfo.status.toUpperCase()}</blink>`;
			}else{
				vechicleStatus.innerHTML = `<blink>${carInfo.status.toUpperCase()}</blink>`;
				vechicleStatus.setAttribute("class","vehicleStatusAvailableSmall");
			}
			
			let purchaseOrderCarID = document.getElementById('purchaseOrderCarID') ;
			purchaseOrderCarID.value = carInfo.id;
			let flagCarID = document.getElementById('flagCarID') ;
			flagCarID.value = carInfo.id;
					
			sendPOSTCallwithToken(apiUserInfo, {'id' : carInfo.owner})
			.then(data => userSuccessResponse(data))
			.catch(error => userErrorResponse(error));
		}	

		if(statusObj == 204){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";
			alertContent.innerHTML = dataObj.error;		
		}

	}

	let carErrorResponse = (error) => {
		alertSection.style.display = "block";
		alertSection.style.height = "100px";
		alertContent.innerHTML = error;
		
		console.log("Error >>>>>>", error);
	}

	sendPOSTCallwithToken(apiCarInfo, {'id' : urlID})
	.then(data => carSuccessResponse(data))
	.catch(error => carErrorResponse(error));
}

try{						
	tokenValidation();
  	
	if(URL){
		// Got URL Obj
		let currentPage = window.location.href;
		let lastPosOfSlash = currentPage.lastIndexOf("/") + 1; // i don't need the slash
		let justPageNameWithExtension = currentPage.substring(lastPosOfSlash, currentPage.length);
		
		let url = new URL(`http://${justPageNameWithExtension}`);		
		urlID = url.searchParams.get("id");
		console.log("urlID >>>>>" , urlID );
	}	
	
	loading.style.display = "block";

	alertSection.style.display = "none";
	alertSection.style.width = "100px";
	alertSection.style.height = "0px";
	
	if(urlID != null){
		getCarAndUserInfo(urlID);
	}
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

