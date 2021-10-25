


const SERVER_URL = (function () {
	try {
//		var surl = waeparams.getContentProviderPersistence("SERVERURL");
		var surl = waeparams.getContentProviderPersistence("mainhosturl");
		if ( !!surl && surl.indexOf( "http://") >= 0 )  
			return surl ;
	}catch(e){}    	

	alert("config error!");
	return "";
})();


const PROXY_URL = SERVER_URL + "wae/jsget.php";

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

