


const SERVER_URL = (function () {
//	var surl = "http://119.62.215.191:16330/";
	var surl = "http://10.0.102.2:16310/";
	return surl ;
	try {
		//var surl = waeparams.getContentProviderPersistence("mainhosturl");
		if ( !!surl )  return surl ;
	}catch(e){}
	alert("Fatal: No server configuration!");
})();


const PROXY_URL= SERVER_URL.replace(/\/+$/,"") + "/jsget/jsget.php";

const BOINFO_URL = SERVER_URL + "index.php/api?action=getlocalboss";

const CATELIST_URL= SERVER_URL + "index.php/api?action=angel&cat_id=";

const ITEMLIST_URL= SERVER_URL + "index.php/angel/api?action=getlist&cat_id=";

const MEDIAITEM_URL = SERVER_URL + "index.php/vod/api_new?action=getmedia&tv_id=";

const PHOTOITEM_URL = SERVER_URL + "index.php/photo/api?action=show&id=";

const MUSICITEM_URL = SERVER_URL + "index.php/music/api?action=show&id=";

const SHOPITEM_URL = SERVER_URL + "index.php/shop/api_new?action=show&id=";

const APPITEM_URL = SERVER_URL + "index.php/appstore/api_new?action=getappstore&id=";

const LIVE_URL = SERVER_URL + "index.php/live/api/type/";

const INFO_URL= SERVER_URL + "index.php/vod/api_new?action=getmedia&tv_id=";

const AUTHINFO_URL = SERVER_URL + 'index.php/api?action=getlocalboss';

const PUSH_URL = SERVER_URL + 'index.php/photo/api?action=setimgs&photo_id={RID}&name={NAME}&roomNo={ROOM}&about={MSG}&other_info={OTHER}';


