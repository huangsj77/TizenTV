

function Auth() {

	this.id = null;
	this.initID = function(){
		if (  !!this.id )  return this.oninitID( this.id );
		this.id = localStorage.getItem("DeviceInfo_RID");
		if (  !!this.id )  return this.oninitID( this.id );

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
		var d = sessionStorage.getItem("AUTH_INFO_RES");
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
			sessionStorage.setItem("AUTH_INFO_RES", d);
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
		var act_url = this.info.auth_url + '/index.php/api/activate?device=' + this.id + '&license=' + lid ;
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
		var act_url = this.info.auth_url + '/index.php/localboss/api/licensegetreg?device=' + this.id + '&license=' + lid ;
		// console.log( act_url );
		var hc = wae.create("Net.HttpClient");
		var res = hc.getWithSync( act_url );
		// console.log(res);
		return res;	
	}

	this.check = function( power ) {
		if ( this.id == null || this.info == null ) {
			this.oninit = function() {
				this.check(power);
			}
			this.init();
			return;
		}

		var auth_url = this.info.auth_url + '/index.php/localboss/api/chkpower?device_id='+this.id+'&power='+power+'&localstatue=no';
		this.auth_url = auth_url;
		if ( this.info.status == 1 ) {
			if( this.info.isdebug == 1 ) {
				var uget = new EasyGet();
				uget.onsuccess = function(u,d) {
					// skip return, just send the request for debug
				}
				uget.open( auth_url, true );	
			} 
			this.onauth( true , null);
			return;
		} 
		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
				var _ugetdata ;
				eval( '_ugetdata  = ' + d );
				_this.res = _ugetdata;
				if ( _this.res.returnCode > 0 )
					_this.onauth(true, _this.res );
				else
					_this.onauth(false, _this.res);
		}
		uget.onerror = function(e) {
			_this.check_old( power, uget );
		}
		uget.open( auth_url , true );
	}

	this.check_old = function( power , uget ) {
		var auth_url = this.info.auth_url + '/index.php/api/chkpower?device_id='+this.id+'&power='+power+'&localstatue=no';
		this.auth_url = auth_url;
		// console.log("auth_url old: " + auth_url );
		var _this = this;
		uget.onsuccess = function(u,d) {
				var _ugetdata ;
				eval( '_ugetdata  = ' + d );
				_this.res = _ugetdata;
				if ( _this.res.returnCode > 0 )
					_this.onauth(true, _this.res );
				else
					_this.onauth(false, _this.res);
		}
		uget.open( auth_url , true );
	}

	this.onauth = function( is_ok, res ) {}

	this.check_sync_hcobj = null;
	this.check_sync = function( power ) {
		// console.log("id : " + this.id );
		// console.log("info:" + JSON.stringify(this.info));
		if ( this.id == null || this.info == null ) {
			return null;
		}
		if ( this.info.status == 1 ) {
			return true;
		}
		var auth_url = this.info.auth_url + '/index.php/localboss/api/chkpower?device_id='+this.id+'&power='+power+'&localstatue=no';
		if( this.check_sync_hcobj == null ) {
			this.check_sync_hcobj = wae.create("Net.HttpClient");
		}
		var res = this.check_sync_hcobj.getWithSyncByCache( auth_url );
		// console.log("get " + res + " : " + auth_url );
		try {
			var r = JSON.parse( res );
			if ( r.returnCode > 0 ) return true;
			return false;
		}catch(e){
			console.log("json data ex: " + e );
		}
		return false;
	}
}


