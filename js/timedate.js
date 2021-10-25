function ServerTime() {
    if ( ! SERVER_URL ) {
        SERVER_URL = "http://10.0.102.2:16310";
    }
    Date._offset = 0;

    Date._simple_time_url = SERVER_URL + "/time.php" ;
    Date._reset_time_offset = function(){
        var sobj = localStorage.getItem("Date._offset"); //wae.create("DATA.Session");
        if ( sobj ) {
            var offset = parseInt( sobj );
            Date._offset = offset;
            return;
        }

        var uget = new EasyGet();
		uget.onsuccess = function(u,d) {
			var _ugetdata ;
			var stime = parseInt( d );

	        var ltime = Math.floor(new Date().getTime() / 1000 );
	        var offset = stime - ltime;

	        localStorage.setItem("Date._offset", offset);
	        Date._offset = offset;
		}
		uget.open( Date._simple_time_url , true);	
	
    }

    Date._reset_time_offset();

    Date.getCurrentDate = function() {
        var d = new Date();
        d.setTime( d.getTime() + Date._offset * 1000 );
        return d;
    }

    this.gettimestr = function() {
        var now = Date.getCurrentDate();
        var h = now.getHours();
        var m = now.getMinutes();
        if ( m < 10 ) m = "0" + m;
        return h + ":" + m;
    }
    this.getOrdinalNum = function (n) {
        if ( n < 10 ) n = "0" + n;
        return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }

    this.getdatestr = function () {
        var str = "";
        var now = Date.getCurrentDate();
        var week_day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var mons = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
        var mon = now.getMonth();
        var day = now.getDate();
        if ( day < 10 ) day = "0" + day;

        return  week_day[now.getDay()] + ", &nbsp;&nbsp;" + this.getOrdinalNum(now.getDate()) + "&nbsp;" + mons[mon] + "&nbsp;" + now.getFullYear();
    }

    this.utimer = null;

    this.setEle = function( timeId, dateId ) {
        this.timeEle = document.getElementById( timeId );
        this.dateEle = document.getElementById( dateId );

        if ( this.utimer != null ) clearInterval( this.utimer );
        this.updateFunc = function() { this.timeEle.innerHTML = this.gettimestr(); this.dateEle.innerHTML = this.getdatestr();
        }
        var _this = this;
        this.utimer = setInterval( function() {
            _this.updateFunc();
        }, 30 * 1000 );
        this.updateFunc();
    }
}

function Timedate() {
    this.gettimestr = function() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();

        if ( m < 10 ) m = "0" + m;
        return h + ":" + m;
    }
    this.getOrdinalNum = function (n) {
        if ( n < 10 ) n = "0" + n;
        return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }

    this.getdatestr = function () {
        var str = "";
        var now =new Date();

        var week_day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var mons = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
        var mon = now.getMonth();
        var day = now.getDate();
        if ( day < 10 ) day = "0" + day;

        return  week_day[now.getDay()] + ", &nbsp;&nbsp;" + this.getOrdinalNum(now.getDate()) + "&nbsp;" + mons[mon] + "&nbsp;" + now.getFullYear();
    }

    this.utimer = null;

    this.setEle = function( timeId, dateId ) {
        this.timeEle = document.getElementById( timeId );
        this.dateEle = document.getElementById( dateId );

        if ( this.utimer != null ) clearInterval( this.utimer );
        this.updateFunc = function() {
            this.timeEle.innerHTML = this.gettimestr();
            this.dateEle.innerHTML = this.getdatestr();
        }
        var _this = this;
        this.utimer = setInterval( function() {
            _this.updateFunc();
        }, 30 * 1000 );
        this.updateFunc();
    }
}

(function () {
    var scr = document.getElementsByTagName('SCRIPT');
    var url = scr[scr.length - 1].src;
    var timeeles = url.match(new RegExp("[\?\&]timeele=([^\&]*)(\&?)","i"));
    var dateeles = url.match(new RegExp("[\?\&]dateele=([^\&]*)(\&?)","i"));
    if ( timeeles != null && dateeles != null ) {
        // var timedate_obj = new Timedate();
        // timedate_obj.setEle(timeeles[1],dateeles[1] );
        setTimeout( function() {
            var timedate_obj = new ServerTime();
            timedate_obj.setEle(timeeles[1],dateeles[1] );
        }, 1000 * 3 );
    }
})();


