<template>
	<div>
		<div class="box" v-for="cate in backDishes" :key="cate.category.id">
			<h3>{{cate.category.name}}</h3>
			<ul>
				<li v-for="dish in cate.lists" :key="dish.dish_id">
					<img :src="'http://order-api.chenxuehui.com/'+dish.image" alt="">
					<div class="bottom">
						<span class="name">{{dish.name}}</span>
						<span class="price">￥<strong>{{dish.price}}</strong>/份</span>
					</div>
					<span v-if="dish.recommend" class="iconfont recommend">&#xe60b;</span>
					<div class="edit">
						<span @click="del(dish.dish_id)" class="iconfont">&#xe610;</span>
						<span @click="showDialog(dish)" class="iconfont">&#xe64a;</span>
					</div>
				</li>
                <!-- 添加的时候需要传一个分类的id，其它的数据是用户填的 -->
				<li class="add" @click="showDialog({category_id:cate.category.id})"><span class="iconfont">&#xe608;</span></li>
			</ul>
		</div>

        <Edit :dialogVisible='show' :curDish='curDish' @closeDialog="close" @changeImage="changeImage" />
	</div>
</template>

<script>
import Edit from './DishTemplate'

export default {
	data() {
		return {
			backDishes: [
				//存储所有的后台菜品数据
			],
            show:false, //传给子组件的数据，用来决定浮层是否显示
            curDish:{   //当前点击的那道菜，传给子组件的数据

            }
		};
	},
	mounted() {
        this.getBackDish();
    },
	methods: {
		getBackDish() {
			this.$fetch({
				url: "/api/backend_dish_lists",
			}).then((res) => (this.backDishes = res.data)); //请求成功后把数据存储起来
		},
        del(dish_id){
            this.$confirm('您确定要删除吗？')
            .then(()=>{
                this.$fetch({
                    url:'/api/del_dish',
                    method:'POST',
                    data:{
                        dish_id
                    }
                }).then(()=>this.close())   //删除成功后要更新数据
            }).catch(()=>{})
        },
        close(){    //关闭弹出层
            this.getBackDish(); //关闭弹出层说明用户不想编辑，那第二次再打开的时候数据要变成原来的，所以再次请求一下数据
            this.show=false;  
        },
        showDialog(obj){
            this.show=true;

            this.curDish=obj;
        },
        changeImage(src){
            this.$set(this.curDish,'image',src);
        }
	},
    components:{
        Edit,
    }
};
</script>

<style>
.box {
	background: #fff;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
	margin: 0 20px 40px;
	padding: 10px;
	border-radius: 10px;
}
.box h3 {
	color: #495057;
	font-size: 30px;
	margin-bottom: 20px;
	padding-left: 10px;
}
.box ul {
	overflow: hidden;
}
.box li {
	width: 300px;
	height: 300px;
	float: left;
	margin: 0 10px 20px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
}
.box img {
	width: 100%;
	height: 100%;
}
.bottom {
	width: 100%;
	height: 50px;
	line-height: 50px;
	box-sizing: border-box;
	padding: 0 15px;
	display: flex;
	justify-content: space-between;

	background: rgba(0, 0, 0, 0.5);

	position: absolute;
	bottom: 0;
	left: 0;
	color: #fff;
}
.name {
	font-size: 20px;
}
.price strong {
	color: #ff8400;
	font-size: 20px;
	font-weight: normal;
}

.recommend {
	position: absolute;
	left: 5px;
	top: 5px;
	font-size: 50px;
	color: #ff8400;
}
.edit {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;

	display: flex;
	align-items: center;

	justify-content: space-around; /* 分散居中对齐 */
	background: rgba(0, 0, 0, 0.9);
	opacity: 0;
}
.edit span {
	color: #dbdbdb;
	font-size: 80px;
	cursor: pointer;
}
.edit span:hover {
	color: #ff8400;
}
.box li:hover .edit {
	opacity: 1;
	transition: 0.4s;
}

.add {
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border: 1px solid #ccc;
}
.add span {
	font-size: 200px;
	color: #ccc;
}
.add:hover {
	background: #eee;
	transition: 0.3s;
}
</style>