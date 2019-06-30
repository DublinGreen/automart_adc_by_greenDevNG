let alertSection = document.getElementById("alert");
let alertContent = document.getElementById("alertContent");
let closeAlertButton = document.getElementById("closeAlert"); 
let loading = document.getElementById('loading') ;

let autoGenCarsBox = document.getElementById('autoGenCarsBox') ;

let carsInfo;

let getAllCars = () => {
	let token = sessionStorage.getItem("token");

	if(token != null){
		//not empty
		let xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const obj = JSON.parse(this.response);        
				
				let statusObj = obj['status'];
				let dataObj = obj['data'];
				let dataObjCount = dataObj.count;
				let dataObjResults = dataObj.object;
				
				if(statusObj == 200){
					// close alert box
					alertSection.style.display = "none";
					alertSection.style.height = "0px";	
					loading.style.display = "none";
					
					carsInfo= dataObjResults; 
					let totalCount = document.getElementById("totalCount");
					totalCount.innerHTML = dataObjCount;
					
					let newArrayObjJson = [];					
					let counter = 0; // zero based because array are 0 based
					
					// want to first get the json obj then put it in an array so i can sort in reverse
					// for loop through original json obj
					for(let item of carsInfo) {			
						newArrayObjJson[counter] =  item;
						counter++; // increment counter
					}
					
					// need to reserve the order the lastest advert should be at the top
					newArrayObjJson.reverse();
					//for loop through newArrayObjJson
					for(let item of newArrayObjJson){
												 
						let genCarBox = document.createElement('section');
						genCarBox.setAttribute("class","vechiclemarketBox");
						
						let figure = document.createElement('figure');
						figure.setAttribute("class","vechiclemarketBoxDetails");
						
						let heading = document.createElement("h3");
						heading.setAttribute("class","text-center");
						let headingText = `${item.manufacturer.toUpperCase()} - ${item.model}`;						
						//textContent() is not available in all browsers, so check if it exist, if not  use innerText
						if( typeof heading.textContent === "function"){
							heading.textContent(headingText);	
						}else{
							heading.innerText = headingText;	
						}

						let link = document.createElement("a");
						link.href = `view-car.html?id=${item.id}`;
						
						let img = document.createElement("img");
						img.setAttribute("class","vehicleImage");
						img.src = item.picture1;
						img.title = `${item.manufacturer} - ${item.model}`;
						img.alt = `${item.manufacturer} - ${item.model}`;
						img.setAttribute("width","100%");
						img.setAttribute("height","250px");
						img.alt = headingText;
						
						let article = document.createElement("article");
						article.setAttribute("class","pull-left userContentAreaFull");
						
						let headingPrice = document.createElement("h3");
						headingPrice.setAttribute("class","text-center vehicleMoney");
						
						let tempNGNCurrencyString = currencyFormatter.format(item.price);
						let cleanNGNCurrencyString = tempNGNCurrencyString.replace("NGN", escapeHtml('&#8358;'));
						
						let headingPriceText = cleanNGNCurrencyString;						
						//textContent() is not available in all browsers, so check if it exist, if not  use innerText
						if( typeof headingPrice.textContent === "function"){
							headingPrice.textContent(headingPriceText);	
						}else{
							headingPrice.innerText = headingPriceText;	
						}
						
						let sectionClearfix = document.createElement("section");
						sectionClearfix.setAttribute("class","clearfix");
						
						link.appendChild(img);
						article.appendChild(headingPrice);
						
						figure.appendChild(heading);
						figure.appendChild(link);
						figure.appendChild(article);
						figure.appendChild(sectionClearfix);
						
						genCarBox.appendChild(figure);
						//console.log("carInfo item >>>>" , item);
						
						autoGenCarsBox.appendChild(genCarBox);
					}
			
				}
				
				if(statusObj == 400){
					loading.style.display = "none";
				}			
			}
		};
		xhttp.open("POST", apiAllCars, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("token", token);
		xhttp.send();
	}else{
		logoutUser();
	}
}

try{						
	validateToken();	
	loading.style.display = "block";
		
	alertSection.style.display = "none";
	alertSection.style.height = "0px";
	
	getAllCars();			
	getCarsManufacturerNoTokenNeededForSearchDataList();	
	getCarsModelNoTokenNeededForSearchDataList();
	
	closeAlertButton.addEventListener("click", closeAlertButtonHandler);//closeAlert handler
}catch(err) {
	console.log("viewCar.js operations error : " , err);
}

