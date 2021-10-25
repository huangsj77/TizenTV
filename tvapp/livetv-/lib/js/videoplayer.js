
var utilObj = null;
function getSecUrl( url ) {
	if ( url.indexOf("{TID}") < 0 ) {
		return url;
	}

	if ( ! utilObj ) {
		utilObj = wae.create("Utils.Utils");
	}

	var uri =  url.replace(/http:\/\/127.0.0.1.*?url=/, "").replace(/http:\/\/.*?\//, "/").replace( /\?.*$/, "");
	var tid = Math.floor( 10000000 + (Math.random() * 8999999 ));
	var seed= "tvata nginx auth module";
	var day = Math.floor( (new Date()).getTime() / 1000 / 3600 / 24 );

	var checkdata = seed + uri + tid + day ;
	var checksum1 = utilObj.md5( checkdata );
	var rurl = url.replace( /\{TID\}/, tid ).replace( /\{TSUM\}/, checksum1 );

	if ( rurl.indexOf("http://127") < 0 ) {
		rurl = "http://127.0.0.1:14188/playlist/play.m3u8?url=" + rurl;
	}
	// console.log( rurl );
	return rurl;
}

function VideoPlayer() {
	this.isPlaying = false;
	this.player = null;
	this.chkTimer = null;
	this.playIdx = -1;
	this.murls = [];
	this.bindEle = null;

	this.init = function(  ) {
		if( this.player != null ) {
			this.oninit();
			return;
		}
		if ( typeof(wae) == "undefined" ) {
			var _this = this;
			setTimeout( function(){ _this.init(); }, 1000 );
			return;
		}
		this.errorcount = 0;
		this.player = wae.create("Media.VideoPlayer");
		this.player.setOnErrorListener();
		this.player.BufferSwitch(2);
		this.fullscreenMode = false;

		var _this = this;
		this.player.onError = function(e) {
			_this.errorcount++;
			console.log( "play error errorcount " + _this.errorcount );
			clearTimeout( _this.chkTimer );
			_this.chkTimer = setTimeout( function() {
					_this.playnext();
				} , 1000 );
			_this.onplayerror();
		}
		this.player.onCompletion = function(e) {
			console.log( "play over " );
			_this.errorcount = 0;
			clearTimeout( _this.chkTimer );
			_this.chkTimer = setTimeout( function() {
					_this.playnext();
				} , 1000 );
		}
		this.player.onBufferingUpdate = function(e) {
			_this.errorcount = 0;
			//console.log("onBufferingUpdate: "  + JSON.stringify(  e.arguments ) );
			_this.onbuffering( e.arguments[1], e.arguments[2] );
		}
		this.player.onPrepared = function() {
			if ( _this.fullscreenMode == false && !! _this.bindEle ) {
				var r = _this.getRect();
				if ( r.w <= 0 ) {
					_this.player.stop();
					_this.player.hide();
					_this.isPlaying = false;
					return false;
				}

				_this.player.setLocation( r.w+2, r.h+2 , r.x, r.y );
			} else {
				console.log("setFullScreen ");
				_this.player.setFullScreen();
				//_this.player.setLocation( 1919, 1279, 0, 0 );				
			}
			_this.player.start();
			console.log("onPrepared: " )

		}
		this.oninit();
	}
	this.oninit = function() {}

	this.onplayerror = function() {}

	this.onbuffering = function( rate, status ) {
		console.log("onbuffering " + rate + " : " + status );
	}

	this.bind = function( ele ) {
		if ( typeof(ele) == "string" )
			this.bindEle = document.getElementById(ele);
		else
			this.bindEle = ele;		
	}

	this.getRect = function() {
		var e = this.bindEle;
		var r = {};
		r.x = 0; r.y = 0; 
		r.w = e.offsetWidth; 
		r.h = e.offsetHeight;
		while( e != null && !!e && e != document.body ) {
			r.x += e.offsetLeft;
			r.y += e.offsetTop;
			e = e.offsetParent;
		}
		return r;
	}

	this.setFullscreen = function( flag ) {
		if ( flag == true ) {
			this.fullscreenMode = true;
			this.player.setFullScreen();
		}
		else {
			this.fullscreenMode = false;
			if ( !! this.bindEle ) {
				var r = this.getRect();
				this.player.setLocation( r.w, r.h , r.x, r.y );
			}
		}
	}

	this.playnext = function() {
		if( this.player == null )
			return false;
		if( this.murls.length == 0 )
			return false;
		if( this.fullscreenMode == false )
			this.player.setLocation(2,2,1,1);
		else 
			this.player.setFullScreen();
		//this.player.setFullScreen();
		var murl = this.murls[ (++this.playIdx) % this.murls.length ];
		// console.log("playnext : " + murl + ":" + location.href );
		// console.log("playnext check murl: " + JSON.stringify(this.murls) );
		//this.player.stop();
		this.player.setDataSource( murl );
		//this.player.start();
		this.isPlaying = true;
/*
//		this.startPos = this.player.getCurrentPosition();
		var _this = this;
		setTimeout( function() {
//			var npos = _this.player.getCurrentPosition();
//			if( _this.startPos == npos ) {
//				console.log("playnext : play is not forward : " + _this.startPos + " : " + npos );
				//_this.playnext();
//			}

		}, 1000 * 10 );
*/
		return true;
	}

	this.seturl = function( murl ) {
		// console.log("seturl: " + murl);
		// this.murls = [ murl ];
		// console.log("seturl: " + murl );
		var new_url = getSecUrl(murl );
		// console.log("seturl --> " + new_url );
		this.murls = [ new_url ];		
	}

	this.isVisible = function() {
		if(  ( typeof(this.bindEle) == "undefined" || this.bindEle.offsetWidth <= 0 ) ) {
			return false;
		}
		return true;
	}

	this.checkPlay = function(  ) {
		console.log("checkPlay");
		if(  ( typeof(this.bindEle) == "undefined" || this.bindEle.offsetWidth <= 0 ) ) {
			var _this = this;
			var player = this.player;
			player.onGetStatus = function( a ) {
				var status = a.arguments[0];
//				alert( status );
				if ( status == "Playing" ) {
					_this.player.stop();
					_this.player.hide();
					_this.isPlaying = false;				
				}
			}
			try {
				player.checkStatus();
			}catch(e){
				if( this.isPlaying == true ) {
					_this.player.stop();
					_this.player.hide();
					_this.isPlaying = false;					
				}
			}
		} else if(  typeof(this.bindEle) != "undefined" && this.bindEle.offsetWidth > 0 ) {
			var _this = this;
			var player = this.player;
			player.onGetStatus = function( a ) {
				var status = a.arguments[0];
//				alert( status );
				if ( status != "Playing" ) {
					_this.playnext();
				}
			}
			try {
				player.checkStatus();
			}catch(e){
				if( this.isPlaying == false ) {
					this.playnext();
				}
			}
		}
	}

	this.playTimer = null;
	this.keepPlay = function() {
		clearInterval( this.playTimer );
		var _this = this;
		this.playTimer = setInterval( function(){
			if( _this.murls.length == 0 ) {
				return;
			}
			_this.checkPlay();
		} , 1000 * 10 );
	}

}



