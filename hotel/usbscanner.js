
function USBScanner() {
	this.onfail = function() {};
	this.onfound = function() {};
	this.onnotfound = function() {};

	this.scan = function() {
		if ( typeof(iwae) == "undefined" ) {
			console.log("not run on box!");
			this.onfail();
			return;
		}
		var _this = this;
		if ( typeof(wae) == "undefined" ) {
			setTimeout( function() { _this.scan();} , 1000 );
			return;
		}
		setTimeout( function() { _this.do_scan();} , 1000 );
		this.videos = null;
	}

	this.do_scan = function() {
		var file_obj = wae.create("DATA.File");
  		var mlines = file_obj.readAll("/proc/mounts").split(/[\n\r]+/);
		var cpath = [ ];
		for( var i = 0 ; i< mlines.length; i++ ) {
    		var paths = mlines[i].split(/\s+/);
    		if ( ! paths[1] ) continue;
    		if ( paths[0].indexOf("/dev") != 0 ) continue;
    		if ( paths[1].indexOf("/", 2) <= 0 ) continue;
    		if ( ! file_obj.isDir( paths[1] ) ) continue;

    		var vpath = paths[1];
    		cpath.push( vpath );
  	}

		var vfile = [];
  		for( var i =0; i<cpath.length; i++ ) {
			var list = null;
			try {
      			eval( "list = " + file_obj.list( cpath[i] ) );
      		}catch(e){
      			continue;
      		}
      		if ( list == null || !list.length )
      			continue;

      		for( var j=0; j<list.length;j++ ) {
        		if ( list[j].charAt(0) == '.' ) {
          			continue;
        		}
        		if ( list[j].toLowerCase().indexOf(".mp4") >=0 
          			|| list[j].toLowerCase().indexOf(".m4v") >=0
          			|| list[j].toLowerCase().indexOf(".flv") >=0
          			|| list[j].toLowerCase().indexOf(".ts") >=0
          			|| list[j].toLowerCase().indexOf(".mkv") >=0
          			|| list[j].toLowerCase().indexOf(".wmv") >=0
          			|| list[j].toLowerCase().indexOf(".asf") >=0
          			|| list[j].toLowerCase().indexOf(".rmvb") >=0
           		) {
            		var f = cpath[i] + "/" + list[j] ;
            		vfile.push ( f );
        		}
      		}
    
  		}
  		if ( vfile.length > 0 ) {
  			this.videos = vfile;
  			this.onfound ( vfile );
  			return;
  		}
  		this.onnotfound();
	}
}