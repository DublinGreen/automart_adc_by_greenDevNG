let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;
let form = document.getElementById('sendFlagOrder') ;

let purchaseOrderHeading = document.getElementById('purchaseOrderHeading') ;
let carDescription = document.getElementById('carDescription') ;
let carPrice = document.getElementById('carPrice') ;

let userInfo;
let carInfo;
let urlID;

let buyer_id;
let car_id;
let created_on;
let car_price;

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

let getCarInfo = (id) => {

	let carSuccessResponse = (data) => {
		const obj = data;        
		
		let statusObj = obj['status'];
		let dataObj = obj['data'];
		
		if(statusObj == 200){
			// close alert box
			alertSection.style.display = "none";
			alertSection.style.height = "0px";	
			carInfo	= dataObj;
								
			purchaseOrderHeading.innerHTML = `Flag ${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`

			let tempNGNCurrencyString = currencyFormatter.format(carInfo.price);
			let cleanNGNCurrencyString = tempNGNCurrencyString.replace("NGN", '&#8358;');
			carPrice.innerHTML = cleanNGNCurrencyString;
								
			if(carInfo.picture1 != ""){
				mainImage.setAttribute("src",carInfo.picture1);
				mainImage.setAttribute("title",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);
				mainImage.setAttribute("alt",`${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`);	
			}	
			
			carDescription.innerHTML = 	carInfo.description;	
			
			car_id = carInfo.id;					
			created_on = getCurrentDateForJson();
			car_price = carInfo.price;
			
			loading.style.display = "none";
		}
		
		if(statusObj == 400){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";
			alertContent.innerHTML = "Something went wrong, unable to fetch car information.";
		}			
		
	}

	let carErrorResponse = () => {
		alertSection.style.display = "block";
		alertSection.style.height = "100px";
		alertContent.innerHTML = error;
		
		console.log("Error >>>>>>", error);	
	}
	
	sendPOSTCallwithToken(apiCarInfo, {"id": id})
	.then(data => carSuccessResponse(data))
	.catch(error => carErrorResponse(error));
	
}

let sendFlagReport = (sendFormData) => {

	let sendFlagSuccessResponse = (data) => {
		const obj = data;        
		
		let statusObj = obj['status'];
		let dataObj = obj['data'];
		
		if(statusObj == 200){
			alertSection.style.display = "block";
			alertSection.style.height = "100px";
			alertContent.innerHTML = `Flag/Report has been registered, the admin has been notified and will responds  <a href='view-flag.html?id=${dataObj.object.id}'>View Flag</a>`;
			
			loading.style.display = "none";
		}	
	}

	let sendFlagErrorResponse = (error) => {
		alertSection.style.display = "block";
		alertSection.style.height = "100px";
		alertContent.innerHTML = error;
		
		console.log("Error >>>>>>", error);	
	}
		
	sendPOSTCallwithToken(apiFlagPost, sendFormData)
	.then(data => sendFlagSuccessResponse(data))
	.catch(error => sendFlagErrorResponse(error));	
}

try{						
	tokenValidation();
	let user_id = getUserID();
	loading.style.display = "block";
		
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	if(URL){
		// Got URL Obj
		let currentPage = window.location.href;
		let lastPosOfSlash = currentPage.lastIndexOf("/") + 1; // i don't need the slash
		let justPageNameWithExtension = currentPage.substring(lastPosOfSlash, currentPage.length);
		
		let url = new URL(`http://${justPageNameWithExtension}`);		
		urlID = url.searchParams.get("car_id");
		//console.log("urlID >>>>>" , urlID );
	}	
	
	if(urlID != null){
		getCarInfo(urlID);
	}

	form.addEventListener('submit', async e => {
		e.preventDefault();
		
		let reason = document.send_flag_order.reason.value;
		let description = document.send_flag_order.description.value;
							
		document.send_flag_order.reason.value = reason;
		document.send_flag_order.description.value = description;
		let created_on = getCurrentDateForJson();
		
		loading.style.display = "block";
			
		let sendFormData = {"user_id": user_id ,"car_id": urlID,"created_on" : created_on, "reason" : reason, "description" : description};
		//console.log("sendFormData >>>>>>", sendFormData);
		
		sendFlagReport(sendFormData);
	});
					
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

