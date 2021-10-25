var Request = {
	QueryString : function(item, defValue){
		var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
		return svalue ? svalue[1] : defValue;
	},
	q : function(i,d) { return Request.QueryString(i,d) ; }
}