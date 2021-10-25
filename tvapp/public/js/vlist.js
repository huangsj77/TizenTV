
function VLister( parentEle,  pageSize ) {


	this.oninit = function() {}

	this.init = function( parentEle,  pageSize ) {
		this.parentEle = parentEle;
		this.eles = this.parentEle.getElementsByTagName("a");
		this.pageSize = pageSize;

		for( var i = pageSize; i<this.eles.length; i++ ) {
			this.eles[i].style.display = "none";
		}
		this.startIndex = 0;

		var _this = this;
		parentEle.style.position = "relative";
		parentEle['up'] = function() {
			return _this.prev();
		}
		parentEle['down'] = function() {
			return _this.next();
		}
		this.oninit();
	}

	this.show = function( idx , show_flag ) {
		if( idx < 0 ) return;
		if( idx >= this.eles.length ) return;

		var display_status = (show_flag) ? "" : "none";
		this.eles[idx].style.display = display_status;
	}

	this.prev = function() {
		if ( this.startIndex <= 0 ) 
			return null;
		this.show( this.startIndex -1, true);
		this.show( this.startIndex + this.pageSize - 1, false);
		this.startIndex --;
		return this.eles[ this.startIndex ];
	}

	this.next = function() {
		var lastIndex = this.startIndex + this.pageSize - 1;
		if ( lastIndex >= this.eles.length -1 )
			return null;
		this.show( this.startIndex, false);
		this.show( lastIndex + 1, true);
		this.startIndex++;

		return this.eles[ this.startIndex ];
	}

	if( typeof(parentEle) != "undefined" )
		this.init( parentEle,  pageSize );
}

