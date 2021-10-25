
function Timedate() {
	this.gettimestr = function() {
		var now =new Date(); 
		var h = now.getHours(); 
		var m = now.getMinutes(); 
			
		if ( m < 10 ) m = "0" + m;
		return h + ":" + m;
	}

	this.getdatestr = function () {
		var str = "";
		var now =new Date(); 
		
		var week_day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var mon = now.getMonth()+1; 
		var day = now.getDate(); 
		if ( day < 10 ) day = "0" + day;
		var year = now.getFullYear();
		
		return year + "-" + mon + "-" + day + " " +  week_day[now.getDay()];
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



