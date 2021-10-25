
function ADPlayer() {
  this.isplaying = false;
  this.murl = null;

  this.play = function( m_url ) {
    if ( typeof(iwae) == "undefined" ) {
      alert("play video failed! it not be run on box!");
      this.onover();
      return;
    }
    if ( ! m_url ) {
      this.onover();
      return;
    }
    this.murl = m_url;
    this.start();
  }

  this.start = function() {
    var _this = this;
    if ( typeof(wae) == "undefined" ) {
      setTimeout( function(){ _this.start();}, 3000 );
      return;
    }
    setTimeout( function(){ _this.do_start();}, 300 );
  }

  this.onover = function() {}

  this.do_start =function() {
    this.player = wae.create("Media.VideoPlayer");
    alert( this.player );
    var _this = this;
    this.player.setOnErrorListener();
    this.player.onError = function(e) {
      _this.onover();
    }

    this.player.onCompletion = function(e) {
      _this.onover();
    }

    this.player.onPrepared = function() {
      _this.player.setFullScreen();
      _this.player.start();
    }

    this.player.onBufferingUpdate = function() { }

    this.player.setDataSource( this.murl );
    this.player.setLocation(1,1,1,1);
    this.player.setFullScreen();
    this.player.start();

    this.isplaying = true;
  }

}
