var Request = {
	QueryString : function(item,url){
		if( typeof url == "undefined") url = location.search;
		var svalue = url.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
		return svalue ? svalue[1] : svalue;
	},
	q : function(i,url) { return Request.QueryString(i,url) ; }
}