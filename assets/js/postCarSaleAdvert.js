let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

try{						
	validateToken();	
		
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	document.post_car_advert.addEventListener('submit', async e => {
		e.preventDefault();
	
		let owner = getUserID();
		let created_on = getCurrentDateForJson();
		let status = CAR_CREATE_STATUS_DEFAULT_AVAILABLE; // NOT CHANGE THIS, from apiConfig.js
		let email = getUserEmail();	
		
		let state = document.post_car_advert.vechicle_state.value;
		let price = document.post_car_advert.vechicle_price.value;
		let manufacturer = document.post_car_advert.vechicle_manufacturer.value;
		let model = document.post_car_advert.vechicle_model.value;
		let body_type = document.post_car_advert.vechicle_body_type.value;
		let description = document.post_car_advert.description.value;
	
		let stateIndex = document.post_car_advert.vechicle_state.selectedIndex;
		//console.log("selected index >>>>>>" , stateIndex);		
		document.post_car_advert.vechicle_state.selectedIndex = 0; // well i really want the user to be sure about this. so we set this as the default which has no value
		
		document.post_car_advert.vechicle_state.value = email;
		document.post_car_advert.vechicle_price.value = price;
		document.post_car_advert.vechicle_manufacturer.value = manufacturer;
		document.post_car_advert.vechicle_model.value = model;
		document.post_car_advert.vechicle_body_type.value = body_type;
		document.post_car_advert.description.value = description;
		
		// The Javascript
		let fileInput = document.post_car_advert.files;
		let file = "";
		let file2  = "";
		let file3  = "";
		let file4  = "";
		let file5  = "";
		let filesCount = fileInput.files.length;
		
		if(filesCount > 5){
			alert("You are only allowed to upload a maximum of 5 files");
		}else{
			loading.style.display = "block";
			
			for(let temp = 0; temp <= filesCount; temp++){
				switch(temp){
					case 0:
						file = fileInput.files[temp];
						break;
					case 1:
						file2 = fileInput.files[temp];
						break;
					case 2:
						file3 = fileInput.files[temp];
						break;
					case 3:
						file4 = fileInput.files[temp];
						break;
					case 4:
						file5 = fileInput.files[temp];
						break;
					default:
						continue;
				}
			}		
			
			let token = sessionStorage.getItem("token");
			
			let formData = new FormData();
			formData.append('owner', owner);
			formData.append('email', email);
			formData.append('created_on', created_on);
			formData.append('manufacturer', manufacturer);
			formData.append('model', model);
			formData.append('price', price);
			formData.append('state', state);
			formData.append('status', status);
			formData.append('body_type', body_type);
			formData.append('description', description);
			formData.append('image', file);
			formData.append('image', file2);
			formData.append('image', file3);
			formData.append('image', file4);
			formData.append('image', file5);
			formData.append('fileCount', filesCount);
			
			//console.log("file 1 >>>>>>", file );
			//console.log("file 2 >>>>>>", file2 );
			//console.log("file 3 >>>>>>", file3 );
			//console.log("file 4 >>>>>>", file4 );
			//console.log("file 5 >>>>>>", file5 );
			//console.log(formData.getAll("email"));
						
			let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					loading.style.display = "none";
					const obj = JSON.parse(this.response);        
					
					let statusObj = obj['status'];
					let dataObj = obj['data'];
					
					if(statusObj == 200){
						// close alert box
						//console.log("dataObj >>>> " , dataObj);
						alertSection.style.display = "block";
						alertSection.style.height = "100px";	
						
						alertContent.innerHTML = `${dataObj.manufacturer} ${dataObj.model} has been posted <a href='view-car.html?id=${dataObj.id}'>View</a>`;
					}
					
					if(statusObj == 400){
						alertSection.style.display = "block";
						alertSection.style.height = "100px";
						alertContent.innerHTML = dataObj.error;
					}			
				}
			};	
			
			xhttp.open("POST", apiCarAdvertCreate, true);
			xhttp.setRequestHeader("token", token);
			xhttp.send(formData);	
		}
				
	});				
		
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("postCarSaleAdvert.js operations error : " , err);
}

