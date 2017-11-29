<template>
	<div id="app" class="app">
		<router-view 
			v-on:smallTipShow="$_showSmallTip"
			ref="eleRouterItem"></router-view>

		<!-- SMALL TIP [BEGIN] -->
		<div v-show="smallTip.show" class="smallTip">
			<!-- HEAD -->
			<div class="smallTip-head clearFix">
				<span>{{smallTip.title}}</span>
				<img v-on:click="$_closeSmallTip" src="/static/img/icon/close.png" alt="X">
			</div>
			<!-- BODY -->
			<div class="smallTip-body">
				<span>{{smallTip.text}}</span>
			</div>
			<!-- FOOT -->
			<div class="smallTip-foot clearFix">
				<span v-if="smallTip.btnConfirmShow" class="btnTipConfirm" 
					v-on:click="$_closeSmallTip(1)">确定</span>
				<span v-if="smallTip.btnCancelShow" class="btnTipCancel"
					v-on:click="$_closeSmallTip()">取消</span>
			</div>
		</div>
		<div v-show="smallTip.show" class="smallTipCover">
		</div>
		<!-- SMALL TIP [END] -->
	</div>
</template>

<script>
export default {
	name: 'app',
	created:function(){
		/*if(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)){
			alert('请在PC上浏览本网页');
		}*/
	},
	data() {
		return {
			smallTip:{
				show:false,
				title:'提示',
				text:'内容文字',
				btnCancelShow:false,
				btnConfirmShow:false
			}
		}
	},
	methods: {
		$_closeSmallTip:function(action){
			var self=this;
			self.smallTip={
				show:false,
				title:'提示',
				text:'',
				btnCancelShow:false,
				btnConfirmShow:false
			};
			let paras={
				action:action?action:0
			}
			if (
                this.$refs.eleRouterItem &&
                this.$refs.eleRouterItem.$_parentSmallTipCallBack
            ) {
                this.$refs.eleRouterItem.$_parentSmallTipCallBack(paras);
            }
		},
		$_showSmallTip:function(paras){
			var self=this;
			self.smallTip={
				show:true,
				title:(paras&&paras.title)?paras.title:'提示',
				text:(paras&&paras.text)?paras.text:'提示',
				btnCancelShow:(paras&&paras.btnCancelShow),
				btnConfirmShow:(paras&&paras.btnConfirmShow)
			};
		}
	},
	components:{
		
	}
}
</script>

<style scoped>
.app {
    width: 100%;
    height: 100%;
}
.smallTipCover{
	position: fixed;
	z-index: 200;
	top:0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #000;
	opacity: 0.1;
}
.smallTip{
	position: fixed;
	z-index: 201;
	top:40%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
    box-shadow: 2px 2px 10px #aaa;
	min-width: 300px;
	border-radius: 15px;
    overflow: hidden;
	background-color: #FAFAFA;
}
.smallTip-head{
	height: 32px;
	border-bottom: 1px rgb(0, 136, 186) solid;
}
.smallTip-head span{
	position: absolute;
	left: 15px;
	max-width: 150px;
	line-height: 32px;
	text-overflow: ellipsis;
	overflow: hidden;
	color:rgb(0, 136, 186);

}
.smallTip-head img{
	position: absolute;
	right: 0;
	width: 32px;
	height: 32px;
}
.smallTip-body{
	padding:10px 15px;
}
.smallTip-body span{
	line-height:26px;
}
.smallTip-foot span{
	width: 34%;
	height: 32px;
	line-height: 32px;
	text-align: center;
	cursor: pointer;
}
.smallTip-foot span:hover{
	color:rgb(255, 242, 184);
}
.btnTipConfirm{
	float: right;
	border: 1px rgb(0, 136, 186) solid;
	background-color: rgb(0, 136, 186);
	color:#fff;
}
.btnTipCancel{
	float: left;
	border: 1px #aaa solid;
	background-color: #aaa;
	color:#fff;
}
</style>

