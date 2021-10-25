
var server_url=waeparams.getContentProviderPersistence("SERVERURL");
if ( !server_url || server_url.indexOf( "http://") < 0 ) server_url = "http://bo.fengsui.com.tw:10245/";
//alert( server_url)

const SERVER_URL=server_url ; //"http://bo.fengsui.com.tw:10245/";

const PROXY_URL = "http://bo.fengsui.com.tw:10245/ext/jsget.php";


const CATELIST_URL= SERVER_URL + "index.php/api?action=angel&cat_id=";

const ITEMLIST_URL= SERVER_URL + "index.php/angel/api?action=getlist&cat_id=";

const PHOTOITEM_URL = SERVER_URL + "index.php/photo/api?action=show&id=";

const MUSICITEM_URL = SERVER_URL + "index.php/music/api?action=show&id=";

const SHOPITEM_URL = SERVER_URL + "index.php/shop/api_new?action=show&id=";

const APPITEM_URL = SERVER_URL + "index.php/appstore/api_new?action=getappstore&id=";

const LIVE_URL = SERVER_URL + "index.php/live/api/type/";



const PHOTO_DEFCATE = 1824;



const LIST_URL= CATELIST_URL;

const INFO_URL= SERVER_URL + "index.php/vod/api_new?action=getmedia&tv_id=";

const AUTHINFO_URL = SERVER_URL + 'index.php/api?action=getlocalboss';

const DEF_CATE=1753;


