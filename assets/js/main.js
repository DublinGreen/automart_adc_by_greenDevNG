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

const prepareHandlers = () => {
	includeHTMLSegments();	
	
	//we using a single js page so if the #confirmAcceptOrder or #confirmRejectOrder doesn't exist in the current page DOM, it throws an error in the console
	try{
		document.getElementById("confirmAcceptOrder").onsubmit = function(){
			let answer = confirm("Are you sure you want to accept this purchase order?");		
			
			if(answer == true){
				return true;
			}else{
				return false;
			}
		};
		
		document.getElementById("confirmRejectOrder").onsubmit = function(){
			let answer = confirm("Are you sure you want to reject this purchase order?");		
			
			if(answer == true){
				return true;
			}else{
				return false;
			}
		};
	}catch(err) {
		
	}
}

window.onload = function(){
	prepareHandlers();	
}

