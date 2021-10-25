
function ShareData( key ) {
	this.key = key;

	var s = localStorage.getItem( this.key );
	this.o = {};
	try {
		if( !!s && s != "" ) this.o = JSON.parse(s) ;
	}catch(e) { }

	this.get = function( k ) {
		return this.o[k];
	}
	this.set = function( k, v ){
		this.o[k] = v;
		localStorage.setItem( this.key, JSON.stringify(this.o) );
	}
	this.remove = function(k) {
		delete this.o[k];
		localStorage.setItem( this.key, JSON.stringify(this.o) );
	}
	this.keys = function() {
//		console.log("keys from " + JSON.stringify(this.o) );
		var a = [];
		for(var k in this.o ) {
//			console.log("foreach " + k );
			a.push(k);
		}
//		console.log("keys: " + JSON.stringify( a ) );
		return a;
	}
	this.clearAll = function() {
		this.o = {};
		localStorage.setItem( this.key, JSON.stringify(this.o) );
		localStorage.removeItem( this.key );
	}
}

function CartItem( id ) {
	this.id = id;
	this.o = CartItem.sharedata.get( this.id );
	if ( ! this.o ) {
		this.o = { "id" : this.id,'name': "", 'price': 0, 'num': 0 };
	}

	this.add = function ( name, price, num ) {
		this.o = { "id" : this.id,'name': name, 'price': price, 'num': num };
		if ( num == 0 ) {
			CartItem.sharedata.remove( this.id );
		} else {
			CartItem.sharedata.set( this.id, this.o );
		}
	}
	this.getName = function() { return this.o.name ; }
	this.getNum = function() { return this.o.num; }
	this.getPrice = function() { return this.o.price; }

	this.hasAdd = function() {
		//console.log(" hasAdd " + this.id + " : " + this.o.num );
		return ( this.o.num > 0 );
	}
}
CartItem.key = "my_cart_key";
CartItem.sharedata = new ShareData( CartItem.key );
CartItem.getList = function() {
	return CartItem.sharedata.keys();
}
CartItem.clearAll = function() {
	CartItem.sharedata.clearAll();
}