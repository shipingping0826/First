<template>
	<div>
		<dl class="table">
			<dt>桌台数据</dt>
			<dd>
				<div>
					<strong>{{tables.length}}</strong>
					<span>开桌数</span>
				</div>
			</dd>
			<dd>
				<div>
					<strong>{{freeNum}}</strong>
					<span>空闲数</span>
				</div>
			</dd>
			<dd>
				<div>
					<strong>{{orderingNum}}</strong>
					<span>点餐数</span>
				</div>
			</dd>
			<dd>
				<div>
					<strong>{{eating.length}}</strong>
					<span>下单数</span>
				</div>
			</dd>
		</dl>

		<div class="list">
			<h3>桌台模式</h3>
			<ul>
				<li v-for="table in tables" :key="table.table_id"
					:class="{'eating': table.status==2, 'ordering': table.status==1}">
					<div>
						<span class="iconfont">&#xee58;</span>{{table.table_id}}号桌
						<button v-if="table.status==2" @click="lookOrder(table.table_id)">查看订单</button>
					</div>
					<p>
						<span>{{statusText[table.status]}}</span>
						<span>{{table.people_number}}人</span>
					</p>
				</li>
				<li class="add" @click="addTable"><span class="iconfont">&#xe608;</span></li>
			</ul>
		</div>

		<el-drawer :title="curTable.table_id+'号桌订单列表'" :visible.sync="drawer" :size="500" custom-class="myDrawer">
			<el-table :data="curTable.lists">   <!-- 传递给表格的数据 -->
				<el-table-column prop="name" label="菜品" width="200"></el-table-column>
				<el-table-column prop="num" label="数量" align="center"></el-table-column>
				<el-table-column label="是否上菜">
                    <template slot-scope="scope">
                        <!-- scope.row  代表的是数据里的每一条 -->
                        <el-switch v-model="scope.row.status" active-color="#ff8400" inactive-color="#ccc" :disabled="scope.row.status" @change="switchChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
			</el-table>
            <div class="orderMessage">
                <div>
                    <p>订单号：{{curTable.order.order_sn}}</p>
                    <p>下单时间：{{curTable.order.created_at}}</p>
                    <p>共消费：<strong>{{curTable.order.amount}}</strong></p>
                </div>
                <button @click="pay">结账</button>
            </div>
		</el-drawer>
	</div>
</template>

<script>
export default {
	data() {
		return {
			statusText: ["空闲中", "点餐中", "用餐中"],
            drawer:false,   //抽屉是否显示
            curTable:{  //当前点击的桌子对应的数据
                lists:[],
                order:{}
            }
		};
	},
	mounted() {
		this.$getTable(); //获取到所有的桌子
		this.$getOrdered(); //获取到已点的数据
		this.$getShopped(); //获取到已下单的数据
	},
	computed: {
		tables() {
			//所有桌子的数量
			return this.$store.getters.getTables.list;
		},
		orderingNum() {
			//点餐的数量
			return this.$store.getters.getOrdered.length;
		},
		eating() {
			//用餐的桌子
			return this.$store.getters.getShopped;
		},
		freeNum() {
			//空间的桌子=总数-点餐的数量-用餐的数量
			return this.tables.length - this.orderingNum - this.eating.length;
		},
	},
	methods: {
		addTable() {
			//添加桌子
			this.$fetch({
				url: "/api/inc_table_number",
				method: "POST",
			}).then(() => this.$getTable()); //添加成功后需要请求一下桌子的数据
		},
        lookOrder(table_id){
            this.drawer=true;

            this.$fetch({
                url:'/api/table_order_item',
                data:{
                    table_id,
                }
            }).then(res=>{
                this.curTable=res;
                this.$set(this.curTable,'table_id',table_id);   //请求的数据里不包括table_id
            })
        },
        switchChange(food){
            // console.log(food);
            this.$fetch({
                url:"/api/send_dish",
                method:'POST',
                data:{
                    id:food.order_item_id,
                }
            }).then(()=>this.$alert('上菜成功'))
        },
        pay(){
            if(this.curTable.lists.some(item=>!item.status)){
                //这个条件成立，说明有一道菜没有上
                this.$alert('请完成上菜');

                return;
            }

            //结账
            this.$fetch({
                url:'/api/settle_order',
                method:'POST',
                data:{
                    id:this.curTable.order.order_id
                }
            })
            .then(()=>{
                this.drawer=false;  //收回抽屉

                this.$getTable();   //更新桌子的数据
                this.$getShopped(); //更新已下单的数据
            });
        }
	},
};
</script>

<style scoped>
.table {
	background: #fff;
	border-radius: 5px;
}
.table dt,
.list h3 {
	font-size: 20px;
	font-weight: bold;
	color: #ff8400;
	line-height: 50px;
	border-bottom: 1px solid #ccc;
	padding-left: 20px;
}
.table dd {
	display: inline-block;
	padding: 10px;
}
.table dd div {
	width: 110px;
	height: 110px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;
}
.table dd strong {
	font-size: 24px;
	margin-bottom: 10px;
	color: #ff8400;
}
.table dd span {
	color: #aaa;
}
.table dd div:after {
	content: "";
	width: 1px;
	height: 100%;
	position: absolute;
	background: linear-gradient(#fff, #ccc, #fff);
	right: 0;
}

.list {
	background: #fff;
	border-radius: 5px;
	margin-top: 20px;
}
.list ul {
	padding: 20px;
	overflow: hidden;
}
.list li {
	width: 200px;
	height: 140px;
	border: 1px solid #afafaf;
	float: left;
	border-radius: 5px;
	overflow: hidden;
	margin: 14px;
}
.list li div {
	height: 100px;
	background: #898989;
	color: #fff;
	text-align: center;
	font-size: 30px;
	line-height: 100px;

	position: relative;
	overflow: hidden;
}
.list li div span {
	font-size: 30px;
	margin-right: 12px;
}
.list li p {
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
}
.list li div button {
	width: 100%;
	height: 100%;
	background: #66a8a6;
	font-size: 22px;
	color: #fff;

	position: absolute;
	left: 0;
	top: -100px;
	transition: 0.3s;
}
.list li.eating {
	border-color: #e5553f;
}
.list li.eating div {
	background: #e5553f;
	cursor: pointer;
}
.list li.eating p {
	color: #e5553f;
}
.list li.eating:hover button {
	top: 0;
}

.list li.ordering {
	border-color: #fc9723;
}
.list li.ordering div {
	background: #fc9723;
}
.list li.ordering p {
	color: #fc9723;
}

.list .add {
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
.list .add span {
	font-size: 120px;
	color: #ccc;
}
.list .add:hover {
	background: #eee;
	transition: 0.3s;
}

/*
    wechart:haokeruyi
 */

/* 抽屉里的最下面的样式 */
.orderMessage {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fbfbfb;
	padding: 20px 10px;

	font-size: 14px;
	margin-top: 20px;
}
.orderMessage div {
	display: flex;
	flex-direction: column;
	color: #9e9e9e;
}

.orderMessage button {
	width: 80px;
	height: 50px;
	background: #ff8400;
	border-radius: 5px;
	color: #fff;
	font-size: 16px;
}
.orderMessage strong {
	font-size: 18px;
	color: #ff8400;
}
</style>

<style>
.el-drawer__header {
	margin-bottom: 10px;
}
.myDrawer .el-drawer__header {
	font-size: 24px;
	color: #ff8400;
}
.myDrawer .el-drawer__body {
	padding: 20px;
}
.myDrawer .el-table {
	font-size: 16px;
}
.payBtn {
	text-align: right;
	margin-top: 20px;
}
</style>