const includeHTMLSegments = () => {
  let z, i, elmnt, file, xhttp;
  let pageLoadingStatus = false;
  
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
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


const prepareHandlers = () => {
	includeHTMLSegments();
}

window.onload = function(){
	prepareHandlers();
}

