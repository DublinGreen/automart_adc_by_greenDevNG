let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

let getBuyerInfo = (id) => {

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

let getCarInfo = (id) => {

	let carSuccessResponse = (data) => {
		let mainImage = document.getElementById('mainImage') ;

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

	sendPOSTCallwithToken(apiCarInfo, {'id' : id})
	.then(data => carSuccessResponse(data))
	.catch(error => carErrorResponse(error));
}

const getUserReceivedOrders = () => {			

	let successResponseReceivedOrders = (data) => {
		let headingCount = document.getElementById("headingCount"); 
		let dataObjCount;
		let dataObjResults;
		
		const obj = data;        
		
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
				headingCount.innerHTML = dataObjCount ;	
				//get car info and buyer info for each purchase order
				
					let newArrayObjJson = [];					
					let counter = 0; // zero based because array are 0 based
					
					// want to first get the json obj then put it in an array so i can sort in reverse
					// for loop through original json obj
					for(let item of dataObjResults) {			
						newArrayObjJson[counter] =  item;
						counter++; // increment counter
					}
					
					// need to reserve the order the lastest advert should be at the top
					newArrayObjJson.reverse();
					//for loop through newArrayObjJson
					for(let item of newArrayObjJson){
						console.log("item  >>>>>>>>>>>", item );						 
						getCarInfo(item.car_id);
						getBuyerInfo(item.buyer);
					}
			
			}catch(err){
				// no need to do anything with the err
			}
			
		}
		
		if(statusObj == 400){
			loading.style.display = "none";
			console.error("unable to set Received orders count");
		}	
	}

	let errorResponseReceivedOrders = (error) => {
		console.error("unable to set Received orders count >>>> ",  error );
	}

	let id = getUserID();
	let token = getUserToken();
	
	if(token != null){
		loading.style.display = "block";
		sendPOSTCallwithToken(apiUserReceivedPurchaseOrder, {"id" : id})
		.then(data => successResponseReceivedOrders(data))
		.catch(error => errorResponseReceivedOrders(error));		
	}
}

try{						
	validateToken();	
	
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	getUserReceivedOrders();
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("purchaseOrders.js operations error : " , err);
}

