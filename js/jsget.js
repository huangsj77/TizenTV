


function JsGet() {
	if ( !JsGet.count ) {
		JsGet.count = 0;
	}

	this.rid = JsGet.count++;
	this.rname = "JsGet_" + this.rid;
	JsGet[this.rid] = this;

	this.onsuccess = function(url, data) {
		console.log("get data sucess: \n" + data );
	}

	this.onerror = function(url, e) {
		console.log("get : " + url + " : error : " + e );
	}

	this.open = function(url) {
		this.url = url;
		this.data = null;
		try {
			var body = document.body, script = document.createElement("script");

			script.type = "text/javascript";
			script.async = "async";
			script.id = this.rname;

			var sobj = document.getElementById(this.rname);
			if ( sobj ) {
				body.removeChild( sobj );
			}

			var _this = this;
			script.onload = function() {
				_this.onsuccess(_this.url, _this.data);
			};
			script.onerror = function(e) {
				_this.onerror(_this.url, e);
			};
			script.src = url;
			body.appendChild(script);
		} catch(e) {
			this.onerror();
		}
	}
}

function EasyGet() {
	this.onsuccess = function() {};
	this.onerror = function(e) {};
	this.url = null;

	if (  typeof(PROXY_URL) == "undefined" || ! PROXY_URL )
		this.proxyurl = "http://metro.tvata.com:10247/jsget/jsget.php";
	else
		this.proxyurl = PROXY_URL;

	this.clean = function( rurl ) {
		localStorage.removeItem(rurl);
	}

	this.update = function( rurl ) {
		var _this = this;
		var jsGet = new JsGet();

		jsGet.onsuccess = function(u,d) {
			localStorage.setItem(_this.url, d );
		}
		var purl = this.proxyurl + "/" + jsGet.rid + "?" + rurl;
		jsGet.open(purl);		
	}

	this.wae_retries = 0;
	this.openByWAE = function( rurl , skipcache ) {
		if ( typeof(iwae) == "undefined" )
			return false;

		var _this = this;
		if ( typeof(wae) == "undefined" ) {
			console.log("do some delay to load data to wait wae ready!");
			if ( this.wae_retries ++ > 10 ) {
				_this.onerror( rurl, "wae timeout" );
			}
			setTimeout( function(){
				_this.openByWAE(rurl,skipcache);
			}, 200 );
			return true;
		}

		this.wae_retries = 0;
		this.url = rurl;

		try {
			var hcobj = wae.create("Net.HttpClient");
			// console.log("openByWAE : " + rurl );
			hcobj.onComplete = (function( a ) {
				// console.log("openByWAE get: " + JSON.stringify(a) );
				this.onsuccess( this.url, a.arguments[2] );
			}).bind(this);
			hcobj.onError = (function( a) {
				console.log("openByWAE get error " + JSON.stringify(a) );
				this.onerror( this.url, a.arguments[2] );
			}).bind(this);
			var res = null;
			if( ! skipcache ) {
				res = hcobj.getWithAsync2(rurl); 
			} else {
				res = hcobj.getWithAsync(rurl); 
			}
			return true;
		}catch(e){
			// alert( e );
			console.log("openByWAE meet expection: " + e );
		}
		return false;
	}

	this.openByJsGet = function( rurl , skipcache ) {
		this.url = rurl;
		var _this = this;

		if ( ! skipcache ) {
			var d = localStorage.getItem( rurl );
			if ( d && d != "false" ) {
				setTimeout( function() {
						_this.onsuccess( rurl, d );
					}, 100);
				this.update( rurl );
				return true;
			}			
		}

		var jsGet = new JsGet();

		jsGet.onsuccess = function(u,d) {
			localStorage.setItem(_this.url, d );
			_this.onsuccess( _this.url, d );
		}
		jsGet.onerror = function(u,e) {
			_this.onerror( _this.url, e);
		}

		var purl = this.proxyurl + "/" + jsGet.rid + "?" + rurl;
		jsGet.open(purl);
		return true;
	}

	this.open = function( rurl, skipcache ) {
		if ( this.openByWAE(rurl, skipcache) == true )
			return;
		this.openByJsGet(rurl,skipcache );
	}

	this.open_with_cache = function( rurl , server_cache_sec ) {
		this.url = rurl;
		var _this = this;

		var jsGet = new JsGet();

		jsGet.onsuccess = function(u,d) {
			localStorage.setItem(_this.url, d );
			_this.onsuccess( _this.url, d );
		}
		jsGet.onerror = function(u,e) {
			_this.onerror( _this.url, e);
		}

		var purl = this.proxyurl + "/" + jsGet.rid + "?c=" + server_cache_sec + "&u=" + encodeURIComponent(rurl);
		console.log("send proxy request : " + purl );
		jsGet.open(purl);
		return true;
	}
}


function SimpleAJAX() {
    this.xmlHttp = new XMLHttpRequest();

    this.get = function( url ) {
        this.xmlHttp.open("GET", url, false);
        this.xmlHttp.send(null);
        return this.xmlHttp.responseText;
    }
}
var sAjax = new SimpleAJAX();
