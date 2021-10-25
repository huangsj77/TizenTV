
// todo , add message number support



(function () {
    var scr = document.getElementsByTagName('SCRIPT');
    var url = scr[scr.length - 1].src;
    var cat_id = url.match(new RegExp("[\?\&]cat_id=([^\&]*)(\&?)","i"));
    var divId = url.match(new RegExp("[\?\&]divId=([^\&]*)(\&?)","i"));
    if ( cat_id != null && divId != null ) {
    	// todo
    	var divEle = document.getElementById(divId[1]);
    	divEle.innerHTML = "";
    }
})();

