let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;
let form = document.getElementById('sendPurchaseOrder') ;

let purchaseOrderHeading = document.getElementById('purchaseOrderHeading') ;
let carDescription = document.getElementById('carDescription') ;
let carPrice = document.getElementById('carPrice') ;

let userInfo;
let carInfo;
let urlID;

let buyer_id;
let carOwnerID;
let car_id;
let created_on;
let car_price;

const sendPurchaseOrderAPICall = (order_price,car_price,description,buyer_id,car_id,created_on,status,carOwnerID) => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loading.style.display = "none";
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			
			if(statusObj == 200){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = `Purchase order has been sent <a href='purchase-order-view.html?id=${dataObj.object.id}'>View Purchase Order</a>`;
				// maybe i shoud just redirect to view purchase order page?
				//window.location = "purchase-orders.html"; // login success, so redirect to dashboard page.
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	
	xhttp.open("POST", apiUserCreatePurchaseOrder, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	let token = getUserToken();
	xhttp.setRequestHeader("token", token);
	
	let parameters = `buyer=${buyer_id}&car_id=${car_id}&price=${car_price}&description=${description}&price_offered=${order_price}&created_on=${created_on}&status=${status}&owner=${carOwnerID}`;
	//console.log("parameters >>>>>" , parameters);
	xhttp.send(parameters);
}

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
					//console.log(userInfo);
											
					let loggedUserID = getUserID();					
					
					buyer_id = loggedUserID;
					loading.style.display = "none";
				}
				
				if(statusObj == 400){
					alertSection.style.display = "block";
					alertSection.style.height = "100px";
					alertContent.innerHTML = "Something went wrong, unable to fetch car owner information.";
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

let getCarInfo = (id) => {
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
					carInfo	= dataObj;
										
					purchaseOrderHeading.innerHTML = `Purchase order for ${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`

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
					
					carOwnerID = carInfo.owner;
					getUserInfo(carInfo.owner);
				}
				
				if(statusObj == 400){
					alertSection.style.display = "block";
					alertSection.style.height = "100px";
					alertContent.innerHTML = "Something went wrong, unable to fetch car information.";
				}			
			}
		};
		xhttp.open("POST", apiCarInfo, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		let parameters = `id=${id}`;
		xhttp.send(parameters);
	}else{
		logoutUser();
	}
}

try{						
	validateToken();	
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
		
		let order_price = document.send_purchase_order.order_price.value;
		let description = document.send_purchase_order.description.value;
							
		document.send_purchase_order.order_price.value = order_price;
		document.send_purchase_order.description.value = description;
		
		loading.style.display = "block";
		let status = "PENDING";
		
		sendPurchaseOrderAPICall(order_price,car_price,description,buyer_id,car_id,created_on,status,carOwnerID);			
	});
					
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

