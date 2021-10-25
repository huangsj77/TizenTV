
function VideoPlayer() {
    this.isPlaying = false;
    this.player = null;
    this.chkTimer = null;
    this.playIdx = -1;
    this.murls = [];

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
        var _this = this;
        this.player.onError = function(e) {
            _this.errorcount++;
            console.log( "palyer errorcount " + _this.errorcount );
            clearTimeout( _this.chkTimer );
            _this.chkTimer = setTimeout( function() {
                _this.playnext();
            } , 1000 );
        }
        this.player.onCompletion = function(e) {
            _this.errorcount = 0;
            clearTimeout( _this.chkTimer );
            _this.chkTimer = setTimeout( function() {
                _this.playnext();
            } , 1000 );
        }
        this.player.onBufferingUpdate = function(e) {
            _this.errorcount = 0;
            //console.log("onBufferingUpdate: " )
        }
        this.player.onPrepared = function() {
            console.log("onPrepared----")
            var r = _this.getRect();
            if ( r.w <= 0 ) {
                _this.player.stop();
                _this.player.hide();
                _this.isPlaying = false;
                return false;
            }

            _this.player.setLocation( r.w - 10, r.h - 10, r.x+5, r.y+5 );
            //_this.player.setFullScreen();
            _this.player.start();
            console.log("onPrepared: " )

        }
        this.oninit();
    }
    this.oninit = function() {}

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

    this.playnext = function() {
        if( this.player == null )
            return false;
        if( this.murls.length == 0 )
            return false;
        this.player.setLocation(2,2,1,1);
        var murl = this.murls[ (++this.playIdx) % this.murls.length ];
        console.log("playnext : " + murl);
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
        this.murls = [ murl ];
    }

    this.isVisible = function() {
        if(  ( typeof(this.bindEle) == "undefined" || this.bindEle.offsetWidth <= 0 ) ) {
            return false;
        }
        return true;
    }

    this.checkPlay = function(  ) {
        console.log( "checkPlay: " + this.player );
        if ( !this.player ) return;

        if(  ( typeof(this.bindEle) == "undefined" || this.bindEle.offsetWidth <= 0 ) ) {
            console.log( "checkPlay: check status ");
            var _this = this;
            var player = this.player;
            player.onGetStatus = function( a ) {
                var status = a.arguments[0];
                console.log( "checkPlay: get status for hidden : " + status );
                if ( status == "Playing" ) {
                    console.log( "checkPlay: stopping...");
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
            console.log( "checkPlay: check status ");
            var _this = this;
            var player = this.player;
            player.onGetStatus = function( a ) {
                var status = a.arguments[0];
                console.log( "checkPlay: get status for playing " + status );
                if ( status != "Playing" ) {
                    console.log( "checkPlay: playnext"  );
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