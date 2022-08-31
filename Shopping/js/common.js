window.yx = {
    g: function (name) {
        return document.querySelector(name);
    },
    ga: function (name) {
        return document.querySelectorAll(name);
    },
    addEvent: function (obj, ev, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fn)
        } else {
            obj.attachEvent('on' + ev, fn);
        }
    },
    removeEvent: function (obj, ev, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(ev, fn)
        } else {
            obj.detachEvent('on' + ev, fn);
        }
    },
    // 获取元素与html的距离
    getTopValue: function (obj) {
        var top = 0;
        while (obj.offsetParent) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return top;
    },
    cutTime: function (target) {
        var currentDate = new Date();
        var v = Math.abs(target - currentDate);
        return {
            d: parseInt(v / (24 * 3600000)),
            h: parseInt(v % (24 * 3600000) / 3600000),
            m: parseInt(v % (24 * 3600000) % 3600000 / 60000),
            s: parseInt(v % (24 * 3600000) % 3600000 % 60000 / 1000)
        };
    },
    format: function (v) {
        return v < 10 ? '0' + v : v;
    },
    formatDate: function (time) {
        var d = new Date(time);
        return d.getFullYear() + '-' + yx.format(d.getMonth() + 1) + '-' + yx.format(d.getDate()) + ' ' + yx.format(d.getHours())
            + ':' + yx.format(d.getMinutes());
    },
    // 把url后面的参数解析成对象
    parseUrl: function (url) {
        var reg = /(\w+)=(\w+)/ig;
        var result = {};
        url.replace(reg, function (a, b, c) {
            result[b] = c;
        });
        return result;
    },

    public: {
        // 滑动出现吸顶导航------------------------------
        navFn: function () {
            var nav = yx.g('.nav');
            var lis = yx.ga('.navBar li');
            var subNav = yx.g('.subNav');
            var uls = yx.ga('.subNav ul');
            // 存储实际有用的li
            var newLis = [];
            // 首页是没有hover状态，所以要从1开始循环，后面的三个li也没有hover状态
            for (var i = 1; i < lis.length - 3; i++) {
                newLis.push(lis[i]);
            }

            for (var i = 0; i < newLis.length; i++) {
                newLis[i].index = uls[i].index = i;
                newLis[i].onmouseenter = uls[i].onmouseenter = function () {
                    newLis[this.index].className = 'active';
                    subNav.style.opacity = 1;
                    uls[this.index].style.display = 'block';
                }
                newLis[i].onmouseleave = uls[i].onmouseleave = function () {
                    newLis[this.index].className = '';
                    subNav.style.opacity = 0;
                    uls[this.index].style.display = 'none';
                }
            }

            yx.addEvent(window, 'scroll', setNavPos);
            setNavPos();
            function setNavPos() {
                nav.id = window.pageYOffset > nav.offsetTop ? 'navFix' : '';
            }
        },
        // 购物车部分
        shopFn() {
            // 购物车添加商品展示
            var productNum = 0;
            (function (local) {
                var totalPrice = 0;
                var ul = yx.g('.cart ul');
                var li = '';
                ul.innerHTML = '';
                for (var i = 0; i < local.length; i++) {
                    var attr = local.key(i);
                    var value = JSON.parse(local[attr]);
                    if (value && value.sign == 'productLocal') {
                        // 这个条件成立说明此刻的local就是主动添加的local
                        li += '<li data-id="' + value.id + '"><a href="#" class="img"><img src="' + value.img + '" alt=""></a>' +
                            '<div class="message"><p><a href="">' + value.name + '</a></p><p>' + value.spec.join(' ') + ' × ' + value.num + '</p>' +
                            '</div><div class="price">￥' + value.price + '.00</div><div class="close">X</div></li>';
                        totalPrice += parseFloat(value.price) * Number(value.num);
                    }
                }
                ul.innerHTML = li;
                // 更新购买商品的数量
                productNum = ul.children.length;
                yx.g('.cartWrap i').innerHTML = productNum;
                // 更新总价格
                yx.g('.cartWrap .total span').innerHTML = '￥' + totalPrice + '.00';
                // 删除商品的功能
                var closeBtns = yx.ga('.cart .list .close');
                for (var i = 0; i < closeBtns.length; i++) {
                    closeBtns[i].onclick = function () {
                        localStorage.removeItem(this.parentNode.getAttribute('data-id'));
                        yx.public.shopFn();
                        if (ul.children.length == 0) {
                            yx.g('.cart').style.display = 'none';
                        }
                    }
                }
                // 小红圈添加事件
                var cartWrap = yx.g('.cartWrap');
                var timer;
                cartWrap.onmouseenter = function () {
                    clearTimeout(timer);
                    yx.g('.cart').style.display = 'block';
                    scrollFn();
                }
                cartWrap.onmouseleave = function () {
                    timer = setTimeout(function () {
                        yx.g('.cart').style.display = 'none';
                    }, 100)
                }
            })(localStorage);
            // 购物车的滚动条
            function scrollFn() {
                var contentWrap = yx.g('.cart .list');
                var content = yx.g('.cart .list ul');
                var scrollBar = yx.g('.cart .scrollBar');
                var slide = yx.g('.cart .slide');
                var slideWrap = yx.g('.cart .slideWrap');
                var btns = yx.ga('.scrollBar span');
                var timer;
                // 设置倍数
                var beishu = content.offsetHeight / contentWrap.offsetHeight;
                // 设置滚动条是否显示
                scrollBar.style.display = beishu <= 1 ? 'none' : 'block';
                // 倍数的最大值
                if (beishu > 20) {
                    beishu = 20;
                }
                // 内容与内容的父级的倍数与滑块与滑块父级的倍数是相等的
                slide.style.height = slideWrap.offsetHeight / beishu + 'px';
                // 滑块的拖拽
                var scrollTop = 0;
                // 滑块可以走的最大距离
                var maxHeight = slideWrap.offsetHeight - slide.offsetHeight;
                slide.onmousedown = function (ev) {
                    var disY = ev.clientY - slide.offsetTop;
                    document.onmousemove = function (ev) {
                        scrollTop = ev.clientY - disY;
                        scroll();
                    }
                    document.onmouseup = function () {
                        this.onmousemove = null;
                    }
                    ev.cancelBubble = true;
                    return false;
                }
                // 滚轮滚动的功能
                myScroll(contentWrap, function () {
                    scrollTop -= 10;
                    scroll();
                    clearInterval(timer);
                }, function () {
                    scrollTop += 10;
                    scroll();
                    clearInterval(timer);
                });
                // 上下箭头点击的功能
                for (var i = 0; i < btns.length; i++) {
                    btns[i].index = i;
                    btns[i].onmousedown = function () {
                        var n = this.index;
                        timer = setInterval(function () {
                            scrollTop = n ? scrollTop + 10 : scrollTop - 8;
                            scroll();
                        }, 16)
                    }
                    btns[i].onmouseup = function () {
                        clearInterval(timer);
                    }
                }
                // 滑块区域的点击功能
                slideWrap.onmousedown = function (ev) {
                    timer = setInterval(function () {
                        var slideTop = slide.getBoundingClientRect().top + slide.offsetHeight / 2;
                        if (ev.clientY < slideTop) {
                            // 条件成立，说明此刻鼠标在滑块的的上面，滚动条应该往上走
                            scrollTop -= 5;
                        } else {
                            scrollTop += 5;
                        }
                        if (Math.abs(ev.clientY - slideTop) <= 5) {
                            clearInterval(timer);
                        }
                        scroll();
                    }, 16)
                }
                // 滚动条的主体功能
                function scroll() {
                    if (scrollTop < 0) {
                        scrollTop = 0;
                    } else if (scrollTop > maxHeight) {
                        scrollTop = maxHeight;
                    }
                    var scaleY = scrollTop / maxHeight;
                    slide.style.top = scrollTop + 'px';
                    content.style.top = -(content.offsetHeight - contentWrap.offsetHeight) * scaleY + 'px';
                }
                // 滚轮事件
                function myScroll(obj, fnUp, fnDown) {
                    obj.onmousewheel = fn;
                    obj.addEventListener('DOMMouseScroll', fn);
                    function fn(ev) {
                        if (ev.wheelDelta > 0 || ev.detail < 0) {
                            fnUp.call(obj);
                        } else {
                            fnDown.call(obj);
                        }
                        ev.preventDefault();
                        return false;
                    }
                }
            }
        },
        // 图片懒加载功能--------------------------------
        lazyImgFn: function () {
            yx.addEvent(window, 'scroll', delayImg);
            delayImg();
            function delayImg() {
                // 所有需要懒加载的图片
                var originals = yx.ga('.original');
                // 可视区的高度与滚动条的距离之和
                var scrollTop = window.innerHeight + window.pageYOffset;
                for (var i = 0; i < originals.length; i++) {
                    if (yx.getTopValue(originals[i]) < scrollTop) {
                        originals[i].src = originals[i].getAttribute('data-original');
                        // originals[i].removeAttribute('class');
                    }
                }
                // 当这个条件成立的时候，说明现在所有图片的地址都已经换成真实的地址了，此时就不需要再执行这个函数了
                if (originals[originals.length - 1].getAttribute('src') != 'images/empty.gif') {
                    yx.removeEvent(window, 'scroll', delayImg);
                }
            }
        },
        // 回顶部的功能-------------------------------------
        backUpFn: function () {
            var back = yx.g('.back');
            var timer;
            back.onclick = function () {
                var top = window.pageYOffset;
                timer = setInterval(function () {
                    top -= 150;
                    if (top <= 0) {
                        top = 0;
                        clearInterval(timer);
                    }
                    window.scrollTo(0, top);
                }, 16)
            };
        },

    }
}