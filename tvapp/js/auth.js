
function Auth() {
	var uget = new EasyGet();
	uget.onsuccess = function(u,d) {
		eval( 'Auth.info = ' + d );

		var auth_url = Auth.info.auth_url;

		if ( auth_url.indexOf("http://:") == 0 ) {
			auth_url = SERVER_URL.replace( /:\d.*$/ , ":" ) + auth_url.substring(8);
			Auth.info.auth_url = auth_url;
		}

	}
	uget.open( AUTHINFO_URL );

	this.onsuccess = function() {};
	this.onfail = function() {};

	this.check = function( did, power ) {
		if ( ! Auth.info ) {
			this.onfail("no auth info");
			return;
		}
		if ( Auth.info.status == "0" || Auth.info.status == 0 ) {
			this.onsuccess();
			return;
		}

		var _this = this;
		var url = Auth.info.auth_url + "index.php/api/chkpower?device_id=" + did + "&power=" + power + "&localstatue=no";
		uget.onsuccess = function(u,d) {
			eval( 'Auth.result=' + d);
			var res = parseInt( Auth.result.returnCode );
			if (  res > 0 ) {
				_this.onsuccess();
				return;
			}
			if ( Auth.info.isdebug == "1" || Auth.info.isdebug == 1 ) {
				_this.onsuccess();
				return;
			}
			_this.onfail(Auth.result.returnMsg);
		}
	}
}

