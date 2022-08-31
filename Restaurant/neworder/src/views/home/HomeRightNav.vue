<template>
	<ul class="navWrap">
		<!-- showFood需要传参数，所以调用的时候一定要把括号带上，不然后参数为事件对象 -->
		<li :class="{active:0==cur}" @click="showFood()">
			<span class="iconfont">&#xe618;</span>
			<span class="text">推荐</span>
		</li>
		<!-- 因为推荐并没有参与循环，所以它有一个索引值，而循环的li索引值应该从1开始 -->
		<li v-for="(nav,index) in navs" :key="nav.id" :class="{active:index + 1 == cur}"
			@click="showFood(index+1,nav.id)">
			<span class="iconfont" v-html="nav.icon"></span>
			<span class="text">{{nav.name}}</span>
		</li>
	</ul>
</template>

<script>
export default {
	data() {
		return {
			cur: 0, //当前点的导航的索引值
		};
	},
	mounted() {
		this.$getCategory(); //获取分类数据
		this.showFood();	//页面一加载需要请求一次推荐的数据
	},
	computed: {
		navs() {
			return this.$store.getters.getCategory;
		},
	},
	methods: {
		showFood(index = 0, id = 0) {	//两个默认值都是为推荐准备的
			//console.log(index);
			this.cur = index;	//选项卡

			this.getFood({ category_id: id });	//请求当前分类下的数据
		},
		getFood(data) {
			this.$fetch({
				url: "/api/dish_lists",
				data,
			}).then(res => {
				//这里是请求成功后要执行的代码，需要把数据更新到状态里
				this.$set(res, 'curCategoryId', data ? data.category_id : 0);	//更新数据。如果传了数据就取数据里的category_id，如果没有传数据就表示推荐调用了，传0
				this.$store.commit("updateFoodList", res)
			});
		},
	},
};
</script>

<style scoped>
.navWrap {
	display: flex;
}
.navWrap li {
	font-size: 24px;
	margin-right: 40px;
	cursor: pointer;
}
.navWrap li:hover,
.navWrap li.active {
	color: #f9d163;
}
.navWrap li span.iconfont {
	font-size: 26px;
	margin-right: 5px;
}
</style>