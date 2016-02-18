/**
 * Created by Yanyan on 2016/2/2.
 */
function id(idname){
    return document.getElementById(idname);
}
function bind(obj,ev,fn){
    if(obj.addEventListener){
        obj.addEventListener(ev, fn, false);
    }else{
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view(){
    return{
        w:document.documentElement.clientWidth,
        h:document.documentElement.clientHeight
    }
}
function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}
function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
function fnLoad(){// 预加载 做一些都是为了加载一些东西进来的，比如说图片
    var iTime=new Date().getTime();// 当前毫秒数
    var oW=id("welcome");
    var arr=[];
    var bImgLoad=true;// 通过一个变量记录图片是否加载完，等所有的加载完了，再变成true
    var bTime=false;// 动画的时间
    var oTimer=0;
    bind(oW,"webkitTransitionEnd",end);
    bind(oW,"transitionend",end);
    oTimer=setInterval(function(){
        if(new Date().getTime()-iTime>=5000){
            bTime=true;
        }
        if(bImgLoad&&bTime){
            clearInterval(oTimer);
            //alert("执行跳转");
            oW.style.opacity=0;
        }
    },1000);
    function end(){
        // alert("动画执行完毕！");
        removeClass(oW,"pageShow");
    }
    /* for(var i=0;i<arr.length;i++){
        var oImg=new Image();
        oImg.src=arr[i];
        oImg.onload=function(){// 所有图片onload之后，再进入页面跳转
            // 如果图片加载完了，动画还没有执行完
        }
    }*/
}
bind(document,"touchmove",function(ev){
    ev.preventDefault();
});
function fnTab(){
    var oTab=id("tabPic");// 把拖拽事件加给最外框
    var oList=id("picList");// 因为这个图片列表的下部分被挡住了
    var oMask=id("picMask");
    var aA=oMask.getElementsByTagName("nav")[0].children;
    // alert(aA.length);
    var iNow=0;
    var iX=0;// 记录translateX的
    var iW=view().w;// 记录一下屏幕的宽度，写640也可以，最好这样写
    var oTimer=0;
    var iStartTouchX=0;// 手指按下的时候记录一些数据
    var iStartX=0;
    auto();
    function auto(){
        oTimer=setInterval(function(){
            iNow++;
            iNow=iNow%aA.length;// 0,1,2,3,4
            tab();
        },2000);
    }
    bind(oTab,"touchstart",fnStart);
    bind(oTab,"touchmove",fnMove);
    bind(oTab,"touchend",fnEnd);
    function fnStart(ev){
        oList.style.transition="none";// 拖拽的时候把transition去掉，就不会出现迟钝的情况
        ev=ev.changedTouches[0];// 手指列表 拖拽只用一个手指，只要第一个就可以了
        iStartTouchX=ev.pageX;// 当前手指的坐标
        iStartX=iX;// 要移动的距离
        clearInterval(oTimer);// 手指按下的时候，停止定时器
    }
    function fnMove(ev){
        ev=ev.changedTouches[0];
        var iDis=ev.pageX-iStartTouchX;// 当前手指的位置与刚开始手指的位置之差，也就是手指移动的距离
        iX=iStartX+iDis;
        oList.style.transform="translateX("+ iX +"px)";
        oList.style.WebkitTransform="translateX("+ iX +"px)";
    }
    function fnEnd(){
        iNow=iX/iW;
        iNow=-Math.round(iNow);// 四舍五入
        console.log(iNow);
        if(iNow<0){
            iNow=0;
        }
        if(iNow>aA.length-1){
            iNow=aA.length-1;
        }
        tab();
        auto();
    }
    function tab(){
        iX=-iNow*iW;// 这里需要的是负值
        oList.style.transform="translateX("+ iX +"px)";
        oList.style.WebkitTransform="translateX("+ iX +"px)";
        oList.style.transition=0.5+"s";
        for(var i=0;i<aA.length;i++){
            removeClass(aA[i],"active");
        }
        addClass(aA[iNow],"active");
    }
}