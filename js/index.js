/**
 * Created by Yanyan on 2016/2/2.
 */
function id(idname){
    return document.getElementById(idname);
}
function bind(obj,ev,fn){
    if(obj.addEventListener){
        obj.addEventListener(ev,fn,false);
    }else{
        obj.attachEvent("on"+ev,function(){
            fn.call(obj);
        })
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