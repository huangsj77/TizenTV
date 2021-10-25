
function BOInfo( ) {
	
	this.info = null;	
	this.load = function( ) {
		var url = BOINFO_URL;

		var _this = this;
		var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _boinfo ;
			eval( '_boinfo  = ' + d );
			_this.info = _boinfo;
			_this.onload(_this.info);
		}
		uget.open( url );
	}

	this.onload = function() {}
}
