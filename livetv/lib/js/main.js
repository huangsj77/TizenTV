

var player;
// flag to monitor UHD toggling
var uhdStatus = false;

function registerKeys() {
    var usedKeys = [
        'MediaPlay',	
        'MediaPause',
        'MediaStop',
        'MediaFastForward',
        'MediaRewind',
		'ChannelUp',
		'ChannelDown',
		'0',	
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
    ];
    usedKeys.forEach(
        function (keyName) {
            tizen.tvinputdevice.registerKey(keyName);
        }
    );
}

function TVList() {
    this.cateidx = 0;
    this.chanidx = -1;
    this.catelist = null;

    this.init = function (catelist) {
        if (!!catelist) this.catelist = catelist;
        if (typeof (wae) == "undefined") {
            return setTimeout(this.init.bind(this), 1000);
        }
    }

    this.reset_select = function () {
        var last_click = localStorage.getItem("last_click");
        if (!!last_click) {
            var m = last_click.match(/(\d+)\-(\d+)/);
            if (!!m) {
                var cateidx = parseInt(m[1]);
                var chanidx = parseInt(m[2]);
                if (isNaN(cateidx) || isNaN(chanidx)) {
                } else {
                    this.cateidx = parseInt(cateidx);
                    this.chanidx = parseInt(chanidx);
                }
            }
        }
    }

    this.onwakeup = function () {
        this.reset_autohide();
    }
    this.onselect = function (idx) {
        this.reset_autohide();
    }

    this.onkeydown = function (keycode) {
        switch (keycode) {
            // case 22: this.update(this.cateidx + 1); this.chanidx = -1; break;
            // case 21: this.update(this.cateidx - 1); this.chanidx = -1; break;
            // case 4: case 111: this.force_hide(); break;
        }
        this.reset_autohide();
    }

    this.onclick = function (idx) {
    	var loadingMsg = document.getElementById("loadingmsg");
    	loadingMsg.style.display = "block";
    	
        var liveList = document.getElementById("list-controls");
        if (!this._is_visible) {
            this._is_visible = true;
            liveList.classList.remove("list-controls-hide");
            // tvlist.show();
            return;
        } else {
            console.log("tvlist click : " + idx);
            this.chanidx = idx;
            var chanlist = this.catelist[this.cateidx].chanlist;
            var chaninfo = chanlist[idx];
            this.switchClik(chaninfo);
            localStorage.setItem("last_click", this.cateidx + "-" + idx);
        }

    }

    this.switchClik = function (chaninfo) { 	
    	murl = chaninfo.tv_url;
    	this._is_visible = false;
        setTimeout(function(){
//            player.stop();
            player.open(murl);
//            player.play();
        },200);
        
    }
    this.switchTo = function (chaninfo) {
    	var loadingMsg = document.getElementById("loadingmsg");
    	loadingMsg.style.display = "block";
        murl = chaninfo.tv_url;
        var liveList = document.getElementById("list-controls");
        if (this._is_visible && liveList.classList.contains("list-controls-hide")) {
            liveList.classList.remove("list-controls-hide");
            return;
        } else {
            numberpanel.settext(chaninfo);
            player.open(murl);
        }
    }

    this.onSwitchUpDown = function (chaninfo) {
        console.log("onSwitchUpDown for " + JSON.stringify(chaninfo));
    }

    this.switchUpDownMode = "new";
    var udmode = sessionStorage.getItem("udmode");
    if (!udmode) this.switchUpDownMode = udmode;

    this.switchUpDown = function (isdown) {
        console.log("switchUpDown: " + isdown);
        if (this.switchUpDownMode != "new") {
            isdown = !isdown;
        }

        if (this.catelist.length == 0) {
            console.log("catelist is 0 ");
            return;
        }
        if (this.cateidx < 0) this.cateidx += this.catelist.length;
        this.cateidx = this.cateidx % this.catelist.length;

        var chanlist = this.catelist[this.cateidx].chanlist;
        if (chanlist.length == 0) {
            console.log("chanlist is 0 ");
            return;
        }
        
        if (isdown) this.chanidx += 1;
        else this.chanidx -= 1;

        if (this.chanidx < 0) this.chanidx += chanlist.length;
        this.chanidx = this.chanidx % chanlist.length;

        var chaninfo = chanlist[this.chanidx];
        console.log("switchUpDown: to " + JSON.stringify(chaninfo));
        this.switchTo(chaninfo)
        
        localStorage.setItem("last_click", this.cateidx + "-" + idx);
    }

    this.autohidetimer = null;
    this.reset_autohide = function () {
        if (!!this.autohidetimer)
            clearTimeout(this.autohidetimer);
        this.autohidetimer = setTimeout(this.hide, 1000 * 5);
    }

    this._is_visible = false;
    this.is_visible = function () {
        return this._is_visible;
    }
    this.show = (function () {
        this._is_visible = true;
        this.update(this.cateidx);
    }).bind(this);

    this.hide = (function () {
        console.log("tvlist hide ...")
        try {
            var idletime = this.listObj.getIdleTime();
            if (idletime < 1000 * 5) {
                console.log("tvlist need not hide, since list is actived, idletime is only: " + idletime);
                this.reset_autohide();
                return;
            }
        } catch (e) {
            console.log("player use old version , without getIdleTime " + e);
        }

        this.force_hide();
    }).bind(this);

    this.force_hide = function () {
        this._is_visible = false;
        this.listObj.hide();

        if (!!this.autohidetimer)
            clearTimeout(this.autohidetimer);
        this.autohidetimer = null;
    }

    this.find_by_num = function (tvnum) {
    	console.log("find_by_num =" + tvnum);
        tvnum = parseInt(tvnum);
        if (isNaN(tvnum)) return null;
        if (!this.catelist.length || this.catelist.length <= 0) {
            return null;
        }
        for (var i = 0; i < this.catelist.length; i++) {
            var chanlist = this.catelist[i].chanlist;
            if (!chanlist || !chanlist.length) {
                continue;
            }
            for (var j = 0; j < chanlist.length; j++) {
                var chn = chanlist[j];
                if (!chn) continue;
                var ctvnum = parseInt(chn.tv_num);
                if (isNaN(ctvnum)) continue;
                if (ctvnum == tvnum)
                    return chn;
            }
        }
        return null;
    }

    this.update_idx = -1;
    this.update_busy_lock = false;
    this.chanArray = null;
    this.update = function (cateidx) {
        console.log("update : " + cateidx);

        if (!this.catelist.length || this.catelist.length <= 0) {
            return;
        }
        while (cateidx < 0) {
            cateidx = 0;
        //     cateidx += this.catelist.length;
        }
        while (cateidx >= this.catelist.length) {
            cateidx -= this.catelist.length;
        }
        // if (this.update_idx == cateidx) {
        //     return;
        // }

        var chanlist = this.catelist[cateidx].chanlist;
        this.update_idx = cateidx;
        this.cateidx = cateidx;

        var _livelist = "";
        for (var i = 0; !!chanlist && i < chanlist.length; i++) {
            var chn = chanlist[i];
            var title = chn.tv_name;

            var tv_num = chn.tv_num;
            var logo = "";
            if (!!chn.tv_logo) {
                logo = chn.tv_logo;
            }

            _livelist += "<a href='javascript:void(0)' onclick='tvlist.onclick(" + i + ")'>" + "<img src='"+ logo +"' />" + tv_num + "-" + title + "</a>";
        }

        document.getElementById('live-list').innerHTML = _livelist;
        
        var livePanel = document.getElementById('live-list');
        
        livePanel['down'] = function() {
        	var _one =  livePanel.getElementsByTagName("a")[0];
        	livePanel.scrollTop = 0 - livePanel.offsetHeight;
            setTimeout(function() {
                VatataKeyMove.initById(_one);
            },200);
        	return null;
        }
        livePanel['up'] = function() {
        	var length = livePanel.getElementsByTagName("a").length;
        	var _last =  livePanel.getElementsByTagName("a")[length-1];
        	livePanel.scrollTop = livePanel.scrollHeight;
            setTimeout(function() {
                VatataKeyMove.initById(_last);
            },200);
        	return null;
        }

        
        var _default =  document.getElementById('live-list').getElementsByTagName("a")[0];
        
        
        setTimeout(function() {
            VatataKeyMove.initById(_default);
        },200);

        var chanlist = this.catelist[this.cateidx].chanlist;
        var chaninfo = chanlist[0];
        tvlist._is_visible = false;
        _this = this;
        setTimeout(function() {
        	_this.switchTo(chaninfo);
		}, 5000);
//        this.switchTo(chaninfo);
        localStorage.setItem("last_click", this.cateidx + "-" + 0);
    }
}

function NumberPanel() {
    this.wobj = null;
    this.init = function () {
        if (this.wobj != null) return;
        if (typeof (wae) == "undefined") {
            setTimeout(this.init.bind(this), 1000);
            return;
        }
    }

    this._is_visible = false;
    this.is_visible = function () {
        return this._is_visible;
    }
    this.show = (function () {
        this._is_visible = true;
        this.listEle.classList.remove("channelno-hide");
    }).bind(this);

    this.hide = (function () {
        this._is_visible = false;
        this.listEle.classList.add("channelno-hide");
    }).bind(this);

    this.settext = (function (sinfo) {
    	this.show();
    	if( ! isNaN(sinfo) ) {
    		this.listEle.innerHTML = ("000" + sinfo).slice(-3);
    	} else {
    		 this.listEle.innerHTML = ("000" + sinfo.tv_num).slice(-3);
    	}
        
        _this = this;
        setTimeout(function(){
            _this.hide();
        }, 2000);
    }).bind(this);

    this.keyBuffer = "";
    this.keyChar = "0123456789";
    this.switchTimer = null;

    this.reset = function () {
        // console.log("reset: " + arguments.callee.caller );
        this.keyBuffer = "";
        if (!!this.switchTimer) clearTimeout(this.switchTimer);
        this.switchTimer = null;
        this.hide();
    }

    this.checkNumber = function (k) {
        if (k < 48 || k > 57) {
            this.reset();
            return;
        }
        var num = this.keyChar.charAt(k - 48);
        this.keyBuffer += num;
        if (this.keyBuffer.length > 4) {
            this.keyBuffer = this.keyBuffer.substring(this.keyBuffer.length - 4);
        }

        this.showNumber();
    }

    this.showNumber = function () {
        console.log("showNumber: " + this.keyBuffer + " : " + this.is_visible() );
        this.settext(this.keyBuffer);
        if (this.is_visible() == false) this.show();

        if (!!this.switchTimer) clearTimeout(this.switchTimer);
        this.switchTimer = setTimeout(this.switchFunc.bind(this), 1000 * 2);
    }

    this.switchFunc = function () {
        // console.log("now the channel no: " + this.keyBuffer + " need go!");
        this.switchTo(parseInt(this.keyBuffer));
        this.reset();
        this.hide();
    }
    this.switchTo = function( chn_no ) {
        console.log("numberpanel.switchTo " + chn_no );
        chn_no = parseInt(chn_no);
        if ( isNaN(chn_no ) ) return;
        console.log("switchTo ... " + chn_no );

        for( var i=0; i<catelist.length; i++ ) {
            var chanlist = catelist[i].chanlist;
            for( var j=0; j<chanlist.length; j++ ) {
                var tvno1 = parseInt(chanlist[j].tv_num);

                if ( tvno1 == chn_no ) {
                    console.log("found and play by tvnum " + chn_no );
                    console.log("channle info = " + JSON.stringify(chanlist[j]) );
                    player.open(chanlist[j].tv_url);
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
                    console.log("found and play by faked tvnum " + chn_no );
                    console.log("channle info = " + JSON.stringify(chanlist[j]) );
                    player.open(chanlist[j].tv_url);
                    tvlist.cateidx = i;
                    tvlist.chanidx = j;
                    return;
                }
            }
        } 

        console.log("no found anything for " + chn_no );
    }
}



var config = {
//    player: document.getElementById('av-player'),
	player:webapis.avplay,
    resolutionWidth: 1920,
    livelist:document.getElementById('list-controls'),
    loadingmsg:document.getElementById('loadingmsg'),
};

player = new VideoPlayer(config);
window.onload = function () {
    if (window.tizen === undefined) {
        log('This application needs to be run on Tizen device');
        return;
    }
    
    registerKeys();
//    registerKeyHandler();
}

var livetvdata = new LiveTVData();
var res = livetvdata.init();
var catelist = livetvdata.getcatelist();

var tvlist = new TVList();
tvlist.listEle = document.getElementById("")
tvlist.init(catelist);
tvlist.show();


var numberpanel = new NumberPanel();
numberpanel.listEle = document.getElementById("channelno");
numberpanel.init();



this.playing_chn = null;