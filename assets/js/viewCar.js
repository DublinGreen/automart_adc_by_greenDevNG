let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;
let carActionForms = document.getElementById('carActionForms') ;
let editCarAdvertLink = document.getElementById('editCarAdvertLink') ;

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

let userName = document.getElementById('userName') ;
let userEmail = document.getElementById('userEmail') ;
let userAddress = document.getElementById('userAddress') ;
let userMail = document.getElementById('userMail') ;

let userInfo;
let carInfo;
let urlID;

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
					if(carInfo.owner == loggedUserID && carInfo.status.toUpperCase() == "SOLD"){
						// login user is the same user that own car, should have the abiity to flag advert or make a purchase order
						// but should have the ability to edit car advert
						carActionForms.style.display = "none";
						
						if(carInfo.status.toUpperCase() != "SOLD"){
							editCarAdvertLink.href = `edit-car-sale-advert.html?id=${carInfo.id} `;	
						}else{
							editCarAdvertLink.href = `#`;
							editCarAdvertLink.style.visibility = "hidden";
						}
						
					}else{
						editCarAdvertLink.href = `#`;
						editCarAdvertLink.style.visibility = "hidden";
					}
									
					loading.style.display = "none";
				}
				
				if(statusObj == 400){
					
				}			
			}
		};
		xhttp.open("POST", apiUserInfo, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		let parameters = `token=${token}&id=${id}`;
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
					
					console.log("carInfo >>>>" , carInfo);
					
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
					
					getUserInfo(carInfo.owner);
				}
				
				if(statusObj == 400){

				}			
			}
		};
		xhttp.open("POST", apiCarInfo, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		let parameters = `token=${token}&id=${id}`;
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
		urlID = url.searchParams.get("id");
		console.log("urlID >>>>>" , urlID );
	}	
	
	if(urlID != null){
		getCarInfo(urlID);
	}
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

