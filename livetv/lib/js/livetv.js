/**
 * 
 */
function check_auth_status() {
	var auth_status = localStorage.getItem("auth_status");

	if ( auth_status != null && auth_status == "off") {
		location.replace("loading.html");
		return;
	}
	
	var auth = new Auth();
	auth.onloadinfo = function( devinfo ) {
		if ( auth.info.status == 0 && devinfo.isillegal == "yes" ) {
			alert("Fatal: Device is not valid to play live tv!");
			tizen.application.getCurrentApplication().exit();
			/*
			var app = wae.create("Application");
			app.finishActivity();
			*/
			return;
		} else {
			location.replace("loading.html");
		}
	}
	auth.loadinfo();

	setTimeout( function() {
		alert("Fatal: connect server timeout!");
		tizen.application.getCurrentApplication().exit();
		/*
		var app = wae.create("Application");
		app.finishActivity();
		*/
	}, 1000 * 30 );
}

check_auth_status();