


const SERVER_URL = (function () {
    var scr = document.getElementsByTagName('SCRIPT');
    var url = scr[scr.length - 1].src;
    var surl = url.match(new RegExp("[\?](.*)","i"));
    if( !!surl && !!surl[1] && surl[1].indexOf("http://") >= 0) {
    	return surl[1];
    }

	try {
		var surl = waeparams.getContentProviderPersistence("mainhosturl");
		if ( !!surl && surl.indexOf( "http://") >= 0 )  
			return surl ;
	}catch(e){}
})();


const PROXY_URL = "http://bo.fengsui.com.tw:10245/ext/jsget.php";

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

const DEF_CATE=1753;

const PHOTO_DEFCATE = 1824;

const LIST_URL= CATELIST_URL;

const SEARCHID_URL = SERVER_URL + "index.php/angel/api?action=search_id&cat_name=";



