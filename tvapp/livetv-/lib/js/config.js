

const SERVER_URL = (function () {
	try {
		var surl = waeparams.getContentProviderPersistence("mainhosturl");
		if ( !!surl )  
			return surl ;
	}catch(e){}
	alert("Fatal: No server configuration!");
})();

const PROXY_URL= SERVER_URL + "wae/jsget.php";

var SKIP_AUTH_EACH_CHANNEL = true;


