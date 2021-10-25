var liveListControlStatus = false;
document.addEventListener("keydown", function (e) {
	console.log("keyCode= " + e.keyCode);
    var _controls = document.getElementById("list-controls");
    if(e.keyCode == "38"|| e.keyCode == window.tvKey.CH_UP) {
        if(_controls.classList.contains("list-controls-hide")) {
            tvlist._is_visible = false;
            tvlist.switchUpDown(false);
        }
    } else if(e.keyCode == "40"|| e.keyCode == window.tvKey.CH_DOWN) {
        if(_controls.classList.contains("list-controls-hide")) {
            tvlist._is_visible = false;     
            tvlist.switchUpDown(true);
        }
    } else if(e.keyCode == "37") {
        if(! _controls.classList.contains("list-controls-hide")) {
            tvlist.update(tvlist.cateidx - 1);
        }
    } else if(e.keyCode == "39") {
        if(! _controls.classList.contains("list-controls-hide")){
            tvlist.update(tvlist.cateidx + 1);
        }
    }
   
    
    if ( e.keyCode >= 48 && e.keyCode <= 57 ) {
    	numberpanel.checkNumber( e.keyCode );
        return;
    }
    
}, false);