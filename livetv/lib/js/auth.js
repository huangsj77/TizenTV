

function Auth() {

	this.id = null;
	this.initID = function(){
		if (  !!this.id )  return this.oninitID( this.id );
		this.id = localStorage.getItem("DeviceInfo_RID");
		if (  !!this.id )  return this.oninitID( this.id );

		if( typeof tizen ) {
			function errorCallback(err) {
			    console.log('Error occurred ' + err.code)
			};

			tizen.systeminfo.getPropertyValue('ETHERNET_NETWORK', function(netinfo) {
	            console.log("Ethernet status: "+ JSON.stringify(netinfo));
	            //{"cable":"ATTACHED",
	            //"status":"CONNECTED",
	            //"ipAddress":"10.0.2.15",
	            //"ipv6Address":"fec0::5054:ff:fe12:3456",
	            //"macAddress":"52:54:00:12:34:56"}
	            
	            this.id = "m" +netinfo.macAddress.replace(/:/g,'');
	            localStorage.setItem("DeviceInfo_RID", this.id); 
	        }, errorCallback);
			
			 return this.oninitID( this.id );
		}
		
		if ( typeof(iwae) == "undefined" ) {
			// running on browser
			this.id = "R";
			for(var i=0;i<12;i++) 
				this.id += Math.ceil(Math.random()*16).toString(16);
			localStorage.setItem("DeviceInfo_RID", this.id);
			return this.oninitID( this.id );
		}

		if ( typeof( wae ) == "undefined" ) {
			var _this = this;
			setTimeout( function(){ _this.initID(); }, 500 );
			return;
		}

		
		var device_obj = wae.create("Devices");
		this.id = device_obj.getDeviceID();
		localStorage.setItem("DeviceInfo_RID", this.id);
		return this.oninitID( this.id );
	}
	this.oninitID = function(id) {}


	this.getID = function() {
			return this.id;
	}
	this.getNumID = function() {
		var id = this.getID();
		if ( id == null ) return null;

		return parseInt( id.substring(1), 16);
	}

	this.info = null;
	this.initInfo = function() {
		var d = localStorage.getItem("AUTH_INFO_RES");
		if ( !!d ) {
			eval( '_ugetdata  = ' + d );
			this.info = _ugetdata;
			this.oninitInfo(this.info);
			return;			
		}

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			eval( '_ugetdata  = ' + d );
			localStorage.setItem("AUTH_INFO_RES", d);
			_this.info = _ugetdata;
			_this.oninitInfo(_this.info);
		}
		uget.open( AUTHINFO_URL );	
	}
	this.oninitInfo = function( info ) {}


	this.oninit = function() {}
	this.init = function() {
		this.oninitID = function() {
			this.oninitInfo = function() {
				this.oninit();
			}
			this.initInfo();
		}
		this.initID();
	}

	this.onactivate = function(res) {}

	this.activate = function( lid ) {
		if ( this.id == null || this.info == null ) {
			this.oninit = function() {
				this.activate( lid );
			}
			this.init();
			return;
		}
		var act_url = this.info.auth_url + '/index.php/localboss/api/activate?device=' + this.id + '&license=' + lid ;
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
				var _ugetdata ;
				eval( '_ugetdata  = ' + d );
				_this.res = _ugetdata;
				_this.onactivate( _this.res );
		}
		uget.open( act_url , true );
	}

	this.activate2 = function( lid ) {
		var act_url = this.info.auth_url + '/index.php/localboss/api/activate?device=' + this.id + '&license=' + lid ;
		var hc = wae.create("Net.HttpClient");
		var res = hc.getWithSync( act_url );
		return res;	
	}

	this.newmode = true;

	this.loadinfo = function() {

		if ( this.id == null ) {
			this.oninit = function() {
				this.loadinfo();
			}
			this.init();
			return;
		}
		var authinfo_url = this.info.auth_url + "/index.php/localboss/api/getinfo/" + this.getID();
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			try {
				eval( '_ugetdata  = ' + d );
			}catch(e){
				this.onerror(e);
				return;
			}
			_this.devinfo = _ugetdata;
			_this.onloadinfo(_this.devinfo );
		}
		uget.onerror = function() {
			_this.loadinfo_old();
		}
		uget.open( authinfo_url , true);
	}

	this.loadinfo_old = function() {
		var authinfo_url = this.info.auth_url + "/index.php/api/getinfo/" + this.getID();			
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			try {
				eval( '_ugetdata  = ' + d );
			}catch(e){
				this.onerror(e);
				return;
			}
			_this.devinfo = _ugetdata;
			_this.onloadinfo(_this.devinfo );
			_this.newmode = false;
		}
		uget.onerror = function() {
			alert("Fatal: connect auth server failed!");
		}
		uget.open( authinfo_url , true);
	}
	
	this.onloadinfo = function( authinfo ) { }

	this.check = function( power ) {
		if ( this.id == null || this.info == null ) {
			this.oninit = function() {
				this.check(power);
			}
			this.init();
			return;
		}

		var auth_url ;

		if ( this.newmode == true ) {
			auth_url = this.info.auth_url + '/index.php/localboss/api/chkpower?device_id='+this.id+'&power='+power+'&localstatue=no';
		}else {
			auth_url = this.info.auth_url + '/index.php/api/chkpower?device_id='+this.id+'&power='+power+'&localstatue=no';
		}
		if ( this.info.status == 1 ) {
			if( this.info.isdebug == 1 ) {
				var uget = new EasyGet();
				uget.onsuccess = function(u,d) {
					// skip return, just send the request for debug
				}
				uget.open( auth_url, true );	
			} 
			this.onauth( true , null, power);
			return;
		} 
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			// console.log("check power: "  + u + "\n" + d );
			try {
				var _ugetdata ;
				eval( '_ugetdata  = ' + d );
				_this.res = _ugetdata;
				if ( _this.res.returnCode > 0 )
					_this.onauth(true, _this.res, power );
				else
					_this.onauth(false, _this.res, power);
				return;
			}catch(e){}
			_this.onauth(false, null, power );
		}
		uget.open( auth_url , true );
	}
	this.onauth = function( is_ok, res ) {}
}


