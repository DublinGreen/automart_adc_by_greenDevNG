let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;
let carActionForms = document.getElementById('carActionForms') ;
let editCarAdvertLink = document.getElementById('editCarAdvertLink') ;

let carFullName = document.getElementById('carFullName') ;
let carDescription = document.getElementById('carDescription') ;
let carManufacturer = document.getElementById('carManufacturer') ;
let carState = document.getElementById('carState') ;
let carModel = document.getElementById('carModel') ;
let carBodyType = document.getElementById('carBodyType') ;
let carPrice = document.getElementById('carPrice') ;

let userName = document.getElementById('userName') ;
let userEmail = document.getElementById('userEmail') ;
let userAddress = document.getElementById('userAddress') ;
let userMail = document.getElementById('userMail') ;

let userInfo;
let carInfo;
let urlID;

let getUserInfoNoToken = (id) => {
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
					userName.innerHTML = 	` ${userInfo.first_name} *******`;		
					
					console.log("userInfo  >>>>>" , userInfo);
					//not logged in, so why give saler information
					userEmail.innerHTML = 	"**********";		
					userAddress.innerHTML = 	"**********";		
					userMail.href = "#";
					loading.style.display = "none";
				}
				
				if(statusObj == 400){
					
				}			
			}
		};
		
		xhttp.open("POST", apiUserInfoNoTokenNeeded, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		let parameters = `id=${id}`;
		xhttp.send(parameters);
}

let getCarInfoNoToken = (id) => {
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
				
				//console.log("carInfo >>>>" , carInfo);
				
				carFullName.innerHTML = `${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`; 				
				carDescription.innerHTML = 	carInfo.description;		
				carManufacturer.innerHTML = carInfo.manufacturer.toUpperCase();
				carState.innerHTML = carInfo.state.toUpperCase();
				carModel.innerHTML = carInfo.model; 
				carBodyType.innerHTML = carInfo.body_type;
				let tempNGNCurrencyString = currencyFormatter.format(carInfo.price);
				let cleanNGNCurrencyString = tempNGNCurrencyString.replace("NGN", '&#8358;');
				carPrice.innerHTML = cleanNGNCurrencyString;
				
				getUserInfoNoToken(carInfo.owner);
			}
			
			if(statusObj == 400){

			}			
		}
	};
	xhttp.open("POST", apiCarInfoNoTokenNeeded, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let parameters = `id=${id}`;
	xhttp.send(parameters);
}

try{						
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
		getCarInfoNoToken(urlID);
	}
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

