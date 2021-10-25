
function PortalData() {
  var portal_json = "";
  try {
    portal_json = sAjax.get("../portal.json");  
  }catch(e) {
    portal_json = sAjax.get("./_debug/portal.json"); 
  }
  eval( "var _portal = " + portal_json );



  var portalall_json = "";
  try {
        portalall_json = sAjax.get("../version_all.json");
  }catch(e) {
        portalall_json = sAjax.get("./_debug/version_all.json");
  }
  eval( "var _portalall = " + portalall_json );

  this.portal = _portal;
  this.portalall = _portalall;

  this.getPortalList = function() {
  	return this.portal.portallist;
  }

  this.getPortalModule = function () {
      return this.portal;
  }
  this.getDefaultPortal = function() {
  	var pl = this.portal.portallist;
  	for( var i=0;i<pl.length;i++) {
  		if ( pl[i].defaultinit == "1" )
  			return pl[i];
  	}
  	return pl[0];
  }
  this.findIndexByUrl = function(url) {
  	var burl = url.replace( /.*\//, "");
  	var pl = this.portal.portallist;
  	for( var i=0;i<pl.length;i++) {
  		if ( pl[i].app_index.indexOf( burl) >= 0 )
  			return i;
  	}
  	return -1;
  }

  this.getPortalData = function( idx ) {
  	return this.portalall.portallist[idx];
  }
}
