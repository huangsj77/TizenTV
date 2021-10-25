
var _VttPos = {
   domChangeTime : 0,
   getPos : function(element, root_ele )
   {
       var x = 0;
       var y = 0;
       var ele = element;
       if ( ! root_ele ) root_ele = document.body;
       //找到父定位元素,并计算出在父定位元素中的位置.如果父定位没有,则默认为body
       while( ele && ele != root_ele )
       {
           x += ele.offsetLeft;
           y += ele.offsetTop;
           ele = ele.offsetParent;
       }
       return { x: x  , y: y , w: element.offsetWidth, h: element.offsetHeight };
   },
  
   findNearestDist : function( parentEle, children, offset, func )
   {
       var nearest = null;
       var dist = 90000000;
       for( var i = children.length - 1 ; i >= 0 ; i-- )
       {
           if ( children[i].offsetHeight <= 0 ) // style.display == "none" !
               continue;
               
           var xy = this.getPos( children[i], parentEle );
           var ndist = func( xy, offset );
           //比较所有父元素中距离最近的元素
           if ( ndist > 0 && ndist < dist )
           {
               dist = ndist;
               nearest = children[i];
           }
      }
      //console.log("findNearestDist  nearest " + nearest + " : " + dist );
      return [nearest, dist];
   },
   
   findNearest : function( element , func )
   {
       if ( ! element ) return null;
       var parentEle = element.offsetParent;
       if ( ! parentEle ) parentEle = document.body;
       var offset = this.getPos( element, parentEle );
       do {
           var near_a = this.findNearestDist( parentEle, parentEle.getElementsByTagName('a'), offset, func );
           var near_input = this.findNearestDist( parentEle, parentEle.getElementsByTagName('input'), offset, func );
           var near_select = this.findNearestDist( parentEle, parentEle.getElementsByTagName('select'), offset, func );
           var near_frame = this.findNearestDist( parentEle, parentEle.getElementsByTagName('iframe'), offset, func );

           var near1 = near_a[1] < near_input[1] ? near_a : near_input;
           var near2 = near1[1] < near_select[1] ? near1 : near_select;
           var near3 = near1[1] < near_frame[1] ? near2 : near_frame;
           
           if( near3[0] != null )
               return near3[0];

            try {
              var d = this.lastDirection;
              if ( !! parentEle[d] ) {
                var ele = parentEle[d]();
                if ( ele != null ) return ele;
              }
            }catch(e){}

           if ( parentEle == document.body )
              return null;
           parentEle = parentEle.offsetParent;
           if ( parentEle == null ) parentEle = document.body ;
           offset = this.getPos( element, parentEle );
               
       }while( parentEle != null );

       return null;
   },
   
   left  : function( xy, offset )
   {
       var dx = xy.x - offset.x;
       if ( dx + xy.w/2 > 0 ) return -1;
       
       var dy = xy.y - offset.y;
       return  dx * dx  + dy * dy * 5;
   },
   
   right : function( xy, offset )
   {
       var dx = xy.x - offset.x;
       if ( dx <= offset.w/2 ) return -1;
       
       var dy = xy.y - offset.y;
       return dx * dx  + dy * dy * 5;
   },
   
   up : function( xy, offset )
   {
       var dy = xy.y - offset.y;       
       //与当前元素同高度或比当前高度还要高.以致上面没有元素移动返回-1
       if ( dy + xy.h /2> 0 ) return -1;
       
       dx = xy.x - offset.x;
       return dx * dx * 5  + dy * dy;
   },
   
   down : function( xy, offset )
   {
       var dy = xy.y - offset.y;
       if ( dy <= offset.h/2 ) return -1;
       
       dx = xy.x - offset.x;
       return dx * dx * 5  + dy * dy;
   },
   
   getNext : function( element, nextidname )
   {
       var nextid = element.getAttribute( nextidname );
       if ( nextid  )
       {
           var m_currentEle = document.getElementById( nextid );
           if ( m_currentEle.offsetWidth != 0 )
              return m_currentEle;
       }
       return null;
   },
   
   findNextEle : function( element, direction )
   {
       var nb_attr =  direction + "id";
       var nb_name =  direction + "_element";
       var tm_name = direction + "_findtime";
       
       if ( !! element[ nb_name ] )
       {
           if ( element[ nb_name ].style.offsetWidth == 0 )
           {
               this.domChangeTime ++;
               element[ nb_name ] = null;
               element.xy = null;
           }
           else if (  (! element[ tm_name ] ) || ( element[tm_name] < this.domChangeTime ) )
           {
               element[ nb_name ] = null;
               element.xy = null;
           }
       }

       if ( ! element[ nb_name ] )
       {
           element[ nb_name ] = this.getNext( element, nb_attr );
           element[ tm_name ] = this.domChangeTime;
       }
       
       if ( ! element[ nb_name ] )
       {
          this.lastDirection = direction;
           element[ nb_name ] = this.findNearest( element, this[direction] );
           element[ tm_name ] = this.domChangeTime;
       }
       
       return element[ nb_name ];  
   },
   
   findLeft : function( element )
   {
      var e = this.findNextEle( element, "left");
       return e ? e:element;
   },
   
   findRight : function( element )
   {
      var e = this.findNextEle( element, "right");
       return e ? e:element;
   },
   findUp : function( element )
   {
      var e = this.findNextEle( element, "up");
      return e ? e:element;
   },
   findDown : function( element )
   {
      var e = this.findNextEle( element, "down");
       return e ? e:element;
   },
};

function VatataKeyMoveClass(){
  var m_prevEle = null;
  var m_currentEle = null;


  this.doBlur = function( ele ) {
    if(!ele) return;
    m_prevEle = ele;
  }

  this.setFocus42 = function()  {
    this.focusClass = "currentFocus";
    this.focusClassReg = new RegExp(this.focusClass,"g");
    this.doFocus = function( ele ) {
      if(!ele) return;
      var eles = document.getElementsByClassName( this.focusClass );
      for(var i=0; i<eles.length; i++ ) {
        var e = eles[i];
        e.className = e.className.replace( this.focusClassReg, "" );
        var bf = e.getAttribute("onblur");
        eval( bf );
      }
      m_currentEle = ele;
      ele.className+=(" "+ this.focusClass );
      var bf = ele.getAttribute("onfocus");
      eval( bf );
    }

      var p=document.createElement("button");
      p.style.width = "1px";
      p.style.height = "1px";
      p.style.overflow ="hidden";
      document.body.appendChild(p); 
      p.focus();

  }
  this.setFocus44 = function() {
    this.doFocus = function( ele ) {
      if(!ele) return;
      m_currentEle = ele;
      ele.focus();
    }
  }

  this.setFocus42();

  this.doEnter1 = function( ele ) {
    if(!ele) return;    
    m_currentEle = ele;
    var ev=document.createEvent("HTMLEvents");
    ev.initEvent("click",false,true);
    ele.dispatchEvent(ev);
  }

  this.doEnter = function( ele ) {
    if(!ele) return;    
    m_currentEle = ele;
    var ev=document.createEvent("MouseEvents");
    ev.initEvent("click",true,true);
    ele.dispatchEvent(ev);
  }
    
//  const KEY_W = 87
//  const KEY_S = 83;
//  const KEY_A = 65;
//  const KEY_D = 68;
//  const KEY_SPACE=32;
//  const KEY_F = 70;
  
  const KEY_W = 38
  const KEY_S = 40;
  const KEY_A = 37;
  const KEY_D = 39;
  const KEY_SPACE = 32;
  const KEY_F = 13;
  const KEY_B = 10009;
  const KEY_E = 10182;

  this.vttkeymove = function(e){
    var o_ele = m_currentEle;
      
    switch(e.keyCode){
      case KEY_W:{m_currentEle = _VttPos.findUp( m_currentEle );}break;
      case KEY_A:{m_currentEle = _VttPos.findLeft( m_currentEle );}break;
      case KEY_S:{m_currentEle = _VttPos.findDown( m_currentEle);}break;
      case KEY_D:{m_currentEle = _VttPos.findRight( m_currentEle );}break;
      case KEY_F:{
        this.doEnter(m_currentEle);
      }break;
      case KEY_B:{
    	  window.history.back();
      } break;
    }
    if(m_currentEle != o_ele ) {
      this.doBlur( o_ele );
      this.doFocus(m_currentEle);
    }
  }

  //默认初始化 body 下第一个
  this.initDefault = function(){
        var _ele = document;
        var _ele_body = _ele.body;
        
        if(arguments.length>=1&&arguments[0]){
          _ele = arguments[0];
          _ele_body = _ele;
        }
        
        //获取body中第一个input或者a,来从第一个移动的元素开始找
        var _body_first_ele = _ele_body.innerHTML.match(/<(input|a|select|iframe+)/)[1];
        
        var eles = _ele.getElementsByTagName(_body_first_ele);

        if ( eles && eles.length ) {
          //先清除原来的高亮元素,再设置focus元素
          if(m_currentEle)
            this.doBlur(m_currentEle);
          this.doFocus(eles[0]);
          return true;          
        }
        return false;
    }

    this.initById = function(id){
        //先清除原来的高亮元素,再设置focus元素
        if(m_currentEle)
          this.doBlur(m_currentEle);
        if ( typeof(id) == "string" )
          this.doFocus( document.getElementById(id));
        else
          this.doFocus( id );
    }

    this.focusCurEle = function() {
        if(m_currentEle) {
          this.doFocus(m_currentEle);           
        }
    }
    this.getCurEle = function() {
        return (m_currentEle);
    }
}

var VatataKeyMove = new VatataKeyMoveClass();

document.addEventListener("keydown",function(e){VatataKeyMove.vttkeymove(e);},false);        

if ( VatataKeyMove.initDefault() == false ) {
  setTimeout( function() {
    VatataKeyMove.initDefault();
  } , 1000 );
}

// window.addEventListener( "focus", function() {
//   //console.log("window on focus ...")
//   VatataKeyMove.focusCurEle();
// }, true);

