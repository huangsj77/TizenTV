

const SERVER_URL = (function () {
//	var surl = "http://119.62.215.191:16330/";
	var surl = "http://10.0.102.2:16310/";
	return surl;
	try {
		surl = waeparams.getContentProviderPersistence("mainhosturl");
		if ( !!surl )  
			return surl ;
	}catch(e){}
		alert("Fatal: No server configuration!");
		return surl;
})();

const PROXY_URL= SERVER_URL + "wae/jsget.php";

var SKIP_AUTH_EACH_CHANNEL = true;
