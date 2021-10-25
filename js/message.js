

const MESSAGE_URL = SERVER_URL + 'index.php/localboss/api/getmessage?mac=';
const FEEDBACK_URL = SERVER_URL + 'index.php/localboss/api/feedback?mac=';


function MessageAPI( did ) {
	this.id = did;

	this.onload = function( msglist ) {
	}

	this.get = function() {
		var uget = new EasyGet();
		uget.onsuccess = (function(u,d) {
			var _ugetdata = null;
			try{
				eval( '_ugetdata  = ' + d );
			}catch(e){ }
			this.msglist = _ugetdata;
			this.onload( _ugetdata );
		}).bind(this);
		uget.onerror = (function(e) {
			console.log("message get meet error: " + e );
			this.onload( null );
		}).bind(this);
		this.msgurl = MESSAGE_URL + this.id;
		// console.log( "msgurl: " + this.msgurl );
		uget.open( this.msgurl, true);
	}
}

function FeedBackAPI( did ) {
	this.id = did ;

	this.onload = function( code, msg ) {}

	this.send = function( title, content ) {
		var uget = new EasyGet();
		uget.onsuccess = (function(u,d){
			var _ugetdata = null;
			try{
				eval( '_ugetdata  = ' + d );
				this.onload( _ugetdata.code, _ugetdata.msg );
				return;
			}catch(e){}
			this.onload( -1, "" );
		}).bind(this);
		uget.onerror = (function(e) {
			this.onload( -1, "" );
		}).bind(this);

		this.fburl = FEEDBACK_URL + this.id+ "&did=" + this.id + "&title=" + encodeURIComponent( title ) + "&content=" + encodeURIComponent(content);
		uget.open( this.fburl, true );
	}
}


