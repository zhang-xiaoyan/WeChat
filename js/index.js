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
        fnTab();
    }
    /* for(var i=0;i<arr.length;i++){
        var oImg=new Image();
        oImg.src=arr[i];
        oImg.onload=function(){// 所有图片onload之后，再进入页面跳转
            // 如果图片加载完了，动画还没有执行完
        }
    }*/
}
//bind(document,"touchmove",function(ev){
//    ev.preventDefault();
//});去掉这个，滚动条才可以滑动，拖拽的时候也不会有问题，因为.page使用了overflow:auto，之前是hidden
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
    //alert(!window.BfnScore);
    if(!window.BfnScore){// 防止事件重复调用，不要和函数重名了，因为函数也是属于window
        fnScore();// 在这里调用，是因为进入首页之后才能进行评分
        window.BfnScore=true;
    }
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
function fnScore(){
    var oScore=id("score");
    var aLi=oScore.getElementsByTagName("li");// 对li进行分组操作的
    var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
    for(var i=0;i<aLi.length;i++){
        fn(aLi[i]);// 每一个li
    }
    function fn(oLi){
        var aA=oLi.getElementsByTagName("a");
        //alert(aA.length);弹出3次，每次弹出的aA的长度为5
        var oInput=oLi.getElementsByTagName("input")[0];
        for(var i=0;i<aA.length;i++){
            aA[i].index=i;
            bind(aA[i],"touchstart",function(){
                //alert(this.index);
                for(var i=0;i<aA.length;i++){
                    if(i<=this.index){
                        addClass(aA[i],"active");
                    }else{
                        removeClass(aA[i],"active");
                    }
                }
                // oInput.value=this.index+1;// 一般都是从1分开始记得
                oInput.value=arr[this.index];// 这样可以看到具体的评价
            });
        }
    }
    if(!window.BfnIndex){
        fnIndex();// 评分之后调用这个函数
        window.BfnIndex=true;
    }
}
function fnInfo(oInfo,sInfo){
    oInfo.innerHTML=sInfo;
    oInfo.style.webkitTransform="scale(1)";
    oInfo.style.transform="scale(1)";
    oInfo.style.opacity=1;
    // 如果你想用transitionEnd事件，动画执行完立马就执行了，我们用一下setTimeout设置一下，我们需要停留1s钟
    setTimeout(function(){
        oInfo.style.webkitTransform="scale(0)";
        oInfo.style.transform="scale(0)";
        oInfo.style.opacity=0;
    },1000);
}
function fnIndex(){
    var oIndex=id("index");
    var oBtn=oIndex.getElementsByClassName("btn")[0];
    var oP=oIndex.getElementsByClassName("info")[0];
    var bScore=false;
    bind(oBtn,"touchend",fnEnd);
    function fnEnd(){
        //alert(1);
        bScore=fnScoreChecked();
        //console.log(bScore);
        if(bScore){
            if(bTag()){
                //alert("执行页面跳转");
                fnIndexOut();
            }else{
                fnInfo(oP,"请给景区添加标签");
            }
        }else{
            fnInfo(oP,"请给景区评分");
        }
    }
    function fnScoreChecked(){
        var oScore=id("score");
        var aInput=oScore.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++){
            if(aInput[i].value==0){
                return false;
            }
        }
        return true;
    }
    function bTag(){
        var oPicList=id("index");
        var oTag=oPicList.getElementsByClassName("tags")[0];
        var aInput=oTag.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++){
            if(aInput[i].checked){
                return true;
            }
        }
        return false;
    }
}
function fnIndexOut(){
    var oMask=id("mask");
    var oIndex=id("index");
    var oNews=id("news");
    addClass(oMask,"pageShow");
    addClass(oNews,"pageShow");
    if(!window.BfnNews){
        fnNews();
        window.BfnNews=true;
    }
    // 原本元素是隐藏的，后来添加class之后，元素显示出来，在这个渲染过程中，动画transition是不会显示出来的
    // 也就是display:block和display:none这个渲染过程中是不起动画效果的
    // 用setTimeout来处理一下,等渲染完之后动画就起作用了
    // 跳转页出来之后，首页变得模糊了
    setTimeout(function(){
        oMask.style.opacity=1;
        oIndex.style.filter="blur(5px)";
        oIndex.style.webkitFilter="blur(5px)";
    },14);
    // 为什么不用transtionEnd？因为这个是动画执行完就直接消失了，我们需要停留几秒钟，所以用setTimeout
    setTimeout(function(){
        oNews.style.transition=0.5+"s";
        oMask.style.opacity=0;
        oIndex.style.filter="blur(0px)";
        oIndex.style.webkitFilter="blur(0px)";
        oNews.style.opacity=1;
        removeClass(oMask,"pageShow");
    },3000)
}
function fnNews(){
    var oNews=id("news");
    var oInfo=oNews.getElementsByClassName("info")[0];
    var aInput=oNews.getElementsByTagName("input");
    aInput[0].onchange=function(){
        //console.log(this.files);
        //this.files[0].type得到的行为xxx/xxx，我们需要是/前面的，需要处理一下
        //this.files[0].type.split("/")[0]
        if(this.files[0].type.split("/")[0]=="video"){
            fnNewsOut();
        }else{
            fnInfo(oInfo,"请上传视频");
        }
    };
    aInput[1].onchange=function(){
        if(this.files[0].type.split("/")[0]=="image"){
            fnNewsOut();
            this.value="";// 这样当你传第2张图片与第1张相同的时候，清除掉缓存问题
            // 正常如果有后端的话，是提交之后再清空的
        }else{
            fnInfo(oInfo,"请上传图片");
        }
    };
}
function fnNewsOut(){
    var oNews=id("news");
    var oForm=id("form");
    addClass(oForm,"pageShow");// 先显示出来上一个页面再消失掉，然后
    oNews.style.cssText="";// 需要把行间的东西清空
    removeClass(oNews,"pageShow");
    if(!window.BformIn){
        formIn();
        window.BformIn=true;
    }
}
function formIn(){
    var oForm=id("form");
    var oOver=id("over");
    var aFormTag=id("formTag").getElementsByTagName("label");
    var oBtn=oForm.getElementsByClassName("btn")[0];
    var boff=false;// 判断是否可以提交
    for(var i=0;i<aFormTag.length;i++){
        bind(aFormTag[i],"touchend",function(){
           // console.log(1);
            boff=true;
            addClass(oBtn,"submit");
        });
    }
    bind(oBtn,"touchend",function(){
        if(boff){
            for(var i=0;i<aFormTag.length;i++){
                aFormTag[i].getElementsByTagName("input")[0].checked=false;
            }
            // alert("可以提交了");
            boff=false;// 变成false，保证下次还要走这个验证的
            addClass(oOver,"pageShow");
            removeClass(oForm,"pageShow");
            removeClass(oBtn,"submit");
            over();
        }
    })
}
function over(){
    var oOver=id("over");
    var oBtn=oOver.getElementsByClassName("btn")[0];
    bind(oBtn,"touchend",function(){
        removeClass(oOver,"pageShow");
    });
}