
function RecAction() {

}

var intent_obj = null;

var appmanager = null;
RecAction.process = function( nowdata ) {
    if(	nowdata.data_type=="app" ){

        var pkg_name = nowdata.bname;
        if ( appmanager == null )
            appmanager = wae.create("AppManager");

        if( !pkg_name ) {
            var appid = nowdata.param;
            if ( ! appid ) {
                var pkg_name = nowdata.path;
                if ( !! pkg_name ) {
                    RecAction.startapp( pkg_name, "","" );
                    return;
                }
            }
            var appitem = new AppItem();
            appitem.onload = function( iteminfo ) {
                if ( ! iteminfo ) {
                    alert("Fatal: no app information!");
                    return;
                }

                var versioninfo = iteminfo.update;

                if ( ! versioninfo ) {
                    if ( !!iteminfo.versions && iteminfo.versions.length > 0 )
                        versioninfo = iteminfo.versions[0];
                }
                if ( ! versioninfo ) {
                    alert("Fatal: no app release information!");
                    return;
                }
                pkg_name = versioninfo.bao;

                if( appmanager.isInstalled( pkg_name ) ) {
                    RecAction.openapk( pkg_name );
                    return;
                } else {
                    var r = confirm("確定安裝" + nowdata.title + "?");
                    if ( !r ) return;
                }
                // RecAction.installapk( nowdata.dataUrl );
                RecAction.installapk2(  versioninfo.url, pkg_name );
                return;
            }
            appitem.load( appid );
            return;
        }

        if( appmanager.isInstalled( pkg_name ) ) {
            RecAction.openapk( pkg_name );
            return;
        } else {
            var r = confirm("確定安裝" + nowdata.title + "?");
            if ( ! r ) return;
        }

        RecAction.installapk( nowdata.dataUrl );
    }else if( nowdata.data_type=="vod" ){
        var apkaction =nowdata.bao,appAddress = nowdata.path,url=nowdata.dataUrl;
        if( apkaction.indexOf("com.sxkj.travel") >=0 ) {
            if(!intent_obj){ intent_obj = wae.create("Intent"); }
            intent_obj.startActivity("com.sxkj.travel");
            // intent_obj.create("com.sxkj.travel","com.sxkj.travel.UniversalTimeActivity");
            // intent_obj.startActivity();
            return;
		}
        RecAction.startapp(apkaction,appAddress,url);
    }else if(nowdata.data_type=="apk"){
        var url=nowdata.url;
        RecAction.openapk(url);
    }else if(nowdata.data_type=="web"){
        var url=nowdata.path;
        RecAction.openweb(url);
    }else if(nowdata.data_type=="photo"){
        var apkaction = nowdata.bao,appAddress = nowdata.path,url=nowdata.dataUrl;
        RecAction.startapp(apkaction,appAddress,url);
    }else if(nowdata.data_type=="live"){
        var url =nowdata.path,title = nowdata.title,url=nowdata.path;
        RecAction.openLive(url, title);
    }else if ( nowdata.data_type == "1" ) {
        var url = nowdata.param;
        RecAction.openweb( url );
    }else if ( nowdata.data_type == "app2" ) {
        var path = nowdata.path;
        if ( path.indexOf("/") < 0 ) {
            var pkg_name = path;
            RecAction.openapk( pkg_name );
        } else {
            var pkg_name = path.substring(0, path.indexOf("/") );
            var act_name = path.substring( path.indexOf("/") + 1 );
            RecAction.openapk2( pkg_name, act_name );
        }
    }else{
        if(nowdata.bao&&nowdata.path){
            var apkaction =nowdata.bao,appAddress = nowdata.path,url=nowdata.param;
            RecAction.startapp(apkaction,appAddress,url)
        }else if(nowdata.bao&&!nowdata.path){
            var apkaction =nowdata.bao;
            RecAction.openapk(apkaction);
        }
    }
}

RecAction.openLive = function(url, title) {
    var apkaction = "com.tvata.liveplayer.OPEN";

    if(!intent_obj){
        intent_obj = wae.create("Intent");
    }
    intent_obj.create(apkaction);
    intent_obj.addData("url", url);
    intent_obj.addData("DATA", title);
    intent_obj.startActivity();
}


RecAction.openapk = function( pkg_name ){
    if(!intent_obj){ intent_obj = wae.create("Intent"); }
    intent_obj.startActivity(pkg_name);
}
RecAction.openapk2 = function( pkg_name, act_name ) {
    if(!intent_obj){ intent_obj = wae.create("Intent"); }

    intent_obj.startActivity(pkg_name, act_name );
}

RecAction.startapp = function(apkaction,appAddress,url){
    if(!intent_obj){ intent_obj = wae.create("Intent"); }
    if ( apkaction == "com.vatata.myapp.link.OPEN" ) {
        intent_obj.setIntentComponent("", "com.vatata.wae.localapp.LocalAppActivity");
    } else if ( apkaction == "com.tvata.cloud.wae.OPEN" || apkaction == "com.vatata.angel.link.OPEN" ) {
        intent_obj.setIntentComponent("", "com.vatata.wae.tvapp.TvAppActivity");
    } else {
        intent_obj.create(apkaction);
    }

    intent_obj.addData("url", appAddress);
    intent_obj.addData("DATA", url);


    intent_obj.startActivity();
}

RecAction.openweb = function(url){
    if(!intent_obj){ intent_obj = wae.create("Intent"); }
    intent_obj.startBrowser(url);
}

RecAction.installapk = function( dataUrl ) {

    var appItem = new AppItem();
    appItem.onload = function( iteminfo ) {
        // alert( JSON.stringify(iteminfo ));
        if ( !iteminfo ) {
            alert("Fatal! No package info!");
            return;
        }
        var versioninfo = iteminfo.update;
        var versionlist = iteminfo.versions;
        if ( !! versionlist && versionlist.length > 0 ) {
            versioninfo = versionlist[0];
        }

        if ( ! versioninfo ) {
            alert("Fatal! No Released version for app!");
            return;
        }

        var marketobj = wae.create("Market.Manager");
        var url = versioninfo.url;
        var pkgname = versioninfo.bao;
        marketobj.downloadInstallApp( url, pkgname );
    }

    appItem.load( dataUrl );
}

RecAction.installapk2 = function( downloadUrl, pkgname ) {
    var marketobj = wae.create("Market.Manager");
    marketobj.downloadInstallApp( downloadUrl, pkgname );
}


var recAction = RecAction;

