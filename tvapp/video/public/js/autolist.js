
function AutoLister( parentEle,  pageSize ) {

	if ( typeof( AutoLister.focusHandler ) != "function" ) {
		console.log("init AutoLister.focusHandler ");
		AutoLister.focusHandler = function( e ) {
		 	if( typeof( e.target.autolister ) == "undefined" ) {
		 		console.log("Error, Autolister focusHandler meet a invalid element: " + e.target.outerHTML );
		 		return;
		 	}
		 	e.target.autolister.onfocus( e.target );
		}
	}

	this.oninit = function() {}

	this.init = function( parentEle,  pageSize ) {
		this.parentEle = parentEle;
		this.eles = this.parentEle.getElementsByTagName("a");
		this.pageSize = pageSize;

		for( var i = pageSize; i<this.eles.length; i++ ) {
			this.eles[i].style.display = "none";
		}
		for( var i=0; i<this.eles.length; i++ ) {
			var ele = this.eles[i];
			if( typeof(ele.autolister) == "undefined" ) {
				console.log("init element with AutoLister focusHandler");
				ele.autolister = this;
				ele.addEventListener("focus", AutoLister.focusHandler, false);
				ele.autolister_idx = i;
			}
		}
		this.startIndex = 0;
		this.oninit();
	}

	this.show = function( idx , show_flag ) {
		if( idx < 0 ) return;
		if( idx >= this.eles.length ) return;

		var display_status = (show_flag) ? "" : "none";
		this.eles[idx].style.display = display_status;
	}

	this.onfocus = function( ele ) {
		if( isNaN( ele.autolister_idx ) ) {
			console.log("focus on a element not in list! : " + ele.outerHTML );
			return;
		}
		if( ele.autolister_idx == this.startIndex  ) {
			if ( this.startIndex <= 0 ) 
				return;
			this.show( this.startIndex -1, true);
			this.show( this.startIndex + this.pageSize - 1, false);
			this.startIndex --;
		}
		else if ( ele.autolister_idx == this.startIndex + this.pageSize - 1 ) {
			var lastIndex = this.startIndex + this.pageSize - 1;
			if ( lastIndex >= this.eles.length -1 )
				return;
			this.show( this.startIndex, false);
			this.show( lastIndex + 1, true);
			this.startIndex++;
		}
	}

	if( typeof(parentEle) != "undefined" )
		this.init( parentEle,  pageSize );
}



function TList( parentEle ) {
	this.parentEle = parentEle;
	if ( ! this.parentEle.style.position )
		this.parentEle.style.position = "relative";

	this.pageSize = 16;

	this.oninit = function() {}
	this.init = function( pageSize ) {
		this.eles = this.parentEle.getElementsByTagName("a");
		this.pageSize = pageSize;
		for( var i = pageSize; i<this.eles.length; i++ ) {
			this.eles[i].style.display = "none";
		}
		this.totalPage = Math.ceil( this.eles.length / this.pageSize );
		//console.log("item:  " + this.eles.length + " pagecount: " + this.totalPage );
		this.pageIndex = 1;
		this.oninit();
	}

	this.showPage = function( pageIndex ) {
		var startNo = this.pageSize * ( pageIndex - 1 );
		this.pageIndex = pageIndex;
		var lastEle = null;
		for( var i = 0 ; i <startNo; i++ ) {
			this.eles[i].style.display = "none";
		}
		for( var i = startNo; i<this.eles.length && i<startNo + this.pageSize; i++ ) {
			this.eles[i].style.display = "inline-block";
			lastEle = this.eles[i];
		}
		for( var i=startNo + this.pageSize; i<this.eles.length; i++) {
			this.eles[i].style.display = "none";
		}
		return lastEle;
	}

	this.getIndex = function() {
		return this.pageIndex;
	}

	this.nextPage = function() {
		if( this.pageIndex >= this.totalPage )
			return null;
		var nextStartNo = this.pageSize * this.pageIndex;
		this.showPage( this.pageIndex + 1);
		return this.eles[ nextStartNo ];
	}

	this.prevPage = function() {
		if ( this.pageIndex <= 1 )
			return null;
		return this.showPage( this.pageIndex -1 );
	}

}


