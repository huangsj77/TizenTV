

function PortalData() {
	this.xmlHttp = new XMLHttpRequest();

	this.get = function( url ) {
		this.xmlHttp.open("GET", url, false);
		this.xmlHttp.send(null);
		return this.xmlHttp.responseText;
	}

	this.portalmodule = null;
	this.portaldata = null;

	this.getPortalModule = function () {
		if ( this.portalmodule != null )
			return this.portalmodule;
		var portal_json = sessionStorage.getItem("portal.json");
		portal_json = this.get(SERVER_URL + "download/portal/portal.json");
		eval( "this.portalmodule = " + portal_json );
		return this.portalmodule;
	}

	this.getPortalData = function () {
		var portalall_json = this.get(SERVER_URL +  "download/portal/version_all.json");
		eval( "this.portalall = " + portalall_json );
		this.portaldata = {};
		for( var i = 0; i < this.portalall.portallist.length; i++ ) {
		    var d  = this.portalall.portallist[i];
		    this.portaldata [ d.id ] = d;
		}
		return this.portaldata;
	}
}

var portalData = new PortalData();

