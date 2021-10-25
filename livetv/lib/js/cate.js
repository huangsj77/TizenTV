
if( typeof( SERVER_URL ) == "undefined" ) {
	alert("系统错误，没有进行配置！");
}

const BOINFO_URL = SERVER_URL + "index.php/api?action=getlocalboss";

const CATELIST_URL= SERVER_URL + "index.php/api?action=angel&cat_id=";

const ITEMLIST_URL= SERVER_URL + "index.php/angel/api?action=getlist&cat_id=";

const MEDIAITEM_URL = SERVER_URL + "index.php/vod/api_new?action=getmedia&tv_id=";

const PHOTOITEM_URL = SERVER_URL + "index.php/photo/api?action=show&id=";

const MUSICITEM_URL = SERVER_URL + "index.php/music/api?action=show&id=";

const SHOPITEM_URL = SERVER_URL + "index.php/shop/api_new?action=show&id=";

const APPITEM_URL = SERVER_URL + "index.php/appstore/api_new?action=getappstore&id=";

const LIVE_URL = SERVER_URL + "index.php/live/api/type/";
const LIVESUB_URL = SERVER_URL + "index.php/live/api/get/";
const EPG_URL = SERVER_URL + "index.php/live/api_new?action=getmedia&pagesize=1000&page=1&retruntype=0&media_id=";

const INFO_URL= SERVER_URL + "index.php/vod/api_new?action=getmedia&tv_id=";

const AUTHINFO_URL = SERVER_URL + 'index.php/api?action=getlocalboss';

const FAVSET_URL = SERVER_URL + 'index.php/api?action=setrecord_all&dev_id={dev_id}&type=vod&id={tv_id}&cat_id={cat_id}&app_type={app_type}';
const FAVGET_URL = SERVER_URL + 'index.php/angel/api?action=getrecord_all&dev_id={dev_id}&cat_id={cat_id}&app_type={app_type}';
const FAVDEL_URL = SERVER_URL + 'index.php/api?action=delrecord_all&dev_id={dev_id}&type=vod&id={tv_id}&cat_id={cat_id}&app_type={app_type}';
const FAVSEL_URL = SERVER_URL + 'index.php/api?action=selrecord_all&dev_id={dev_id}&type=vod&id={tv_id}&cat_id={cat_id}&app_type={app_type}';


function CateList( ) {
	
	this.load = function( cid ) {
		this.cid = cid;
		if ( isNaN( parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			this.apiurl = CATELIST_URL + cid;
		}
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.category = _ugetdata.category;
			_this.onload(_this.category);
		}
		uget.open( this.apiurl );		
	}

	this.onload = function() {}
}

function ItemList( ) {
	this.load = function( cid , pageNo, pageSize ) {
		this.cid = cid;
		if ( isNaN( parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			this.apiurl = ITEMLIST_URL + cid;
		}

		this.pageNo   = isNaN(parseInt(pageNo))   ? 1  : parseInt(pageNo) ;
		this.pageSize = isNaN(parseInt(pageSize)) ? 20 : parseInt(pageSize) ;

		this.apiurl = this.apiurl + "&page="+ this.pageNo + "&pagesize=" + this.pageSize;
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.listInfo = _ugetdata.content;
			_this.totalCount = _ugetdata.pageinfo.total;
			_this.totalPage  = _ugetdata.pageinfo.allpage;
			_this.onload(_this.listInfo, _this.totalCount, _this.totalPage );
		}
		uget.open( this.apiurl );
	}

	this.onload = function() {};

	this.prev = function() {
		var prevPage = this.pageNo - 1;
		if ( prevPage < 1 ) prevPage = 1;
		this.load( this.cid, prevPage, this.pageSize );
	}

	this.next = function() {
		var nextPage = this.pageNo + 1;
		if ( !!this.totalPage && nextPage > this.totalPage ) nextPage = this.totalPage;
		this.load( this.cid, nextPage, this.pageSize );		
	}
}

function MediaItem() {
	this.load = function( mid ) {
		this.mid = mid;
		if ( isNaN(parseInt(mid)) ) {
			this.apiurl = mid;
		} else {
			this.apiurl = MEDIAITEM_URL + mid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata;
			eval( '_ugetdata = ' + d );
			_this.mediaInfo = _ugetdata.content;
			_this.sourceList = _ugetdata.source;
			_this.onload ( _this.mediaInfo , _this.sourceList );
		}
		uget.open( this.apiurl );
	}
	this.onload = function() {};
}

function PhotoItem() {
	this.load = function( mid ) {
		this.mid = mid;
		if ( isNaN( parseInt(mid)) ) {
			this.apiurl = mid;
		} else {
			this.apiurl = PHOTOITEM_URL + mid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.photoInfo = _ugetdata.photo;
			_this.onload(_this.photoInfo);
		}
		uget.open( this.apiurl );		
	}

	this.onload = function() {};
}

function MusicItem() {
	this.load = function( mid ) {
		this.mid = mid;
		if ( isNaN( parseInt(mid)) ) {
			this.apiurl = mid;
		} else {
			this.apiurl = MUSICITEM_URL + mid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.musicInfo = _ugetdata.musics;
			_this.onload(_this.musicInfo);
		}
		uget.open( this.apiurl );		
	}

	this.onload = function() {};
}

function ShopItem() {
	this.load = function( iid ) {
		this.iid = iid;
		if ( isNaN( parseInt(iid)) ) {
			this.apiurl = iid;
		} else {
			this.apiurl = SHOPITEM_URL + iid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.itemInfo = _ugetdata.goods;
			_this.onload(_this.itemInfo);
		}
		uget.open( this.apiurl );		
	}

	this.onload = function() {};	
}

function AppItem() {
	this.load = function( iid ) {
		this.iid = iid;
		if ( isNaN( parseInt(iid)) ) {
			this.apiurl = iid;
		} else {
			this.apiurl = APPITEM_URL + iid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.itemInfo = _ugetdata.content;
			_this.onload(_this.itemInfo);
		}
		uget.open( this.apiurl );		
	}

	this.onload = function() {};	
}

function LiveList() {
	this.id = null;
	this.load = function( cid , deviceid, skipcache ) {
		this.cid = cid;
		if( typeof(deviceid) != "undefined" && deviceid != "undefined" )
			this.id = deviceid;

		if ( isNaN(parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			if ( this.id == null || this.id == "null" || this.id == "undefined")
				this.apiurl = LIVE_URL + cid;
			else
				this.apiurl = LIVE_URL + cid + "/" + this.id;
		}
		
		console.log('LiveList =' + this.apiurl);
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function( u, d ) {
			var parser=new DOMParser();
		    var xmlDoc=parser.parseFromString(d,"text/xml");

		    var apps = xmlDoc.getElementsByTagName("apps")[0].getElementsByTagName("info");
		    _this.apps = [];
		    for( var i =0; i<apps.length; i++ ) {
		    	var item = {};
		    	for( var j=0; j<apps[i].attributes.length; j++ ) {
		    		var attr = apps[i].attributes.item(j);
		    		item[ attr.nodeName ] = attr.nodeValue;
		    	}
		    	_this.apps[i] = item;
		    }

		    var chns = xmlDoc.getElementsByTagName("content")[0].getElementsByTagName("info");
		    _this.chns = [];
		    for( var i =0; i<chns.length; i++ ) {
		    	var item = {};
		    	for( var j=0; j<chns[i].attributes.length; j++ ) {
		    		var attr = chns[i].attributes.item(j);
		    		item[ attr.nodeName ] = attr.nodeValue;
		    	}
		    	_this.chns[i] = item;
		    }

		    _this.onload( _this.chns , _this.apps );
		}
		uget.open( this.apiurl ,skipcache);
	}
	this.onload = function() {};
}


function LiveItemList() {
	this.id = null;
	this.load = function( cid, deviceid ,skipcache ) {
		this.cid = cid;
		if( typeof(deviceid) != "undefined" && deviceid != "undefined" )
			this.id = deviceid;

		if ( isNaN(parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			if ( this.id == null || this.id == "null" || this.id == "undefined")
				this.apiurl = LIVESUB_URL + cid;
			else
				this.apiurl = LIVESUB_URL + cid + "/" + this.id;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function( u, d ) {
			var parser=new DOMParser();
		    var xmlDoc=parser.parseFromString(d,"text/xml");

		    var chns = xmlDoc.getElementsByTagName("content")[0].getElementsByTagName("info");
		    _this.chns = [];
		    for( var i =0; i<chns.length; i++ ) {
		    	var item = {};
		    	for( var j=0; j<chns[i].attributes.length; j++ ) {
		    		var attr = chns[i].attributes.item(j);
		    		item[ attr.nodeName ] = attr.nodeValue;
		    	}
		    	_this.chns[i] = item;
		    }

		    _this.onload( _this.chns );
		}
		uget.open( this.apiurl , skipcache);
	}
	this.onload = function() {};
}

function EPGList() {
	this.onload = function() {}
	this.load = function( mid , skipcache) {
		// console.log("EPGList: load epg "  + mid )
		this.mid = mid;
		if ( isNaN( parseInt(mid)) ) {
			this.apiurl = mid;
		} else {
			this.apiurl = EPG_URL + mid;
		}
		// console.log("EPGList: try load epg "  + this.apiurl )

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata = null;
			try {
				eval( '_ugetdata  = ' + d );
			}catch(e){}
			if( _ugetdata == null ) {
				uget.onerror();
				return;
			}
			_this.mediaInfo = _ugetdata.medias;
			_this.onload(_this.mediaInfo);
		}
		uget.open( this.apiurl, skipcache );
	}
}


function Fav(deviceId, catId , app_type ) {
	this.app_type = "isMyStore";
	if ( !! app_type ) this.app_type = app_type;

	this.init = function( deviceId, catId ) {
		this.dev_id = deviceId;
		this.cat_id = catId;
	}
	this.init( deviceId, catId );
	this.is_fav = false;

	this.getListUrl = function() {
		var u = FAVGET_URL
						.replace("{app_type}", this.app_type)
						.replace("{dev_id}", this.dev_id)
						.replace("{cat_id}", this.cat_id);
		return u;		
	}

	this.add = function(tv_id) {
		var u = FAVSET_URL.replace( "{tv_id}", tv_id )
						.replace("{app_type}", this.app_type)
						.replace("{dev_id}", this.dev_id)
						.replace("{cat_id}", this.cat_id);
//		console.log("fav add : " + u );
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.is_fav = (_ugetdata.returncode != 0 );
			_this.oncheck( _this.is_fav );
		}
		uget.open( u );
	}

	this.del = function(tv_id) {
		var u = FAVDEL_URL.replace( "{tv_id}", tv_id )
						.replace("{app_type}", this.app_type)
						.replace("{dev_id}", this.dev_id)
						.replace("{cat_id}", this.cat_id);
//		console.log("fav del : " + u );
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.is_fav = (_ugetdata.returncode == 0 );
			_this.oncheck( _this.is_fav );
		}
		uget.open( u );
	}

	this.check = function( tv_id ) {
		var u =  FAVSEL_URL.replace( "{tv_id}", tv_id )
						.replace("{app_type}", this.app_type)
						.replace("{dev_id}", this.dev_id)
						.replace("{cat_id}", this.cat_id);
		//console.log("fav check : " + u );

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.is_fav = (_ugetdata.returncode != 0 );
			_this.oncheck( _this.is_fav );
		}
		uget.open( u );
	}
	this.oncheck = function( is_fav ) {}

	this.switch = function( tv_id ) {
		if ( ! this.is_fav ) 
			this.add( tv_id );
		else
			this.del( tv_id );
	}

}





