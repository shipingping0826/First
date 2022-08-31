<template>
	<div id="subBar">
        <router-link to="/">
			<img src="../assets/images/logo.png" class="logo" alt="">
        </router-link>
		<div class="message">
			<p>欢迎您：{{username}}</p>
			<p>空闲桌位：{{freeNum}}桌</p>
			<p>正在点餐：{{orderingNum}}桌</p>
			<p>正在用餐：{{eattingNum}}桌</p>
			<p>{{tableId ? `当前桌子：${tableId}号桌` : `未选桌子`}}</p>
		</div>
		<ul class="action">
            <router-link to="/order" tag="li">
                <i>{{orderingNum}}</i><span class="iconfont">&#xe607;</span>已点
            </router-link>
            <router-link to="/table" tag="li">
                <span class="iconfont">&#xe62e;</span>座位
            </router-link>
            <router-link to="/admin" tag="li">
                <span class="iconfont">&#xe602;</span>后台
            </router-link>
			<li @click='logout'><span class="iconfont">&#xe66a;</span>退出</li>
		</ul>
	</div>
</template>

<script>
export default {
    data(){
        return {
            username: localStorage.getItem('order:isLogin')
        }
    },
    mounted(){
        this.$getTable();   //获取到所有的桌子
        this.$getOrdered(); //获取到已点的数据
        this.$getShopped(); //获取到已下单的数据
    },
    computed:{
        orderingNum(){  //点餐的数量
            return this.$store.getters.getOrdered.length
        },
        eattingNum(){   //用餐的数量
            return this.$store.getters.getShopped.length
        },
        freeNum(){  //空间的桌子=总数-点餐的数量-用餐的数量
            return this.$store.getters.getTables.list.length - this.orderingNum - this.eattingNum
        },
        tableId(){  //当前桌子的id
            return this.$store.getters.getTables.cur_id
        }
    },
    methods:{
        logout(){
            localStorage.removeItem('order:isLogin');
            localStorage.removeItem('order:token');
            this.$router.replace('/login');
        }
    }
};
</script>

<style scoped>
#subBar{
    width: 300px;
    height: 100vh;
    position: fixed;
}
.logo{
    width: 80%;
    display: block;
    margin: 50px auto;
}
.message{
    width: 200px;
    box-sizing: border-box;
    padding: 30px 0;
    margin: 0 auto 30px;

    color: #fff;
    line-height: 40px;
    text-align: center;
    position: relative;
}
.message::before,.message::after,.action::before,.action::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
}
.message::before{
    top: 0;
}
.message::after{
    bottom: 0;
}
.action{
    height: 300px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}
.action li{
    width: 50%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: #fff;
    font-size: 20px;
    cursor: pointer;
    position: relative;
}
.action span{
    font-size: 40px;
    margin-bottom: 10px;
}
.action li.ac,.action li:hover{
    color: #f9d163;
}
.action i{
    width: 20px;
    height: 20px;
    background: #ff8400;
    border-radius: 50%;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-style: normal;

    position: absolute;
    left: 70px;
    top: 26px;
}
.action::before{
    top: 50%;
}
.action::after{
    top: 50%;
    transform: rotate(90deg);
}
</style>