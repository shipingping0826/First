// 调用公用方法
yx.public.navFn();
yx.public.backUpFn();


// 解析url
var params=yx.parseUrl(window.location.href);
// 产品对应的ID
var pageId=params.id;
// 产品对应的数据
var curData=productList[pageId];
// 404页面的出现
// if(!pageId||!curData){  
//     window.location.href='404.html';
// }

// 面包屑的功能
var positionFn=yx.g('#position');
positionFn.innerHTML='<a href="#">首页</a> >';
for(var i=0;i<curData.categoryList.length;i++){
    positionFn.innerHTML+='<a href="#">'+curData.categoryList[i].name+'</a> >';
};
positionFn.innerHTML+=curData.name;

// 左边产品图
(function(){
    // 左边图片切换功能
    var bigImg=yx.g('#productImg .left img');
    var smallImgs=yx.ga('#productImg .smallImg img');
    bigImg.src=smallImgs[0].src=curData.primaryPicUrl;
    var last=smallImgs[0];
    for(var i=0;i<smallImgs.length;i++){
        if(i){
            smallImgs[i].src=curData.itemDetail['picUrl'+i];
        } 
        smallImgs[i].index=i;
        smallImgs[i].onmouseover=function(){
            bigImg.src=this.src;
            last.className='';
            this.className='active';
            last=this;
        }
    }
    // 右边图片相关信息更换
    yx.g('#productImg .info h2').innerHTML=curData.name;
    yx.g('#productImg .info p').innerHTML=curData.simpleDesc;
    yx.g('#productImg .info .price').innerHTML='<div><span>售价</span><strong>￥'+curData.retailPrice+'.00</strong></div>'+
    '<div><span>促销</span><a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="tag">'+curData.hdrkDetailVOList[0].activityType+'</a>'+
    '<a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="discount">'+curData.hdrkDetailVOList[0].name+'</a></div>'+
    '<div><span>服务</span><a href="#" class="service"><i></i>30天无忧退款<i></i>48小时快速退款<i></i>满88元免邮费<i></i>网易自营品牌</a></div>';
    // 购买商品规格部分
    var format=yx.g('#productImg .fomat');
    // 存储所有的dd标签，方便后期使用
    var dds=[];
    for(var i=0;i<curData.skuSpecList.length;i++){
        var dl=document.createElement("dl");
        var dt=document.createElement("dt");
        dt.innerHTML=curData.skuSpecList[i].name;
        dl.appendChild(dt);
        for(var j=0;j<curData.skuSpecList[i].skuSpecValueList.length;j++){
            var dd=document.createElement("dd");
            dd.innerHTML=curData.skuSpecList[i].skuSpecValueList[j].value;
            dd.setAttribute('data-id',curData.skuSpecList[i].skuSpecValueList[j].id);
            dd.onclick=function(){
                changeProduct.call(this);
            };
            dds.push(dd);
            dl.appendChild(dd);
        }
        format.appendChild(dl);
    }
    // 规格点击功能部分
    function changeProduct(){
        if(this.className.indexOf('noclick')!=-1){
            return;
        }
        var curId=this.getAttribute('data-id');
        // 所有的dd
        var othersDd=[];
        // 与点击的id组合到的所有id,(去数据里检查这个组合的余量是否为0)
        var mergeId=[];
        for(var attr in curData.skuMap){
            if(attr.indexOf(curId)!=-1){
                var otherId=attr.replace(curId,'').replace(';','');
                for(i=0;i<dds.length;i++){
                    if(dds[i].getAttribute('data-id')==otherId){
                        othersDd.push(dds[i]);
                    }
                }
                mergeId.push(attr);
            }
        }
        var brothers=this.parentNode.querySelectorAll('dd');
        if(this.className=='active'){
            this.className='';
            for(var i=0;i<othersDd.length;i++){
                if(othersDd[i].className=='noclick'){
                    othersDd[i].className='';
                }
            }
        }else{
            for(var i=0;i<brothers.length;i++){
                if(brothers[i].className=='active'){
                    brothers[i].className='';               
                }
            }
            this.className='active';
            for(var i=0;i<othersDd.length;i++){
                if(othersDd[i].className=='noclick'){
                    othersDd[i].className='';
                }
                if(curData.skuMap[mergeId[i]].sellVolume==0){
                    othersDd[i].className='noclick';
                }
            }
        }
        addNum();
    }
    // 加减数量功能
    addNum();
    function addNum(){
        var actives=yx.ga('#productImg .fomat .active');
        var btnParent=yx.g('#productImg .number div');
        var btns=btnParent.children;
        var ln=curData.skuSpecList.length;
        // 打开加减功能
        if(actives.length==ln){
            btnParent.className='';
        }else{
            btnParent.className='noclick';
        }
        // 减号点击
        btns[0].onclick=function(){
            if(btnParent.className){
                return;
            }
            btns[1].value--;
            if(btns[1].value<0){
                btns[1].value=0
            }
        }
        // input点击
        btns[1].onfocus=function(){
            if(btnParent.className){
                this.blur();
            }
        }
        // 加号点击
        btns[2].onclick=function(){
            if(btnParent.className){
                return;
            }
            btns[1].value++;
            // if(btns[1].value>curData.skuMap[mergeId[i]].sellVolume){
            //     btns[1].value=curData.skuMap[mergeId[i]].sellVolume
            // }
        }
    }
})();

// 加入购物车
(function(){
    yx.public.shopFn();
	//加入购物车按钮
	var joinBtn=yx.g('#productImg .join');	
	joinBtn.onclick=function(){
        //选中规格的数量
		var actives=yx.ga('#productImg .fomat .active');	
        //用户选中的产品个数
		var selectNum=yx.g('#productImg .number input').value;	
		if(actives.length<curData.skuSpecList.length || selectNum<1){
			alert('请选择正确的规格以及数量');
			return;
		}
		var id='';			
		var spec=[];			
		for(var i=0;i<actives.length;i++){
			id+=actives[i].getAttribute('data-id')+';';
			spec.push(actives[i].innerHTML);
		}
		id=id.substring(0,id.length-1);
		var select={
			"id":id,
			"name":curData.name,
			"price":curData.retailPrice,
			"num":selectNum,
			"spec":spec,
			"img":curData.skuMap[id].picUrl,
            //给自己的local取一个标识，避免取到其它人的local
			"sign":"productLocal"		
		};
		//把声明的对象存到localStorage里面
		localStorage.setItem(id,JSON.stringify(select));
        yx.public.shopFn();
        // 点击加入购物车后购物车显示
        var cartWrap=yx.g('.cartWrap');
        cartWrap.onmouseenter();
        setTimeout(function(){
            yx.g('.cart').style.display='none';
        },2000)
    }
})();

// 大家都在看
(function(){
    var ul=yx.g('#look ul');
    var str='';
    for(var i=0;i<recommendData.length;i++){
        str+='<li><a href="#"><img src="'+recommendData[i].listPicUrl+'" alt=""></a>'+
        '<a href="#">'+recommendData[i].name+'</a><span>￥'+recommendData[i].retailPrice+'</span></li>';
    }
    ul.innerHTML=str;
    var allLook=new Carousel();
    allLook.init({
        id:'allLook',
        autoplay:false,
        intervalTime:3000,
        loop:true,
        totalNum:8,
        moveNum:4,
        circle:false,
        moveWay:'position',
    })
})();

// 详情功能
(function(){
    // 详情与评价选项卡
    var as =yx.ga('#bottom .title a');
    var tabs=yx.ga('#bottom .content>div');
    var ln=0;
    for(var i=0;i<as.length;i++){
        as[i].index=i;
        as[i].onclick=function(){
            as[ln].className='';
            tabs[ln].style.display='none';
            this.className='active';
            tabs[this.index].style.display='block';
            ln=this.index;
        }
    }
    // 详情内容下的产品参数
    var tbody=yx.g('.details tbody');
    for(var i=0;i<curData.attrList.length;i++){
        if(i%2==0){
            var tr=document.createElement("tr");
        }
        var td1=document.createElement("td");
        td1.innerHTML=curData.attrList[i].attrName;
        var td2=document.createElement("td");
        td2.innerHTML=curData.attrList[i].attrValue;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
    }
    var img=yx.g('.details .img');
    img.innerHTML=curData.itemDetail.detailHtml;
})();

// 评价功能
(function(){
    // 当前评价的数量
    var evaluateNum=commentData[pageId].data.result.length;
    var evaluateText=evaluateNum>1000?'999+':evaluateNum;
    yx.ga('#bottom .title a')[1].innerHTML='评价<span>('+evaluateText+')</span>';
    // 第一个代表全部评价，第二个代表有图的评价
    var allData=[[],[]];
    for(var i=0;i<evaluateNum;i++){
        allData[0].push(commentData[pageId].data.result[i]);
        if(commentData[pageId].data.result[i].picList.length){
            allData[1].push(commentData[pageId].data.result[i]);
        }
    }
    yx.ga('#bottom .eTitle span')[0].innerHTML='全部('+allData[0].length+')';
    yx.ga('#bottom .eTitle span')[1].innerHTML='有图('+allData[1].length+')';
    var curData=allData[0];
    var btns=yx.ga('#bottom .eTitle div');
    var ln=0;
    for(var i=0;i<btns.length;i++){
        btns[i].index=i;
        btns[i].onclick=function(){
            btns[ln].className='';
            this.className='active';
            ln=this.index;
            curData=allData[this.index];
            showComment(10,0);
            createPage(10,curData.length);
        }
    }
    // 显示评价数据
    showComment(10,0);
    function showComment(pn,cn){
        var ul=yx.g('#bottom .border>ul');
        var dataStart=pn*cn;
        var dataEnd=dataStart+pn;
        if(dataEnd>curData.length){
            dataEnd=curData.length;
        }
        var str='';
        ul.innerHTML='';
        for(var i=dataStart;i<dataEnd;i++){
            var avatart=curData[i].frontUserAvatar?curData[i].frontUserAvatar:'images/avatar.png';
            var smallImg='';
            var dialog='';
            if(curData[i].picList.length){
                var span='';
                var li='';
                for(var j=0;j<curData[i].picList.length;j++){
                    span+='<span><img src="'+curData[i].picList[j]+'"></span>';
                    li+='<li><img src="'+curData[i].picList[j]+'"</li>';
                }
                smallImg='<div class="smallImg clearfix">'+span+'</div>';
                dialog='<div class="dialog" id="commetImg'+i+'" data-imgnum="'+curData[i].picList.length+'"><div class="carouselImgCon">'+
                    '<ul>'+li+'</ul></div><div class="close">X</div></div>';
            }
            str+='<li><div class="avatar"><img src="'+avatart+'" alt=""><a href="#" class="vip1"></a><span>'+curData[i].frontUserName+'</span>'+
			'</div><div class="text"><p>'+curData[i].content+'</p>'+smallImg+'<div class="color clearfix">'+
			'<span class="left">'+curData[i].skuInfo+'</span><span class="right">'+yx.formatDate(curData[i].createTime)+'</span>'+
			'</div>'+dialog+'</div></li>';
        }
        ul.innerHTML=str;
        showImg();
    }
    // 调用轮播图组件
    function showImg(){
        var spans=yx.ga('#bottom .smallImg span');
        for(var i=0;i<spans.length;i++){
            spans[i].onclick=function(){
                var dialog=this.parentNode.parentNode.lastElementChild;
                dialog.style.opacity=1;
                dialog.style.height='510px';
                var en=0;
                dialog.addEventListener('transitionend',function(){
                    en++;
                    if(en==1){
                        var id=this.id;
                        var commentImg=new Carousel();
                        commentImg.init({
                            id:id,
                            totalNum:dialog.getAttribute('data-imgnum'),
                            autoplay:false,
                            loop:false,
                            moveNum:1,
                            circle:false,
                            moveWay:'position',
                        })
                    }
                })
                var closeBtn=dialog.querySelector('.close');
                closeBtn.onclick=function(){
                    dialog.style.opacity=0;
                    dialog.style.height=0;
                }
            }
        }
    }
    // 页码功能(pn是显示页码的数量,tn是数据的总数)
    createPage(10,curData.length);
    function createPage(pn,tn){
        var page=yx.g('.page');
        var totalNum=Math.ceil(tn/pn);
        if(pn>totalNum){
            pn=totalNum;
        }
        page.innerHTML='';
        var cn=0;
        var spans=[];
        var div=document.createElement("div");
        div.className='mainPage';
        var indexPage=pageFn('首页',function(){
            for(var i=0;i<pn;i++){
                spans[i].innerHTML=i+1;
            }
            cn=0;
            showComment(10,0);
            changePage();
        });
        if(indexPage){
            indexPage.style.display='none';
        }
        var prevPage=pageFn('<上一页',function(){
            cn--;
            if(cn<0){
                cn=0;
            }
            showComment(10,spans[cn].innerHTML-1);
            changePage();
        });
        if(prevPage){
            prevPage.style.display='none';
        }
        for(var i=0;i<pn;i++){
            var span=document.createElement("span");
            span.index=i;
            span.innerHTML=i+1;
            spans.push(span);
            span.className=i?'':'active';
            span.onclick=function(){
                cn=this.index;
                showComment(10,this.innerHTML-1);
                changePage(this);
            };
            div.appendChild(span);
        }
        page.appendChild(div);
        var nextPage=pageFn('下一页>',function(){
            cn++;
            if(cn>spans.length-1){
                cn=span.length-1
            }
            showComment(10,spans[cn].innerHTML-1);
            changePage(this);
        });
        var endPage=pageFn('尾页',function(){
            var end=totalNum;
            for(var i=pn-1;i>=0;i--){
                spans[i].innerHTML=end--;
            }
            cn=spans.length-1;
            showComment(10,totalNum-1);
            changePage();
        });
        function changePage(){
            var cur=spans[cn];
            var curInner=cur.innerHTML;
            var differ=spans[spans.length-1].innerHTML-spans[0].innerHTML;
            // 点击的是最后面的页码，页码要增加。
            if(cur.index==spans.length-1){
                if(Number(cur.innerHTML)+differ>totalNum){
                    differ=totalNum-cur.innerHTML;
                }
            }
            // 点击的是最前面的页码，页码要减少。
            if(cur.index==0){
                if(cur.innerHTML-differ<1){
                    // 如果减去差值的页码比1小,说明左边已经到头了。
                    differ=cur.innerHTML-1;
                }
            }
            for(var i=0;i<spans.length;i++){
                // 点击的是最后面的页码，所有的页码都需要增加
                if(cur.index==spans.length-1){
                    spans[i].innerHTML=Number(spans[i].innerHTML)+differ;
                }
                // 点击的是最前面的页码,此时所有的页码都需要减少。
                if(cur.index==0){
                    spans[i].innerHTML-=differ;
                }
                // 设置class
                spans[i].className='';
                if(spans[i].innerHTML==curInner){
                    spans[i].className='active';
                    cn=spans[i].index;
                }
            }
            // 显示与隐藏功能页码
            if(pn>1){
                // 点的是第一个页码,首页与上一页隐藏
                var dis=curInner==1?'none':'inline-block';
                indexPage.style.display=prevPage.style.display=dis;
                // 点击的是最后一页,下一页与尾页隐藏
                var dis=curInner==totalNum?'none':'inline-block';
                nextPage.style.display=endPage.style.display=dis;

            }
        }
        function pageFn(inner,fn){
            if(pn<2){
                return
            }
            var span=document.createElement("span");
            span.innerHTML=inner;
            span.onclick=fn;
            page.appendChild(span);
            return span;
        }
    }
})();