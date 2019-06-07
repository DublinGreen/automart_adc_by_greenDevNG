let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

let form = document.edit_car_advert;
let carInfo;
let headingForCarEdit = document.getElementById('headingForCarEdit') ;

let getCarInfo = (id) => {
	let token = sessionStorage.getItem("token");
	loading.style.display = "block";
	
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
					loading.style.display = "none";
					
					carInfo	= dataObj;
					headingForCarEdit.innerHTML = `${carInfo.manufacturer.toUpperCase()} -  [${carInfo.model}]`
					
					if(carInfo.state.toUpperCase() == "USED"){
						form.vechicle_state.selectedIndex = 2;	
					}else{
						form.vechicle_state.selectedIndex = 1;	
					}
					
					form.vechicle_price.value = carInfo.price;		
					form.vechicle_manufacturer.value = carInfo.manufacturer;		
					form.vechicle_model.value = carInfo.model;		
					form.vechicle_body_type.value = carInfo.body_type;		
					form.description.value = carInfo.description;				
										
					let tempNGNCurrencyString = currencyFormatter.format(carInfo.price);
					let cleanNGNCurrencyString = tempNGNCurrencyString.replace("NGN", '&#8358;');
					//carPrice.innerHTML = cleanNGNCurrencyString;					
				}
				
				if(statusObj == 400){
					window.location = "purchase-orders.html"; // cannot get carInfo so redirect to dashboard page.
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

const editCarApiCall = (vechicle_status,vechicle_state,vechicle_manufacturer,vechicle_price,vechicle_model,vechicle_body_type, description,token,urlID) => {
	let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	loading.style.display = "block";
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loading.style.display = "none";
			const obj = JSON.parse(this.response);        
			
			let statusObj = obj['status'];
			let dataObj = obj['data'];
			
			if(statusObj == 200){
				// close alert box
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				loading.style.display = "none";	
				
				alertContent.innerHTML = `Car advert info has been updated.  <a href="view-car.html?id=${urlID}">View Car</a>`;
			}
			
			if(statusObj == 400){
				alertSection.style.display = "block";
				alertSection.style.height = "100px";
				alertContent.innerHTML = dataObj.error;
			}			
		}
	};
	xhttp.open("POST", apiCarEdit, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
	let parameters = `status=${vechicle_status}&manufacturer=${vechicle_manufacturer}&model=${vechicle_model}&price=${vechicle_price}&state=${vechicle_state}&body_type=${vechicle_body_type}&description=${description}&id=${urlID}&token=${token}`;
	xhttp.send(parameters);
}

try{						
	validateToken();	
	
	alertSection.style.display = "none";
	alertSection.style.height = "0px";

	let token = getUserToken();
	
	let tempUrlID;		
	if(URL){
		// Got URL Obj
		let currentPage = window.location.href;
		let lastPosOfSlash = currentPage.lastIndexOf("/") + 1; // i don't need the slash
		let justPageNameWithExtension = currentPage.substring(lastPosOfSlash, currentPage.length);
		
		let url = new URL(`http://${justPageNameWithExtension}`);		
		tempUrlID = url.searchParams.get("id");
		
		getCarInfo(tempUrlID);
	}	
	const urlID = tempUrlID; // don't want this to change
		
	try{
		form.onsubmit = function(){					
			let answer = confirm("Are you sure you want to edit your advert car info?");						
			if(answer == true){
				if(token != null){						
					let stateIndex = form.vechicle_state.selectedIndex;
					let vechicle_state;
					let vechicle_manufacturer = form.vechicle_manufacturer.value;
					let vechicle_price = form.vechicle_price.value;
					let vechicle_model = form.vechicle_model.value;
					let vechicle_body_type = form.vechicle_body_type.value;
					let description = form.description.value;
					let vechicle_status = form.vechicle_status.value;

					if(stateIndex == 1){
						vechicle_state = "NEW";
					}else{
						vechicle_state = "USED";
					}
					
					editCarApiCall(vechicle_status,vechicle_state,vechicle_manufacturer,vechicle_price,vechicle_model,vechicle_body_type, description,token,urlID);		
				}
			}						
			return false; // i don't need the form to submit to any action page
		}						
	}catch(err) {
		console.log("Problems with editCarInfo (name) form submission", err);
	}
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("editCarInfo.js operations error : " , err);
}

