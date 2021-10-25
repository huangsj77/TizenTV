
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

	this.reset = function() {
		this.eles = this.parentEle.getElementsByTagName("a");
		for( var i=0; i<this.eles.length; i++ ) {
			var ele = this.eles[i];
			if( typeof(ele.autolister) == "undefined" ) {
				console.log("init element with AutoLister focusHandler");
				ele.addEventListener("focus", AutoLister.focusHandler, false);
			}
			ele.autolister = this;
			ele.autolister_idx = i;
		}
		for( var i= 0; i<this.pageSize; i++ ) {
			var ele = this.eles[ this.startIndex + i ];
			if ( !ele ) break;
			ele.style.display="";
		}
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
		// console.log("onfocus :  ele.autolister_idx  " +  ele.autolister_idx  + " this.startIndex : " + this.startIndex + "  this.pageSize:  " +  this.pageSize );
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

