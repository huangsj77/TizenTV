
if (  ! _debuglog ) {
	var _debuglog = function( msg ) {
		console.log( msg );
	}
}

function Lang() {
	this.xmlHttp = new XMLHttpRequest();

	this.ajaxGet = function( url ) {
		this.xmlHttp.open("GET", url, false);
		this.xmlHttp.send(null);
		return this.xmlHttp.responseText;
	}

	this.setLangName = function( langName ) {
		localStorage.setItem( "Lang_langName", langName );
		waeparams.addContentProviderPersistenceWithAutoCommit("Lang_langName", langName );
	}

	this.getLangName = function( ) {
		var lang1 = localStorage.getItem("Lang_langName");
		var lang2 = lang1;
		try {
			lang2 = waeparams.getContentProviderPersistence("Lang_langName");
		}catch(e){}

		_debuglog( "localStorage return " + lang1 + " : waeparams return " + lang2 );

		// if( !lang1 ) lang1 = "简体中文";
        if( !lang1 ) lang1 = "ENGLISH";
		return (!!lang2) ? lang2 : lang1;
	}

	this.getLangID = function() {
		var lname = this.getLangName();
		_debuglog("langName is " + lname);
		if( lname == "繁體中文" )
			return "tw";
		if( lname == "简体中文" )
			return "cn";
		if( lname == "ENGLISH" )
			return "en";
		if( lname == "日本語" || lname.indexOf("日本") >= 0 )
			return "jp";
		if( lname == "한국어" )
			return "kr";
        if( lname == "ဗမာ" )
            return "mm";
		return "cn";
	}

	this.trmap = {};
	this.loadLangJson = function() {
		var jurl = location.href.replace( ".html", "_lang.json");
		_debuglog("try loadLangJson: " + jurl );
		var str = this.ajaxGet( jurl );
		if( ! str ) {
			_debuglog("lang json is empty");
			return;
		}
		try {
			var allmap = {};
			eval( "allmap = " + str );
			var trmap = allmap[ this.getLangName() ];
			if ( !trmap ) {
				_debuglog("lang data " + this.getLangName() + " not exist!");
				return;
			}
			this.trmap = trmap;
		}catch(e) { 
			_debuglog("lang json load error: " + e );
		}
	}

	this.translate = function( key ) {
		var v = this.trmap[key];
		return !!v ? v : key;
	}

}

function TR( key, langName ) {
	if ( ! TR.langObj ) {
        TR.langObj = new Lang();
        TR.langObj.loadLangJson();
	}

    if( typeof langName != "undefined") {
        TR.langObj.setLangName(langName);
        TR.langObj.loadLangJson();
    }
	return TR.langObj.translate(key);
}



