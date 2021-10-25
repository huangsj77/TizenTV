

function SimpleLoc() {

    this.onload = function( locinfo ) {
    }

    this.surl = "http://freegeoip.net/json/"; // http://ipinfo.io";
    this.locinfo = null;
    this.load = function() {
        if ( this.locinfo != null ){
            this.onload( this.locinfo );
            return;
        }

        if ( typeof(iwae) == "undefined" )
            return ;
        if ( typeof(wae) == "undefined" ) {
            var _this = this;
            setTimeout( function() { _this.load(); }, 1000 );
            return;
        }
        SimpleLoc.hc = wae.create("Net.HttpClient");

        var _this = this;
        SimpleLoc.hc.onComplete = function( a ) {
            var res = a.arguments[2] ;
            eval( "var linfo = " + res );
            _this.locinfo = linfo;
            _this.onload( linfo);
        }
        SimpleLoc.hc.getWithAsync2(this.surl);
    }
}

function Weather() {
    this.onload = function() {}

    this.load =function( cityName ) {
        if ( typeof(iwae) == "undefined" )
            return ;
        if ( typeof(wae) == "undefined" ) {
            var _this = this;
            setTimeout( function() { _this.load(); }, 1000 );
            return;
        }

//        var url = "http://14.204.136.125:8278/down/wea.php?location="+cityName+"&format=json&u=c";
        var surl = SERVER_URL;
        var url = surl + "wae/weather.php?location="+encodeURI(cityName)+"&format=json&u=c"
        // var url = "http://14.204.136.125:8278/down/wea.php?location="+cityName+"&format=json&u=c";
        // console.log("load weather1: " + url );
        if ( SimpleLoc.hc  == null ) SimpleLoc.hc = wae.create("Net.HttpClient");
        var _this = this;
        SimpleLoc.hc.onComplete = function( a ) {
            var res = a.arguments[2] ;
            eval( "var linfo = " + res );
            _this.onload( linfo );
        }
        SimpleLoc.hc.getWithAsync2( url );
    }

    this.loadweather = function( woeid ) {
        var wurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid='+woeid+'%20&format=json&callback=';
        console.log("load weather2: " + wurl );

        var _this = this;
        SimpleLoc.hc.onComplete = function( a ) {
            var res = a.arguments[2] ;
            eval( "var winfo = " + res );

            _this.weainfo = winfo.query.results.channel.item.forecast[0];

            _this.onload( _this.weainfo );
        }
        SimpleLoc.hc.getWithAsync2( wurl );
    }
    this.codePicTable =[
        5,5,5,5,5,3,3,3,
        2,2,2,2,2,3,3,3,3,1,
        2,0,0,0,0,4,4,4,0,0,
        0,0,0,4,4,4,4,
        1,4,5,5,5,5,3,3,
        3,4,5,3,5];
    this.getPic = function( code ) {
        if ( ! isNaN(code) && code >= 0 && code < this.codePicTable.length ) {
            // alert(this.codePicTable[code]);
            switch( this.codePicTable[code] ) {
                case 0: return "image/weaicon2/cloudy.png";
                case 1: return "image/weaicon2/drizzle.png";
                case 2: return "image/weaicon2/dusty.png";
                case 3: return "image/weaicon2/hail.png";
                case 4: return "image/weaicon2/haze.png";
                case 5: return "image/weaicon2/heavy-rain.png";
                case 6: return "image/weaicon2/partly-sunny.png";
                case 7: return "image/weaicon2/sleet.png";
                case 8: return "image/weaicon2/snowy.png";
                case 9: return "image/weaicon2/sunny.png";
                case 10: return "image/weaicon2/thunderstorm.png";
                case 11: return "image/weaicon2/tornado.png";
                case 12: return "image/weaicon2/windy.png";
            }
        }
        return "image/weaicon/sunny.png";
    }

    this.codePicTable =[
        11,11,11,10,10,7,7,7,1,7,
        7,5,5,8,7,8,8,3,2,2,
        4,4,4,12,12,1,0,0,0,6,
        6,9,9,9,9,3,9,10,10,10,
        1,8,8,8,0,10,8,10];

    this.getText = function( code ) {
        if ( ! isNaN(code) && code >= 0 && code < this.codePicTable.length ) {
            switch( this.codePicTable[code] ) {
                case 0: return "多云";
                case 1: return "小雨";
                case 2: return "灰尘";
                case 3: return "冰雹";
                case 4: return "有雾";
                case 5: return "大雨";
                case 6: return "局部晴朗";
                case 7: return "雨夹雪";
                case 8: return "雪";
                case 9: return "晴朗";
                case 10: return "雷雨";
                case 11: return "龙卷风";
                case 12: return "风";
            }
        }
        return "晴天";
    }
}

// var simpleLoc = new SimpleLoc();
var weather = new Weather();
weather.onload = function( winfo ) {
    var t = winfo.current_observation.condition.temperature +"°";
    var w = winfo.current_observation.condition.code;
    var wt = winfo.current_observation.condition.text;
    this.weaEle.innerHTML = wt + "  " + t +"<br>Nuwara Eliya" ;
    this.wealogo.src = this.getPic( w );
}


// var locId = url.match(new RegExp("[\?\&]locId=([^\&]*)(\&?)","i"));
// if ( locId ) {
// 	SimpleLoc.locEle = document.getElementById(locId[1]);
// }
var scr = document.getElementsByTagName('SCRIPT');
var url = scr[scr.length - 1].src;
var city = "Nuwara Eliya";
// var city = "Beijing";
var wlogo =  url.match(new RegExp("[\?\&]wlogo=([^\&]*)(\&?)","i"))[1];
var wtemp =  url.match(new RegExp("[\?\&]wtemp=([^\&]*)(\&?)","i"))[1];

weather.wealogo = document.getElementById(wlogo);
weather.weaEle = document.getElementById(wtemp);

setInterval(weather.load(city), 1000 * 60 * 10);
weather.load( city );

