<template>
	<el-dialog title="菜品信息" :visible.sync="dialogVisible" top="15vh" :before-close="handleClose">
		<el-form :model="curDish" :rules="rules" ref="form" label-width="auto">
			<el-form-item label="菜名" prop="name">
				<el-input v-model="curDish.name"></el-input>
			</el-form-item>

			<el-form-item label="价格" prop="price">
				<el-input v-model.number="curDish.price"></el-input>
			</el-form-item>

			<el-form-item label="简介" prop="desc">
				<el-input type="textarea" rows='5' v-model="curDish.desc"></el-input>
			</el-form-item>

			<el-form-item label="推荐指数">
				<el-rate v-model="curDish.stars"></el-rate>
			</el-form-item>

			<el-form-item label="是否推荐">
				<el-switch v-model="curDish.recommend" active-color="#ff8400" inactive-color="#ccc"></el-switch>
			</el-form-item>

			<el-form-item label="图片">
				<el-upload class="avatar-uploader" action="http://order-api.chenxuehui.com/auth/upload_img"
					:show-file-list="false" :on-success="uploadSuccess" :before-upload="beforeUpload" name="image">
					<img v-if="curDish.image" :src="'http://order-api.chenxuehui.com/'+curDish.image" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button @click="submitForm" type="primary">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			rules: {
				name: [
                    {
                        required:true,
                        message:'请输入菜名',
                        trigger:'blur'
                    }
                ],
				price: [
                    {
                        required:true,
                        message:'价格必需是数字',
                        type:'number',
                        trigger:'blur'
                    }
                ],
				desc: [
                    {
                        required:true,
                        message:'请输入简介',
                        trigger:'blur'
                    }
                ],
			},
		};
	},
	props: {
		dialogVisible: Boolean,
		curDish: Object,
	},
	methods: {
		handleClose() {
			//浮层关闭前的回调
            this.$emit('closeDialog');  //通过自定义事件关闭弹出层
            this.$refs['form'].resetFields();   //移除表单的验证结果
		},
        uploadSuccess(res){    //上传成功的回调函数
            //console.log(res.url);   //上传成功后图片的地址

            //this.curDish=res.url;
            this.$emit('changeImage',res.url);  //通过自定义事件去修改父组件里的数据
        },
        beforeUpload(file){ //上传之前的回调函数
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < .5;

            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('图片大小不能超过 500KB!');
            }
            return isJPG && isLt2M;
        },
        submitForm(){
            //先验证再请求
            this.$refs['form'].validate()
            .then(()=>{
                this.$fetch({
                    url:'/api/edit_dish',
                    method:'POST',
                    data:this.curDish,
                }).then(()=>this.handleClose())
            }).catch(()=>{})
        }
	},
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>