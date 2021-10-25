
function LPlayer( ) {
  this.isplaying = false;
  this.videos = null;
  this.index = 0;

  this.start = function() {
    if ( typeof(iwae) == "undefined" ) {
      alert("play video failed! it not be run on box!");
      return;
    }
    var _this = this;
    if ( typeof(wae) == "undefined" ) {
      setTimeout( function(){ _this.start();}, 3000 );
      return;
    }
    setTimeout( function(){ _this.do_start();}, 300 );
  }

  this.play_over = function( ok_or_err ) {}

  this.do_start =function() {
// console.log("player is do start ")
    this.player = wae.create("Media.VideoPlayer");

    var _this = this;
    this.player.setOnErrorListener();
    this.player.errorcount = 0;
    this.player.onError = function(e) {
      try{
        if( !_this.toast ) _this.toast = wae.create("Toast");
        _this.toast.showMessage("Play Failed! : "  + this.errorcount );
      }catch(e){}
      this.errorcount++;
      if ( this.errorcount > 5 ) {
        document.onkeydown( {keyCode: 0} );
        return;      
      }
      setTimeout( function(){ _this.playnext(); }, 1000);
      _this.play_over( false );
    }

    this.player.onCompletion = function(e) {
      this.errorcount = 0;
      setTimeout( function(){ _this.playnext(); }, 1000*1);
      _this.play_over( true );
    }

    this.player.onPrepared = function() {
      _this.player.setFullScreen();
      _this.player.start();
    }

    this.player.onBufferingUpdate = function() { }

    this.playnext();
    this.isplaying = true;
  }

  this.playnext = function() {
// console.log("player is playnext :  " + this.videos.length )
    if ( this.videos == null || this.videos.length == 0 ) {
      var _this = this;
      setTimeout( function() {_this.playnext();}, 1000);
      return;
    }

// console.log("player is playnext :  " + this.index )
    if ( this.index < 0 || this.index >= this.videos.length )
      this.index = 0;
    var murl = this.videos[this.index] ;
// console.log("player is playnext :  " + murl )
    this.index += 1 ;
    //alert( "setDataSource: " + murl)
    //murl = "/sdcard/TVATA/thyg_0.mp4";
    this.player.setDataSource( murl );
    this.player.setLocation(1,1,1,1);
    //this.player.setFullScreen();
    this.player.start();
  }

}
