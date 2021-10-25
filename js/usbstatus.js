
function UsbStatus() {
	this.mediaEvent = null;

	this.initMediaEvent = function() {
		if ( this.mediaEvent == null ) {
			try{
				this.mediaEvent =  wae.create("mediaEvent");
				var _this = this;
				this.mediaEvent.onMounted = function() {
					_this.onMounted();
				}
				this.mediaEvent.onUnMounted = function() {
					_this.onUnMounted();
				}
				if ( this.mediaEvent.hasUsbMounted() ) {
					_this.onMounted();
				} else {
					_this.onUnMounted();
				}
				return true;
			}catch(e){}
		}
		if ( this.mediaEvent == null )
			return false;
	}

	this.onUnMounted = function() {}

	this.onMounted = function() {}

	this.usbIconEle  = null;
	this.startUpdateTask = function() {
	    var scr = document.getElementsByTagName('SCRIPT');
	    var url = scr[scr.length - 1].src;
	    var usbID = url.match(new RegExp("[\?\&]usbID=([^\&]*)(\&?)","i"));
	    if (  !usbID ) return;
	    this.usbIconEle = document.getElementById(usbID[1]);
	    if ( !this.usbIconEle ) return;

	    this.onMounted = function() {
	    	this.usbIconEle.style.display = "";
	    }
	    this.onUnMounted = function() {
	    	this.usbIconEle.style.display = "none";
	    }
	    this.initMediaEvent();
	}	
}

var usbStatus = new UsbStatus();

usbStatus.startUpdateTask();

