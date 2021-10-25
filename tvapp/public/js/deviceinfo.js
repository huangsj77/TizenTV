
function AuthInfo() {
	this.hasLoad = false;
	this.onload = function() {};

	var _this = this;
	var uget = new EasyGet();
	uget.onsuccess = function(u,d) {
		var _ugetdata ;
		eval( '_ugetdata  = ' + d );

		var auth_url = _ugetdata.auth_url;

		if ( auth_url.indexOf("http://:") == 0 ) {
			auth_url = SERVER_URL.replace( /:\d.*$/ , ":" ) + auth_url.substring(8);
			_ugetdata.auth_url = auth_url;
		}


		_this.info = _ugetdata;
		_this.onload(_this.info);
		_this.hasLoad = true;
	}
	uget.open( AUTHINFO_URL );		
}
var authInfo = new AuthInfo();

function DeviceInfo() {
	this.id = null;
	this.load = function() {
		if ( authInfo.hasLoad == false ) {
			var _this = this;
			setTimeout( function() { _this.load(); } , 1000 );
			console.log("Wait AuthInfo Ready!");
			return;
		}
		if ( this.getID() == null ) {
			var _this = this;
			setTimeout( function() { _this.load(); } , 1000 );
			console.log("Wait Device ID Ready!");
			return;
		}

		this.info_url = authInfo.info.auth_url + "/index.php/localboss/api/getinfo/" + this.id;
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			_this.info = _ugetdata;
			_this.onload(_this.info);
		}
		uget.onerror = function(e) {
			var hc = wae.create("Net.HttpClient");
			var res = hc.getWithSyncByCache(this.info_url);
			eval( "var dinfo = " + res );
			this.info = dinfo;
			this.onload( dinfo );
		}
		uget.open( this.info_url , true);	
	}

	this.onload = function() {};

	this.getID = function() {
		if ( this.id != null )
			return this.id;
		var id = localStorage.getItem("DeviceInfo_RID");
		if ( !!id ) {
			this.id = id;
			return this.id;
		}

		if ( typeof(iwae) == "undefined" ) {
			// running on browser
			var id = "R";
			for(var i=0;i<12;i++) 
				id+= Math.ceil(Math.random()*16).toString(16);
			localStorage.setItem("DeviceInfo_RID", id);
			this.id = id;
			return id;
		}

		if ( typeof( wae ) == "undefined" ) {
			return null;
		}
		var device_obj = wae.create("Devices");
		id = device_obj.getDeviceID();
		this.id = id;
		return this.id;
	}
}
