

function LiveTVData() {
	this.storagename = "livetv_data5";
	
	this.auth = new Auth();
	this.livelist = new LiveList();
	this.itemlist = new LiveItemList();

	this.update = function() {
		this.auth.self = this;
		this.auth.oninit = function() {
			this.self.livelist.load( 1, this.getID() , true);
		}
		this.auth.init();
	}
	this.onupdate = function() {
		console.log("all data update!");
	}
	this.delayupdate = function( sec ) {
		setTimeout( this.update.bind(this) , sec * 1000 );
	}

	this.livelist.self = this;
	this.chandata = {};
	this.chandata.chan = {};
	this.livelist.onload = function( chns, cates ) {
		// alert("livelist load: " + JSON.stringify(cates));
		this.self.chandata.catelist = cates;
		this.self.loadcate( 0 );
	}

	this.itemlist.self = this;
	this.itemlist.onload = function( chns ) {
//		alert(JSON.stringify(chns));
		// console.log( this.apiurl + "\n" + JSON.stringify(chns) );
		this.self.chandata.catelist[this.self.cidx].chanlist = chns;
		// this.self.chandata.chan[this.cid] = chns;
		this.self.loadcate( this.self.cidx + 1 );
	}

	this.loadcate = function( idx ) {
		if ( idx >= this.chandata.catelist.length ) {
			console.log("load all cate over...");
			localStorage.setItem(this.storagename, JSON.stringify(this.chandata) );
			this.onupdate();
			return;
		}

		this.cidx = idx;
		var cate = this.chandata.catelist[idx];
		this.onbeforeloadcate( cate );
		this.itemlist.load( cate.app_id, this.auth.getID() , true );
	}

	this.onbeforeloadcate = function( cate ) {
	}

	this.init = function() {
		this.delayupdate( 2 );

		if( ! this.chandata.catelist ) {
			var data = localStorage.getItem( this.storagename );
			if ( !! data ) {
				this.chandata = JSON.parse(data);
			}
		}
		if( ! this.chandata.catelist ) 
			return false;
		return true;
	}

	this.getcatelist = function() {
		return this.chandata.catelist;
	}

	this.fixchannum = function() {
		if( ! this.chandata.catelist ) return;
		var catelist = this.chandata.catelist;
		var count = 1;
		for( var i=0; i<catelist.length; i++ ) {
			var chanlist = catelist[i].chanlist;
			for( var j=0; j<chanlist.length; j++ ) {
				chanlist[j].tv_num_o = count++;
			}
		}
	}
}

