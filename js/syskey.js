
function SysKey() {
}

SysKey.disableBack = function() {
		if ( typeof(iwae) == "undefined" ) 
			return;
		if ( typeof(wae) == "undefined" ) {
			var _this = this;
			setTimeout( function(){ _this.disableBack();} , 1000 * 3 );
			return;
		}
		  var eventListener = wae.create("EventListener");
		  eventListener.addCurKey( 4 );
		  eventListener.addCurKey( 111 );		
}
