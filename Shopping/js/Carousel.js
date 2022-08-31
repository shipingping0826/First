;(function(window,undefined){
    var Carousel=function(){
        this.settings={
            // 轮播图父级的id,必须传的参数
            id:'pic',
            // 自动播放,true为自动,false为不自动,默认为true。
            autoplay:true,
            // 间隔时间,运动后停顿的时间,默认为1s。
            intervalTime:1000,
            // 循环播放,true为循环。false为不循环,默认为true。
            loop:true,
            // 图片总量。
            totalNum:5,
            // 单次运动的图片数量。(图片总量必须为运动数量的整倍数)
            moveNum:1,
            // 小圆点功能,true为显示。false为不显示,默认显示。
            circle:true,
            // 运动方式,opacity为透明度过渡,position为位置过渡。
            moveWay:'opacity'
        };
    };
    Carousel.prototype={
        constructor:Carousel,
        init:function(opt){
            var opt=opt||this.settings;
            for(var attr in opt){
                this.settings[attr]=opt[attr];
            }
            this.createDom();
        },
        // 创建结构
        createDom:function(){
            var This=this;
            this.box = document.getElementById(this.settings.id);

            // 创建“上一个”按钮
            this.prevBtn=document.createElement("div");
            this.prevBtn.className = 'prev';
            this.prevBtn.innerHTML = '<';
            this.prevBtn.onclick = function(){
                This.prev();
                This.trigger('leftClick');
            }
            this.box.appendChild(this.prevBtn);

            // 创建“下一个”按钮
            this.nextBtn=document.createElement("div");
            this.nextBtn.className = 'next';
            this.nextBtn.innerHTML = '>';
            this.nextBtn.onclick = function(){
                This.next();
                This.trigger('rightClick');
            }
            this.box.appendChild(this.nextBtn);

            // 创建小圆点
            this.circleWrap=document.createElement("div");
            this.circleWrap.className='circle';

            // 存圆点，后面需要修改圆点的class,使用数组存起来方便
            this.circles=[];
            for(var i=0;i<this.settings.totalNum/this.settings.moveNum;i++){
                var span=document.createElement("span");
                span.index=i;
                span.onclick=function(){
                    This.cn=this.index;
                    This[This.settings.moveWay+'Fn']();
                };
                this.circleWrap.appendChild(span);
                this.circles.push(span);
            }
            this.circles[0].className='active';
            if(this.settings.circle){
                this.box.appendChild(this.circleWrap);
            };
            this.moveInit();
        },
        // 运动初始化功能
        moveInit:function(){
            // 当前的索引
            this.cn=0;
            // 上一个的索引
            this.ln=0;
            // 是否可以再次点击
            this.canClick=true;
            // 停止条件
            this.endNum=this.settings.totalNum/this.settings.moveNum;
            // 运动透明度的元素
            this.opacityItem=this.box.children[0].children;
            // 运动位置的元素的父级
            this.positionItemWrap=this.box.children[0].children[0];
            // 运动位置的所有元素
            this.positionItem=this.positionItemWrap.children;
            
            switch(this.settings.moveWay){
                // 如果走的是透明度,需要设置透明度与transition
                case 'opacity':
                    for(var i=0;i<this.opacityItem.length;i++){
                        this.opacityItem[i].style.opacity=0;
                        this.opacityItem[i].style.transition='0.3s opacity';
                    }
                    this.opacityItem[0].style.opacity=1;
                    break;
                // 如果走的是位置，需要设置父级的宽度
                case 'position':
                    var leftMargin=parseInt(getComputedStyle(this.positionItem[0]).marginLeft);
                    var rightMargin=parseInt(getComputedStyle(this.positionItem[0]).marginRight);
                    // 一个运动元素的宽度
                    this.singleWidth=leftMargin+this.positionItem[0].offsetWidth+rightMargin;
                    // 如果运动是循环的，需要复制一份内容
                    if(this.settings.loop){
                        this.positionItemWrap.innerHTML+=this.positionItemWrap.innerHTML;
                    }
                    // 复制内容后才可以设置宽度
                    this.positionItemWrap.style.width=this.singleWidth*this.positionItem.length+'px';
            }
            if(this.settings.autoplay){
                this.autoPlay();
            }
        },
        // 透明度运动方式
        opacityFn:function(){
            // 左边到头
            if(this.cn<0){
                if(this.settings.loop){
                    // 循环
                    this.cn=this.endNum-1;
                }else{
                    // 不循环
                    this.cn=0;
                    this.canClick=true;
                }
            }
            // 右边到头
            if(this.cn>this.endNum-1){
                if(this.settings.loop){
                    this.cn=0;
                }else{
                    this.cn=this.endNum-1;
                    this.canClick=true;
                }
            }
            this.opacityItem[this.ln].style.opacity=0;
            this.circles[this.ln].className='';

            this.opacityItem[this.cn].style.opacity=1;
            this.circles[this.cn].className='active';

            var This=this;
            var en=0;
            this.opacityItem[this.cn].addEventListener('transitionend',function(){
                en++;
                if(en==1){
                    This.canClick=true;
                    This.ln=This.cn;
                    This.endFn();
                }
            });
        },
        positionFn:function(){
            // 左边到头
            if(this.cn<0){
                if(this.settings.loop){
                    // 循环
                    this.positionItemWrap.style.left=-this.positionItemWrap.offsetWidth/2+'px';
                    this.cn=this.endNum-1;
                }else{
                    // 不循环
                    this.cn=0;
                }
            }
            // 右边到头
            if(this.cn>this.endNum-1){
                if(this.settings.loop){
                    // 循环,这里不需要做任何事情，需要在运动结束后去做条件判断
                }else{
                    // 不循环
                    this.cn=this.endNum-1;
                }
            }
            // 修改圆点，只有不循环的时候才去修改圆点
            if(!this.settings.loop){
                this.circles[this.ln].className='';
                this.circles[this.cn].className='active';
            }
            // left的值=一个元素的宽度×当前cn的值×一次运动元素的个数
            var This=this;
            move(this.positionItemWrap,{left:-this.cn*this.singleWidth*this.settings.moveNum},300,'linear',function(){
                if(This.cn==This.endNum){
                    this.style.left=0;
                    This.cn=0
                }
                This.endFn();
                This.canClick=true;
                This.ln=This.cn;
            });
        },
        // “上一个”按钮点击功能
        prev:function(){
            if(!this.canClick){
                return;
            }
            this.canClick=false;
            this.cn--;
            this[this.settings.moveWay+'Fn']();
        },
        // “下一个”按钮点击功能
        next:function(){
            if(!this.canClick){
                return;
            }
            this.canClick=false;
            this.cn++;
            this[this.settings.moveWay+'Fn']();
        },
        // 自动播放的功能
        autoPlay:function(){
            var This=this;
            this.timer=setInterval(function(){
                This.next();
            },this.settings.intervalTime);
            // 鼠标放上去的时候停止
            this.box.onmouseenter=function(){
                clearInterval(This.timer);
                This.timer=null;
            };
            // 鼠标离开的时候继续播放
            this.box.onmouseleave=function(){
                This.autoPlay();
            };
        },
        // 添加自定义事件,前后翻页按钮点击
        on:function(type,listener){
            this.events=this.events||{};
            this.events[type]=this.events[type]||[];
            this.events[type].push(listener);
        },
        trigger:function(type){
            if(this.events&&this.events[type]){
                for(var i=0;i<this.events[type].length;i++){
                    this.events[type][i].call(this);
                }
            }
        },
        endFn:function(){
            if(!this.settings.loop){
                if(this.cn==0){
                    this.trigger('leftEnd');
                }
                if(this.cn==this.endNum-1){
                    this.trigger('rightEnd');
                }
            }
        },
    };

    window.Carousel=Carousel;
})(window,undefined);