
function CateList( ) {
	this.skipcache = false;
	this.load = function( cid ) {
		this.cid = cid;
		if ( isNaN( parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			this.apiurl = CATELIST_URL + cid;
		}

		console.log("catelisturl=" + this.apiurl);
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.category = _ugetdata.category;
			_this.from = _ugetdata.from;
			_this.onload(_this.category, _this.from);
		}
		uget.open( this.apiurl ,this.skipcache );		
	}

	this.onload = function() {}
}

function ItemList( ) {
	this.skipcache = false;
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
		uget.open( this.apiurl ,this.skipcache );
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
	this.skipcache = false;
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
		uget.open( this.apiurl ,this.skipcache);
	}
	this.onload = function() {};
}

function PhotoItem() {
	this.skipcache = false;
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
		uget.open( this.apiurl ,this.skipcache );		
	}

	this.onload = function() {};
}

function MusicItem() {
	this.skipcache = false;
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
		uget.open( this.apiurl,this.skipcache );		
	}

	this.onload = function() {};
}

function ShopItem() {
	this.skipcache = false;
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
		uget.open( this.apiurl,this.skipcache );		
	}

	this.onload = function() {};	
}

function AppItem() {
	this.skipcache = false;
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
		uget.open( this.apiurl ,this.skipcache);		
	}

	this.onload = function() {};	
}

function LiveList() {
	this.skipcache = false;
	this.load = function( cid ,pageNo, pageSize ) {
		this.cid = cid;
		if ( isNaN(parseInt(cid)) ) {
			this.apiurl = cid;
		} else {
			this.apiurl = LIVE_URL + cid;
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function( u, d ) {
			var parser=new DOMParser();
		    var xmlDoc=parser.parseFromString(d,"text/xml");
		    var apps = xmlDoc.getElementsByTagName("apps")[0].getElementsByTagName("info");
		    var chns = xmlDoc.getElementsByTagName("content")[0].getElementsByTagName("info");
		    _this.apps = apps;
		    _this.chns = chns;
		    _this.onload( chns , apps );
		}
		uget.open( this.apiurl,this.skipcache );
	}

	this.onload = function() {};
}

function PushMessage() {
	this.push = function( rid, name, room, msg, other ) {
		var url = PUSH_URL.replace("{RID}" , rid)
					.replace("{NAME}", encodeURIComponent(name) )
					.replace("{ROOM}", encodeURIComponent(room) )
					.replace("{MSG}",  encodeURIComponent(msg)  )
					.replace("{OTHER}", encodeURIComponent(other) );

		// alert(url);
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			_this.onpush();
		}
		uget.open( url, true );
	}
}


function SearchID() {
	this.load = function( catname ) {
		this.apiurl = SEARCHID_URL + encodeURIComponent (catname);
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			_this.onload( d , u);
		}
		uget.open( this.apiurl, true );		
	}

	this.onload = function( idstr ) {};		
}



