
function TVList() {
    this.cateidx = -1;
    this.chanidx = -1;
    this.catelist = null;
    this.init = function( catelist ) {
        if ( !! catelist ) this.catelist = catelist;

        if ( typeof(wae) == "undefined" ) {
            return setTimeout( this.init.bind(this), 1000 );
        }

        this.focused = false;
        this.listObj = wae.create("UI.IListKandy");
        this.listObj.onWakeup =  (function( arg ) {
            this.onwakeup( );
        }).bind(this);
        this.listObj.onSelected =  (function( arg ) {
            this.onselect( arg.arguments[0] );
        }).bind(this);
        this.listObj.onKeydown = (function ( arg ) {
            this.onkeydown( arg.arguments[0] );
        }).bind(this);
        this.listObj.onClick = (function ( arg ) {
            this.onclick( arg.arguments[0] );
        }).bind(this);
        this.listObj.onBlur = (function ( arg ) {
            this.focused = false;
        }).bind(this);
        this.listObj.onFocus = (function ( arg ) {
            this.focused = true;
        }).bind(this);

        // this.listObj.move( 50, 85, 600, 950 );
        this.listObj.move( 0, 0, 400, 1080 );
        if ( this.chanidx < 0 ) {
            this.reset_select();
        }
    }

    this.reset_select = function() {
        var last_click = localStorage.getItem("last_click");
        if ( !!last_click) {
            var m = last_click.match( /(\d+)\-(\d+)/ );
            if ( !!m ) {
                // alert( JSON.stringify(m) );
                var cateidx = parseInt(m[1]);
                var chanidx = parseInt(m[2]);
                if ( isNaN(cateidx) || isNaN(chanidx) ) {
                    //
                } else {
                    this.cateidx = parseInt(cateidx);
                    this.chanidx = parseInt(chanidx);
                }
            }
        }
    }

    this.onwakeup = function() {
        // console.log("tvlist wakeup "   );        
        this.reset_autohide();        
    }
    this.onselect = function( idx  ) {
        // console.log("tvlist select : " + idx  );        
        this.reset_autohide();
    }

    this.onkeydown = function( keycode ) {
        console.log("tvlist onkeydown " + keycode);
        switch( keycode ) {
            case 22: this.update(this.cateidx+1); this.chanidx = -1; break;
            case 21: this.update(this.cateidx-1); this.chanidx = -1; break;
            case 4: case 111: this.force_hide(); break;
        }
        this.reset_autohide();
    }

    this.onclick = function( idx ) {
        console.log("tvlist click : " + idx  );

        this.chanidx = idx;

        var chanlist =  this.catelist[this.cateidx].chanlist;
        var chaninfo = chanlist[ idx ];

        this.force_hide();

        this.switchTo( chaninfo );
        localStorage.setItem("last_click", this.cateidx + "-" + idx );
    }

    this.switchTo = function( chaninfo ) {        
        console.log("click to switch for " + JSON.stringify(chaninfo) );
    }

    this.onSwitchUpDown = function( chaninfo ) {        
        console.log("onSwitchUpDown for " + JSON.stringify(chaninfo) );
    }

    this.switchUpDownMode = "new";
    var udmode = sessionStorage.getItem("udmode" );
    if( !udmode ) this.switchUpDownMode = udmode;

    this.switchUpDown = function( isdown ) {
        // console.log( "switchUpDown: " + isdown );
        if ( this.switchUpDownMode != "new" ) {
            isdown = ! isdown;
        }

        if ( this.catelist.length == 0 ) {
            console.log("catelist is 0 ");
            return;
        }
        if ( this.cateidx < 0 )  this.cateidx += this.catelist.length ;
        this.cateidx = this.cateidx % this.catelist.length ;

        var chanlist =  this.catelist[this.cateidx].chanlist;
        if ( chanlist.length == 0 ) {
            console.log("chanlist is 0 ");
            return;
        }
        // console.log( "switchUpDown: old idx : " + this.chanidx );
        if ( isdown ) this.chanidx += 1;
        else this.chanidx -= 1;

        if ( this.chanidx < 0 ) this.chanidx += chanlist.length;
        this.chanidx = this.chanidx % chanlist.length;

        // console.log( "switchUpDown: new idx : " + this.chanidx );

        var chaninfo = chanlist[ this.chanidx ];
        // console.log("switchUpDown: to "  + JSON.stringify(chaninfo) );
        this.onSwitchUpDown( chaninfo );
    }

    this.autohidetimer = null;
    this.reset_autohide = function() {
        if ( !! this.autohidetimer )
            clearTimeout( this.autohidetimer );
        this.autohidetimer = setTimeout( this.hide , 1000 * 5 );
    }

    this._is_visible = false;
    this.is_visible = function() {
        return this._is_visible;
    }
    this.show = (function() {
        console.log("show ... ");
        this._is_visible = true;
        if( !this.listObj ) {
            return setTimeout( this.show , 1000 );
        }

        this.update( this.cateidx );
        this.listObj.show( true ); 
        if ( this.chanidx >= 0 ) {
            console.log("select item: " + this.chanidx );
            this.listObj.selectItem( this.chanidx );
            // this.chanidx = -1;
        }
        this.reset_autohide();
    }).bind(this);


    this.hide = (function(){
        console.log("tvlist hide ..." )

        try {
            var idletime = this.listObj.getIdleTime();
            if (  idletime < 1000 * 5 ) {
                console.log("tvlist need not hide, since list is actived, idletime is only: " + idletime );
                this.reset_autohide();
                return;
            }
        }catch(e){
            console.log("player use old version , without getIdleTime " + e );
        }

        this.force_hide();
    }).bind(this);

    this.force_hide = function() {
        this._is_visible =false;
        this.listObj.hide();

        if ( !! this.autohidetimer )
            clearTimeout( this.autohidetimer );
        this.autohidetimer = null;        
    }

    this.find_by_num = function( tvnum ) {
        tvnum = parseInt(tvnum);
        if ( isNaN(tvnum) ) return null;
        if ( ! this.catelist.length || this.catelist.length <= 0 ) {
            return null;
        }
        for( var i=0; i<this.catelist.length; i++ ) {
            var chanlist =  this.catelist[i].chanlist;
            if ( ! chanlist || ! chanlist.length ) {
                continue;
            }
            for( var j=0; j<chanlist.length; j++ ) {
                var chn = chanlist[j];
                if ( ! chn ) continue;
                var ctvnum = parseInt( chn.tv_num );
                if ( isNaN(ctvnum) ) continue;
                if ( ctvnum == tvnum )
                    return chn;
            }
        }
        return null;
    }

    this.update_idx = -1;
    this.update_busy_lock = false;
    this.update = function( cateidx ) {
        console.log("update : "  + cateidx );
        if ( this.update_busy_lock  == true ) {
            return;
        }
        if ( ! this.catelist.length || this.catelist.length <= 0 ) {
            return ;
        }
        while ( cateidx < 0 ) {
            cateidx += this.catelist.length ;
        }
        while( cateidx >= this.catelist.length ) {
            cateidx -= this.catelist.length ;
        }
        if ( this.update_idx == cateidx ) {
            return;
        }

        var chanlist =  this.catelist[cateidx].chanlist;

        this.update_busy_lock = true;

        this.update_idx = cateidx;
        this.cateidx = cateidx;

        this.listObj.clear();
        // alert(JSON.stringify(chanlist))
        for( var i = 0 ; !! chanlist && i<chanlist.length; i++ ) {
            var chn = chanlist[i];
            var title = chn.tv_name;

            var tv_num = chn.tv_num;
            // if ( ! tv_num ) tv_num = chn.tv_num_o;
            // tv_num = "000" + tv_num;
            // tv_num = tv_num.substring(  tv_num.length - 4 );

            var logo = "";
            if ( !! chn.tv_logo ) {
                logo = chn.tv_logo;
            }

            // this.listObj.addData( tv_num + "-" + title, logo, "" );
            // this.listObj.addData( tv_num + "-" + title, logo, "" );  
            this.listObj.addData( tv_num , logo,  title );  
        }
        this.listObj.setTitle( this.catelist[ this.cateidx ].app_name );
        this.listObj.update();
        this.listObj.focus( false );
        setTimeout( (function(){
            console.log("list has changed , focus first item!");
            this.listObj.focus( true );
            this.update_busy_lock = false;
        }).bind(this), 300 );
    }
}

function NumberPanel() {
    this.wobj = null;
    this.init = function() {
        if ( this.wobj != null ) return;
        if ( typeof(wae) == "undefined") {
            setTimeout( this.init.bind(this), 1000 );
            return;
        }
        this.wobj = wae.create("UI.WaePopupWebView");
        this.wobj.createWebView("number", "numberpanel.html", 1550, 50, 300, 1300 );
        this.messager = wae.create("WAE.WindowMessager");
    }

    this._is_visible = false;
    this.is_visible = function() {
        // console.log("is_visible: " + this._is_visible + " : " + this );
        return this._is_visible;
    }
    this.show = (function() {
        this._is_visible = true;
        // console.log("show: " + this._is_visible + " : " + this );
        this.wobj.showWebView( "number", false);   
    }).bind(this);

    this.hide = (function() {
        // console.log("hide: " + this._is_visible + " : " + arguments.callee.caller );
        this.keyBuffer = "";
        this._is_visible = false;
        this.wobj.hideWebView("number");
    }).bind(this);

    this.settext = function( numstr )  {
        var chn = tvlist.find_by_num( numstr );
        var name = "";
        if ( !! chn ) name = chn.tv_name;
        var sinfo = {};
        sinfo.num = numstr;
        sinfo.name = name;
        var showinfo = JSON.stringify( sinfo );
        this.messager.sendMessage( "number" , "settext",  showinfo );
    }

    this.keyBuffer = "";
    this.keyChar = "0123456789";
    this.switchTimer = null;

    this.reset = function() {
        // console.log("reset: " + arguments.callee.caller );
        this.keyBuffer = "";
        if ( !! this.switchTimer ) clearTimeout( this.switchTimer );
        this.switchTimer = null;
        this.hide();        
    }

    this.checkNumber = function( k ) {
        if ( k < 48 || k > 57 ) {
            this.reset();
            return;
        }
        var num = this.keyChar.charAt( k - 48 );
        this.keyBuffer += num;
        if( this.keyBuffer.length > 4 ) {
            this.keyBuffer = this.keyBuffer.substring( this.keyBuffer.length - 4 );
        }

        this.showNumber( );
    }

    this.showNumber = function(  ) {
        console.log("showNumber: " + this.keyBuffer + " : " + this.is_visible() );
        this.settext( this.keyBuffer );
        if ( this.is_visible() == false ) this.show();

        if ( !! this.switchTimer ) clearTimeout( this.switchTimer );
        this.switchTimer = setTimeout( this.switchFunc.bind(this) , 1000 * 2 );
    }

    this.switchFunc = function() {
        // console.log("now the channel no: " + this.keyBuffer + " need go!");
        this.switchTo( parseInt(this.keyBuffer) );
        this.hide();
    }
    this.switchTo = function( chn_no ) {
        console.log("switch to " + chn_no );
    }
}

var videoPlayer = new VideoPlayer();

videoPlayer.pbar = null;
videoPlayer.speedobj = null;
videoPlayer.isbuffering = false;
videoPlayer.buffer_netspeedtimer = null;
videoPlayer.htimer = null;

videoPlayer.oninit = function() {
    videoPlayer.setFullscreen( true );
    if ( this.pbar == null ) {
        try {
            this.pbar = wae.create("UI.ILoadingBar");
            this.pbar.move( 20, 980, 1200, 120 );
            this.pbar.setMessage("loading ..." );
            this.pbar.show( false );
        }catch(e){}
    }
    // videoPlayer.setTouchCallback( document.onclick );
}

videoPlayer.init();

videoPlayer.onbuffering = function( rate, status ) {
    var murl = this.cmurl ;
    if ( !!murl && murl.indexOf("udp:") >= 0 ) {
        return;
    }

    // console.log("videoPlayer onbuffering " + rate + " : " + status );
    if ( status == "MEDIA_INFO_BUFFERING_START" ) {
        // console.log("buffer start ... ");
        if ( this.pbar == null ) {
            try {
                this.pbar = wae.create("UI.ILoadingBar");
                this.pbar.move( 20, 980, 1200, 120 );
            }catch(e){}
        }
        if( this.pbar == null ) {
            setTimeout( function() {
                videoPlayer.onbuffering(rate, status);
            }, 1000 );
            return;
        }

        if ( this.speedobj == null ) {
            try {
                this.speedobj = wae.create("Net.NetSpeed");
                this.speedobj.setTotalMode(true);
            }catch(e){}
        }

        if ( this.speedobj != null  && this.isbuffering == false ) {
            this.speedobj.resetSpeed();
            if (  !!this.buffer_netspeedtimer ) clearInterval( this.buffer_netspeedtimer );
            this.buffer_netspeedtimer = setInterval( (function() {
                if ( this.isbuffering == false ) {
                    clearInterval( this.buffer_netspeedtimer );
                    return;
                }
                var speed = this.speedobj.getDownloadSpeed() ;
                var speedstr = (Math.floor( speed * 8 * 10 ) /10)  + "kbps";
                // console.log("run at netspeed timer check speed speed: " + speed + " : "  + speedstr );
                var chninfostr = "";
                if ( !! this.chn ) {
                    var tvnum = this.chn.tv_num;
                    if ( ! tvnum ) tvnum = this.chn.tv_num_o;
                    if ( ! tvnum ) tvnum = "";
                    chninfostr = tvnum + "-" + this.chn.tv_name;
                }
                this.pbar.setMessage( chninfostr + " buffering [" + speedstr + "]" );
                this.pbar.show( false );
            }).bind(this), 1000 * 1 );
        }
        this.isbuffering  = true;

        var chninfostr = "";
        if ( !! this.chn ) {
                    var tvnum = this.chn.tv_num;
                    if ( ! tvnum ) tvnum = this.chn.tv_num_o;
                    if ( ! tvnum ) tvnum = "";
                    chninfostr = tvnum + "-" + this.chn.tv_name;
        }
        this.pbar.setMessage(chninfostr + " buffering ..." );
        this.pbar.show( false );

        if ( videoPlayer.htimer != null ) clearTimeout( videoPlayer.htimer );
        videoPlayer.htimer  = setTimeout( function() {
            videoPlayer.pbar.hide();
            videoPlayer.isbuffering  = false;
        }, 1000 * 120);
        // console.log("buffer start ... pbar is " + this.pbar + " , show it " );
    } else if ( status == "MEDIA_INFO_BUFFERING_END" || rate == 100 ) {
        // console.log("buffer end ... ");    
        if ( videoPlayer.htimer != null ) clearTimeout( videoPlayer.htimer );
        videoPlayer.htimer = null;
        if( this.pbar == null ) return;
        this.pbar.hide();
        this.isbuffering  = false;
        if ( tvlist.is_visible() ) {
            tvlist.show();            
        }
    }
}

videoPlayer.onprepared = function() {
    this.pbar.loadingtitle = chninfostr + ", start loading ... ... " ;
    this.pbar.setMessage( this.pbar.loadingtitle );
    this.pbar.show( false );

    this.cfunc = (function() {
        if ( videoPlayer.htimer != null ) clearTimeout( videoPlayer.htimer );
        var ptime = this.player.getCurrentPosition();
        if ( ptime > 500 ) {
            videoPlayer.pbar.hide();
            videoPlayer.isbuffering  = false;
            return;
        }
        this.pbar.loadingtitle = this.pbar.loadingtitle + " ...";
        this.pbar.setMessage( this.pbar.loadingtitle );
        videoPlayer.htimer  = setTimeout( videoPlayer.cfunc, 1000 * 2 );

    }).bind(this);

    this.cfunc();
}

videoPlayer.onplayerror = function() {
        document.getElementById("errormsg").style.display= "block";
        var name = this.chn.tv_name; 
        document.getElementById("maintaintitle").innerHTML = name;  
}

videoPlayer.on_auth_fail = function() {
    alert("Access Denied to Play Channel "+ this.chn.tv_name+"!\n\nPlease contact your vendor for more Plan!");
    // var app = wae.create("Application");
    // app.finishActivity();
}

videoPlayer.hlschooser = null;
videoPlayer.on_auth_ok = function() {
    if ( this.player == null ) {
        this.init();
        setTimeout( this.on_auth_ok.bind(this), 500 );
        return;
    }

    if ( !! this.chn.relayurl && this.chn.relayurl.length > 0 ) {
        // alert( JSON.stringify(this.chn.relayurl ) );
        if ( ! this.hlschooser ) {
            this.hlschooser = wae.create("Net.HLSChooser");
        }

        if ( !! this.hlschooser ) {
            this.hlschooser.clear();

            var ulist = [];
            for( var i=0; i<this.chn.relayurl.length; i++ ) {
                var u = getSecUrl( this.chn.relayurl[i], false);
                u = u.replace(/http:\/\/127.0.0.1.*?url=/, "");
                ulist.push( u );
                this.hlschooser.add( u );
            }
            this.hlschooser.onResponse = function (a) {
                // alert("found: " + JSON.stringify(a) );
                var murl = a.arguments[0];
                var index = a.arguments[1];
                var ctime = a.arguments[2];
                console.log("hlschooser connect time is : " + ctime );
                // alert( murl );
                videoPlayer.on_url_ready( murl );
            }
            this.hlschooser.onError = function (argument) {
                // alert("error"  + JSON.stringify(arguments) )
            }

            this.hlschooser.choose();
            return;
        }
    }

    var murl = this.chn.tv_url;
    videoPlayer.on_url_ready ( murl );
}

videoPlayer.on_url_ready = function( murl ) {
    if ( !murl || murl.length < 5 ) {
        document.getElementById("errormsg").style.display= "block";

        if ( videoPlayer.player != null )
            videoPlayer.player.stop();
        if ( videoPlayer.pbar != null ) {
            videoPlayer.pbar.hide();
            videoPlayer.isbuffering  = false;
        }
        return;
    }

    if ( !! this.chn ) {
        var tvnum = this.chn.tv_num;
        if ( ! tvnum ) tvnum = this.chn.tv_num_o;
        if ( ! tvnum ) tvnum = "";
        chninfostr = tvnum + "-" + this.chn.tv_name;
    }
    this.pbar.setMessage(chninfostr + ", start loading ..." );
    this.pbar.show( false );
    if ( videoPlayer.htimer != null ) clearTimeout( videoPlayer.htimer );
    videoPlayer.htimer  = setTimeout( function() {
        videoPlayer.pbar.hide();
        videoPlayer.isbuffering  = false;
    }, 1000 * 60 );

    this.murls = [ murl ];
    this.playnext();
    this.playing_chn = this.chn;
    localStorage.setItem("last_playing_chn", JSON.stringify(this.chn) );
}

videoPlayer.authobj = new Auth();
videoPlayer.authobj.init();
videoPlayer.authobj.vplayer = videoPlayer;
videoPlayer.authobj.onauth = function( ok, o, p ) {
    if ( ok ) {
        this.vplayer.on_auth_ok();
    } else {
        this.vplayer.on_auth_fail();
    }
}

this.playing_chn = null;
videoPlayer.auth_and_play = function( chn ) {
    // console.log("try to play channle 1 : " + JSON.stringify(chn) );
    document.getElementById("errormsg").style.display= "";
    
    if ( !! this.playing_chn && chn.tv_id == this.playing_chn.tv_id ) {
        // same channel
        return;        
    }
    this.chn = chn;

    if( !! this.chn ) {
                    var tvnum = this.chn.tv_num;
                    if ( ! tvnum ) tvnum = this.chn.tv_num_o;
                    if ( ! tvnum ) tvnum = "";
                    chninfostr = tvnum + "-" + this.chn.tv_name;
    }
    if( this.pbar != null ) {
        this.pbar.setMessage(chninfostr + ", check information ..." );
        this.pbar.show( false );
        if ( videoPlayer.htimer != null ) clearTimeout( videoPlayer.htimer );
        videoPlayer.htimer  = setTimeout( function() {
            videoPlayer.pbar.hide();
            videoPlayer.isbuffering  = false;
        }, 1000 * 120 );        
    }
    videoPlayer.on_auth_ok();
}

var livetvdata = new LiveTVData();
var res = livetvdata.init();

if ( res == false ) {
    alert("Please contact services provider before watching");
    
    var app = wae.create("Application");
    app.finishActivity();
}
livetvdata.fixchannum();

var catelist = livetvdata.getcatelist();
var tvlist = new TVList();
tvlist.init( catelist );

tvlist.switchTo = function( chaninfo ) {        
    //console.log("click to switch for " + JSON.stringify(chaninfo) );
	alert(JSON.stringify(chaninfo))
    videoPlayer.auth_and_play ( chaninfo );
}

tvlist.onSwitchUpDown = function( chaninfo ) {
    var tv_num = chaninfo.tv_num;
    if ( ! tv_num ) tv_num = chaninfo.tv_num_o;

    tv_num = "0000" + tv_num;
    tv_num = tv_num.substring(  tv_num.length - 4 );

    // console.log("onSwitchUpDown: " + tv_num );
    tvnum.keyBuffer = tv_num;
    // tvnum.showNumber( );

    if ( !! tvnum.switchTimer ) clearTimeout( tvnum.switchTimer );
    tvnum.switchTimer = setTimeout( tvnum.switchFunc.bind(tvnum) , 10 );    
}

var tvnum = new NumberPanel();
tvnum.init();

tvnum.switchTo = function( chn_no ) {
    console.log("switchTo " + chn_no );
    chn_no = parseInt(chn_no);
    if ( isNaN(chn_no ) ) return;
    console.log("switchTo ... " + chn_no );

    for( var i=0; i<catelist.length; i++ ) {
        var chanlist = catelist[i].chanlist;
        for( var j=0; j<chanlist.length; j++ ) {
            var tvno1 = parseInt(chanlist[j].tv_num);

            if ( tvno1 == chn_no ) {
                //console.log("found and play by tvnum " + chn_no );
                videoPlayer.auth_and_play ( chanlist[j] );
                tvlist.cateidx = i;
                tvlist.chanidx = j;
                return;
            }
        }
    }    

    for( var i=0; i<catelist.length; i++ ) {
        var chanlist = catelist[i].chanlist;
        for( var j=0; j<chanlist.length; j++ ) {
            var tvno1 = parseInt(chanlist[j].tv_num_o);

            if ( tvno1 == chn_no ) {
                //console.log("found and play by faked tvnum " + chn_no );
                videoPlayer.auth_and_play ( chanlist[j] );
                tvlist.cateidx = i;
                tvlist.chanidx = j;
                return;
            }
        }
    } 

    console.log("no found anything for " + chn_no );
}

window.onWAEReady = function(waeObj){

        var uiSettings = wae.create("UI.UISettings");
        uiSettings.set1080P();


        eventobj = wae.create("EventListener");
        eventobj.backcount = 0;
        eventobj.onKeyEvent = function( a ) {
                if( a.arguments[0] == 4 ) {
                        eventobj.backcount ++;
                        console.log("back count++: " + eventobj.backcount )
                        setTimeout( function() {
                                eventobj.backcount = 0;
                        } , 1000 * 5);
                        // accountinfo.style.display = "none";
                        console.log("back count: " + eventobj.backcount )
                        if ( eventobj.backcount <= 1 ) {
                                var toast = wae.create("Toast");
                                toast.setEnable(true);
                                toast.showMessage("Press BACK again to exit!");
                                return;
                        }
                        var app = wae.create("Application");
                        app.finishActivity();
                }
                if( a.arguments[0] == 24 ) {
                    console.log("volume down/up 24")
                }else if( a.arguments[0] == 25 ) {
                    console.log("volume up/down 25")
                }
        }
        eventobj.addCurKey(4);
        // eventobj.addCurKey(24);
        // eventobj.addCurKey(25);

        try {
            touchobj = wae.create("UI.JTouchEvent");

            touchobj.onWheel = function(e) {
                    var d = e.arguments[0];
                    if ( d > 0 ) {
                            sende( 's' , 83);
                    } else {
                            sende( 'w' , 87);
                    }
            }
            touchobj.holdWheel();

            touchobj.gridsize = 60;
            touchobj.startx = -1;
            touchobj.starty = -1;
            touchobj.onDown = function( e ) {
                console.log("touch down " + JSON.stringify(e))
                touchobj.startx = e.arguments[0];
                touchobj.starty = e.arguments[1];
            }
            touchobj.onUp = function( e ) {
                console.log("touch up " + JSON.stringify(e))
                if ( touchobj.startx == -1 ||  touchobj.starty == -1 ) {
                    document.onclick();                    
                    return ;
                }
                var dx = e.arguments[0] - touchobj.startx;
                var dy = e.arguments[1] - touchobj.starty;

                touchobj.startx = -1;
                touchobj.starty = -1;

                console.log("touch up " + dx + " : " + dy )

                if ( dx > touchobj.gridsize ) {
                    document.onkeydown( {"keyCode" : 68 } );
                    return;
                } else if ( dx < 0 - touchobj.gridsize ) {
                    document.onkeydown( {"keyCode" : 65 } );
                    return;
                }

                if ( dy > touchobj.gridsize ) {
                    tvlist.switchUpDown( true );
                    return;
                } else if ( dy < 0 - touchobj.gridsize ) {                    
                    tvlist.switchUpDown( false );
                    return;
                }
                document.onclick();
            }
            touchobj.onMove = function( e ) {
                console.log("touch move " + JSON.stringify(e))
                if ( touchobj.startx == -1 ||  touchobj.starty == -1 ) {
                    touchobj.startx = e.arguments[0];
                    touchobj.starty = e.arguments[1];
                    return ;
                }
            }
            touchobj.hold();

        }catch(e){}

    var param = wae.create("DATA.Parameters");

    var data = param.get("DATA");
    var tvid = parseInt( data );


    if ( !isNaN(tvid) ) {
        console.log("try to search tvid for playing....")
        for( var i=0; i<catelist.length; i++ ) {
            var chanlist = catelist[i].chanlist;
            for( var j=0; !!chanlist && j<chanlist.length; j++ ) {
                var ctvid = parseInt(chanlist[j].tv_id);

                if ( ctvid == tvid ) {
                    console.log("found tvid for playing....")
                    videoPlayer.auth_and_play ( chanlist[j] );
                    tvlist.cateidx = i;
                    tvlist.chanidx = j;
                    localStorage.setItem("last_click", tvlist.cateidx + "-" + tvlist.chanidx );
                    return;
                }
            }
        }
    } else {
        var murl = param.get("url");
        // console.log("try to search url for playing....")
        if ( !! murl )
        for( var i = catelist.length -1; i>=0; i-- ) {
            var chanlist = catelist[i].chanlist;
            for( var j=0; !!chanlist && j<chanlist.length; j++ ) {
                var foundpos = chanlist[j].tv_url.indexOf( murl );

                if ( foundpos >= 0 ) {
                    // console.log("found url for playing....")
                    videoPlayer.auth_and_play ( chanlist[j] );
                    tvlist.cateidx = i;
                    tvlist.chanidx = j;
                    localStorage.setItem("last_click", tvlist.cateidx + "-" + tvlist.chanidx );
                    return;
                }
            }
        }

    }
    var last_playing_chn = JSON.parse( localStorage.getItem("last_playing_chn" ) );
    last_playing_chn  = 0;
    if ( !last_playing_chn ) {
        console.log("found first item for playing....")
        tvnum.switchTo( 1 );
    } else {
        console.log("found last playing for playing....")
        var tvid = parseInt( last_playing_chn.tv_id );
        if ( !isNaN(tvid) )
        for( var i = 0; i < catelist.length ; i++ ) {
            var chanlist = catelist[i].chanlist;
            for( var j=0; !!chanlist && j<chanlist.length; j++ ) {
                var ctvid = parseInt(chanlist[j].tv_id);
                if ( ctvid == tvid ) {
                    videoPlayer.auth_and_play ( chanlist[j] );
                    tvlist.cateidx = i;
                    tvlist.chanidx = j;
                    localStorage.setItem("last_click", tvlist.cateidx + "-" + tvlist.chanidx );
                    return;
                }
            }
        }
        videoPlayer.auth_and_play( last_playing_chn );
    }

    showWaterMark();
}

function showWaterMark() {
    var imgobj = wae.create("UI.IWebview");
    imgobj.open("stellogo1.png");
    //imgobj.move( 1690, 760, 180 ,180 );
    imgobj.move( 1580, 950,  220 ,110 );

    //imgobj.setFocusable( false );
    imgobj.show( false );

    force_blur = function() {
        //imgobj.setFocusable( false );
        imgobj.focus( false );
        //imgobj.setFocusable( false );
        imgobj.hold( false );    

        if ( tvlist.is_visible() )
            tvlist.show();
    }

    force_blur();

    setTimeout( force_blur, 1000 );
    setTimeout( force_blur, 1000 * 2 );
    setTimeout( force_blur, 1000 * 10 );

    // imgobj.onBack = function() {
    //     console.log("img onback ....");
    // }

    // var tobj = wae.create("UI.ILoadingBar");
    // tobj.move(1750, 850, 200 ,200 );
    // tobj.setMessage("Logo");
    // tobj.show(false);
}

document.onkeydown = function( e ) {
    console.log("onkey down: " + e.keyCode );
    idleChecker.count = 0;
    if ( tvlist.is_visible() ) {
    switch( e.keyCode ) {
        case 68:
            tvlist.onkeydown( 22 );
            break;
        case 65:
            tvlist.onkeydown( 21 );
            break;
        }
        return;
    }

    console.log("onkey down: before  " + e.keyCode );
    switch( e.keyCode ) {
        case 83:
        case 87:
            return;
        case 40:
        case 38:
            tvlist.switchUpDown( e.keyCode == 40 );
            return;
    }
    if ( e.keyCode >= 48 && e.keyCode <= 57 ) {
        tvnum.checkNumber( e.keyCode );
        return;
    }
    // tvnum.checkNumber( 0 );
    console.log("onkey down after checker: " + e.keyCode );

    switch( e.keyCode ) {
        case 27 :
            break;
        default:     tvlist.show();        
    }
}

document.onclick = function() {
    idleChecker.count = 0;
    console.log("document onclick to show list "  );
    tvlist.show();
}
window.onclick = document.onclick;


function IdleChecker() {
    this.count = 0;
    this.maxCount = 60 * 3;

    this.check = function() {
        console.log(" check idle : " + this.count );
        if ( this.count > this.maxCount ) {
            this.warn();
            this.count = 0;
        }
        this.count++;
    }

    this.timer = null;
    this.start = function() {
        console.log("start check idle");
        
        if ( this.timer != null ) clearInterval( this.timer );
        this.timer = setInterval( this.check.bind(this), 1000 * 60 );
    }

    this.warn = function() {
        var d = wae.create("UI.IExitDialog");
        d.show();
    }
}

var idleChecker = new IdleChecker();

var idletime = sessionStorage.getItem("idletime");
// alert( idletime );
if ( !isNaN(idletime) && parseInt(idletime) > 0 ) {
    idleChecker.maxCount = parseInt(idletime)  ;
    idleChecker.start();
}
