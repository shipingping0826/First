// 公用方法的调用
yx.public.navFn();
yx.public.lazyImgFn();
yx.public.backUpFn();
yx.public.shopFn();

// banner图轮播
var bannerPic=new Carousel();
bannerPic.init({
     id:'bannerPic',
     autoplay:true,
     intervalTime:3000,
     loop:true,
     totalNum:5,
     moveNum:1,
     circle:true,
     moveWay:'opacity',
})

// 新品首发图轮播
var newProduct=new Carousel();
newProduct.init({
     id:'newProduct',
     autoplay:false,
     intervalTime:3000,
     loop:false,
     totalNum:8,
     moveNum:4,
     circle:false,
     moveWay:'position',
})

newProduct.on('rightEnd',function(){
    this.nextBtn.style.background='#e7e2d7';
});

newProduct.on('leftEnd',function(){
    this.prevBtn.style.background='#e7e2d7';
});

newProduct.on('leftClick',function(){
    this.nextBtn.style.background='#d0c4af';
});

newProduct.on('rightClick',function(){
    this.prevBtn.style.background='#d0c4af';
});

// 人气推荐选项卡
(function(){
    var titles=yx.ga("#recommend header li");
    var contents=yx.ga("#recommend .content"); 
    for(var i=0;i<titles.length;i++){
        titles[i].index=i;
        titles[i].onclick=function(){
            for(var i=0;i<titles.length;i++){
                titles[i].className='';
                contents[i].style.display='none';
            }
            titles[this.index].className='active';
            contents[this.index].style.display='block';
        }
    }
})();

// 限时购
(function(){
    var timeBox=yx.g('#limit .timeBox');
    var spans=yx.ga('#limit .timeBox span');
    var timer=setInterval(showTime,1000);
    showTime();
    // 倒计时
    function showTime(){
        var endTime=new Date(2022,8,27,13);
        if(new Date()<endTime){
            var overTime=yx.cutTime(endTime);
            spans[0].innerHTML=yx.format(overTime.h);
            spans[1].innerHTML=yx.format(overTime.m);
            spans[2].innerHTML=yx.format(overTime.s);
        }else{
            clearInterval(timer);
        }
    };

    // 商品数据
    var boxWrap=yx.g('#limit .boxWrap');
    var str='';
    var item=json_promotion.itemList;
    for(var i=0;i<item.length;i++){
        str+='<div class="limitBox">'+
        '<a href="#" class="left scaleImg"><img class="original" src="images/empty.gif" data-original="'+item[i].primaryPicUrl+'"></a>'+
        '<div class="right">'+
            '<a href="#" class="title">'+item[i].itemName+'</a>'+
            '<p>'+item[i].simpleDesc+'</p>'+
            '<div class="numBar clearfix">'+
                '<div class="numCon"><span style="width:'+Number(item[i].currentSellVolume)/Number(item[i].totalSellVolume)*100+'%">'+
                '</span></div>'+
                '<span class="numTips">还剩'+item[i].currentSellVolume+'件</span>'+
            '</div>'+
            '<div>'+
                '<span class="xianshi">限时价</span>'+
                '<span class="fuhao">￥</span>'+
                '<strong>'+item[i].actualPrice+'</strong>'+
                '<span class="yuan">原价:￥'+item[i].retailPrice+'</span>'+
            '</div>'+
            '<a href="#" class="qianggou">立即抢购</a>'+
        '</div>'+
    '</div>'
    };
    boxWrap.innerHTML=str;
})();

// 大家都在说轮播图
var say=new Carousel();
say.init({
    id:'sayPic',
    autoplay:true,
    intervalTime:3000,
    loop:true,
    totalNum:3,
    moveNum:1,
    circle:false,
    moveWay:'position',
});