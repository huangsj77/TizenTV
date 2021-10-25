    var adInfo = {};
    adInfo.getDevInfo = function() {
      adInfo.devInfo = new DeviceInfo();
      adInfo.devInfo.onload = function(info) {
        adInfo.dev_contacts = info.contacts;
        adInfo.onGetDevInfo( adInfo.dev_contacts );     
      }
      adInfo.devInfo.load();
    }

    adInfo.getCateID = function( contacts ) {
        var ad_cid = localStorage.getItem("AD_CATE");
        if ( ! ad_cid )
          return;
        adInfo.total_cid =  ad_cid ; 

        var cateList = new CateList();
        cateList.onload = function( list ) {
          adInfo.cid = 0;
          for( var i=0;i<list.length; i++) {
            if ( list[i].cat_name == "default" )
              adInfo.cid = list[i].cat_id;
            else if ( list[i].cat_name == contacts ) {
              adInfo.cid = list[i].cat_id;
              break;
            }
          }
          if ( ! adInfo.cid ) 
            return;
          adInfo.onGetCateID( adInfo.cid );
        }
        cateList.load( ad_cid );
    }

    adInfo.getAdList = function( cid ) {
      var itemList = new ItemList();
      itemList.onload = function( list ) {
        for( var i = 0; i<list.length; i++ ) {
          var mediaItem = new MediaItem();
          mediaItem.onload = function(info) {
            var murl = info.urlAddress;
            adInfo.onUpdateADList( murl );
          }
          mediaItem.load( list[i].id );
        }
      }
      itemList.load( cid, 1, 50 );
    }

    adInfo.ad_videos = [];
    adInfo.getOneAdUrl = function() {
      if ( ! adInfo.ad_videos.length )
        return "";
      var idx = Math.floor(Math.random() * adInfo.ad_videos.length);
      return adInfo.ad_videos[idx];
    }

    adInfo.onUpdateADList = function( murl ) {
      adInfo.ad_videos.push( murl )
    }

    adInfo.onGetCateID = function( cid ) {
      adInfo.getAdList(cid);
    }

    adInfo.onGetDevInfo = function(contacts) {
      adInfo.getCateID(contacts)
    }
