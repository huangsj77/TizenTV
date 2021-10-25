window.onload = function() {
	
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		console.log("LEFT");
    		break;
    	case 38: //UP arrow
    		console.log("UP");
    		break;
    	case 39: //RIGHT arrow
    		console.log("RIGHT");
    		break;
    	case 40: //DOWN arrow
    		console.log("DOWN");
    		break;
    	case 13: //OK button
    		console.log("OK");
    		break;
    	case 10009: //RETURN button
			console.log("RETURN");
			location.replace("hotel/welcome.html);
    		//tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
}