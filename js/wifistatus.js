

function WifiStatus() {

	this.netobj = null;
	this.getRssiRate = function( maxRSSI ) {
		if ( this.netobj == null ) 
			try {
				this.netobj = wae.create("Net.NetworkManager");
			}catch(e){}
		if ( this.netobj == null )
			return;
		try {
			eval( "var netinfo = " + this.netobj.getWifiInfo() );
			if( !! netinfo && !!netinfo.SSID
                && netinfo.SSID != "none"
                && parseInt(netinfo.LinkSpeed) > 5
                && netinfo.IPADDR != "0.0.0.0"  ) {
				rssi =  netinfo.RSSI ;
				if ( rssi > -50 )
					return 3;
				else if ( rssi > -70 )
					return 2;
				else 
					return 1;
			}
		}catch(e) {}
		return 0;
	}

	this.images = ["image/wifi_weak.png","image/wifi_normal.png","image/wifi_strong.png","image/wifi_super.png"];
	this.lan_images = ["image/lan_ok.png","image/lan_fail.png"];
	this.fileobj = null;
	this.wifiIconEle = null;

	this.setWifiIcon = function( ) {
		if ( this.wifiIconEle == null )
			return;
		if( this.fileobj == null ) try {
			this.fileobj =  wae.create("DATA.File");
		}catch(e){}

		if( this.fileobj != null ) {
			var routes = this.fileobj.readAll("/proc/net/route");
			if ( routes.indexOf("eth0") > 0 ) {
				this.wifiIconEle.src=this.lan_images[0];
				this.wifiIconEle.style.display = "";
				return;
			}
		}
		var rssirate = this.getRssiRate();
		if ( this.images[rssirate] ) {
			this.wifiIconEle.src=this.images[rssirate];
			this.wifiIconEle.style.display = "";
		} else {
			this.wifiIconEle.style.display = "none";
		}
	}

	this.startUpdateTask = function() {
	    var scr = document.getElementsByTagName('SCRIPT');
	    var url = scr[scr.length - 1].src;
	    var wifiIconID = url.match(new RegExp("[\?\&]wifiID=([^\&]*)(\&?)","i"));
	    if (  !wifiIconID ) return;
	    this.wifiIconEle = document.getElementById(wifiIconID[1]);
	    if ( !this.wifiIconEle ) return;

	    if ( !!this.updateTimer ) clearInterval( this.updateTimer );
	    var _this = this;
	    this.updateTimer = setInterval( function(){
	    	_this.setWifiIcon();
	    }, 3000 );

	    this.setWifiIcon(); 
	}
}

var wifiStatus = new WifiStatus();

wifiStatus.startUpdateTask();




