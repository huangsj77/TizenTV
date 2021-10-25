
function AuthInfo() {
	this.hasLoad = false;
	this.onload = function() {};
	try {
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = (function(u,d) {
			// alert( u + "\n\n" + d );
			console.log( u + "\n\n" + d);
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			this.info = _ugetdata;
			if ( ! this.info.auth_url 
				|| this.info.auth_url.length < 5
				|| this.info.auth_url.indexOf("103.89.176.114") > 0 
				) {
				this.info.auth_url = SERVER_URL.replace( /\/$/, "" );
			}
			this.onload( this.info);
			this.hasLoad = true;
		}).bind(this);
		console.log("deviceinfo===" +AUTHINFO_URL);
		uget.open( AUTHINFO_URL );
	}catch(e){ }
}

function DeviceInfo() {
	this.authInfo = null;
	this.id = null;
	this.load = function() {
		if ( this.authInfo == null ) {
			this.authInfo = new AuthInfo();
		}
		if ( this.authInfo.hasLoad == false ) {
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

		if( ! this.authInfo.info.auth_url ) {
			this.onloaderror();
			return;
		}

		this.info_url = this.authInfo.info.auth_url + "/index.php/localboss/api/getinfo/" + this.id;
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata = null;
			try{
				eval( '_ugetdata  = ' + d );
			}catch(e){}
			_this.info = _ugetdata;
			_this.onload(_this.info);
		}
		uget.onerror = function(e) {
			var hc = wae.create("Net.HttpClient");
			var res = hc.getWithSyncByCache(this.info_url);
			var dinfo = null;
			try {
				eval( "dinfo = " + res );
			}catch(e){}
			_this.info = dinfo;
			_this.onload( dinfo );
		}
		uget.open( this.info_url , true);	
	}

	this.onload = function() {};


	this.getID = function() {
		if( typeof tizen ) {
			function errorCallback(err) {
			    console.log('Error occurred ' + err.code)
			};

			tizen.systeminfo.getPropertyValue('ETHERNET_NETWORK', (function(netinfo) {
	            console.log("Ethernet status: "+ JSON.stringify(netinfo));
	            //{"cable":"ATTACHED",
	            //"status":"CONNECTED",
	            //"ipAddress":"10.0.2.15",
	            //"ipv6Address":"fec0::5054:ff:fe12:3456",
				//"macAddress":"52:54:00:12:34:56"}
				this.id = "m" +netinfo.macAddress.replace(/:/g,'');
				localStorage.setItem("DeviceInfo_tizen", this.id); 
			}).bind(this), errorCallback);
			return this.id;
			//  return this.oninitID( this.id );
		}

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

	this.getNumID = function() {
		var id = this.getID();
		if ( id == null ) return null;

		return parseInt( id.substring(1), 16);
	}
}