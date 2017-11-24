<template>
	<!--Only PC-->
	<div id="app" class="app"
		v-on:click="$_triggerMenuShow(false)" >

		<!--功能页容器 Start-->
        <transition name="router-change">
			<div class="div-Func-item-box"
				v-show="compShow" >
				<div class="clearFix routerCloseBanner w100">
					<span class="compTitle">{{compTitle}}</span>
					<router-link class="routerClose" to="/"
						v-on:click.native="$_closeRouter">X</router-link>
				</div>
				<router-view class="routerView w100 h100"
					v-on:CompInit="$_RouterCompInit"> 
				</router-view>
			</div>
		</transition>
        <!--功能页容器 End-->

		<!--菜单 Start-->
		<div class="Menu"
			v-show="menuShow">
			<ul class="ul-Menu">
				<!--<li>
					<router-link to="/Index" class="clearFix">
						<img src="" alt="Index"><span>Index</span>
					</router-link>
				</li>-->
				<li>
					<router-link to="/ImgProcess" class="clearFix">
						<img src="/static/img/icon/image.png" alt="ImgProcess"><span>图片处理</span>
					</router-link>
				</li>
				<li>
					<router-link to="/QRCode" class="clearFix">
						<img src="/static/img/icon/qr-code.png" alt="QRCode"><span>生成二维码</span>
					</router-link>
				</li>
			</ul>
		</div>
		<!--菜单 End-->

        <!--底部工具栏 Start-->
        <div class="Toolbar-bottom">
            <ul class="ul-Bottom ul-menu">
                <li v-on:click.stop="$_triggerMenuShow">菜单</li>
            <!--<li>Index</li>-->
            </ul>
            <ul class="ul-Bottom ul-time">
                <li>{{curTime}}</li>
            </ul>
        </div>
        <!--底部工具栏 End-->
	</div>
</template>

<script>
var _timer= null;	
export default {
	name: 'app',
	created:function(){
		if(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)){
			alert('请在PC上浏览本网页');
		}
		this._timer=setInterval(this.$_getTime,400);
	},
	data() {
		return {
			curRouter: window.location.pathname,
			curTime:'',
			compShow:false,
			compTitle:'',
			menuShow:false
		}
	},
	methods: {
		$_RouterCompInit: function(paras) {
			if(paras){
				if(paras.url){
					this.curRouter = paras.url;
					this.compShow=true;
					this.$_triggerMenuShow(false);
				}
				this.compTitle=(paras.title!=undefined&&paras.title!=null)?paras.title:'';



			}
			
		},
		$_closeRouter:function(){
			this.curRouter=null;
			this.compShow=false;
		},
		$_getTime:function(){
			var self=this;
			let curDate=new Date();
			let curDateInfo={
				Year:curDate.getFullYear(),
				Month:curDate.getMonth()+1,
				Day:curDate.getDay(),
				Date:curDate.getDate(),
				Hour:curDate.getHours(),
				Minute:curDate.getMinutes()
			}
			self.curTime=''+(curDateInfo.Year)+'-'
							+(curDateInfo.Month<10?'0':'')+curDateInfo.Month+'-'
							+(curDateInfo.Date<10?'0':'')+curDateInfo.Date+'\n'
							+(curDateInfo.Hour<10?'0':'')+curDateInfo.Hour+':'
							+(curDateInfo.Minute<10?'0':'')+curDateInfo.Minute;
		},
		$_triggerMenuShow:function(flag){
			var self = this;
			if(flag===undefined)
				self.menuShow=!self.menuShow;
			else
				self.menuShow=flag;
		}

	},
	components:{
		
	}
}
</script>

<style scoped>
.app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	position: absolute;
	top:0;
	bottom:0;
	left: 0;
	right: 0;
	background: url('/static/img/background/default.jpg') no-repeat fixed;
	background-size: 100% 100%;
	border: none;
	z-index: 99;
}
	
.div-Func-item-box{
	position: fixed;
	top: 30px;
    bottom: 100px;
    left: 50px;
    right: 50px;
	background-color: white;
	opacity: 1;
	overflow: hidden;
}



.routerClose{
	border-left: 1px solid #333;
	float: right;
	width: 40px;
	height: 30px;
	line-height: 30px;
	color: black;
	font-weight: 800;
}
.routerCloseBanner{
	position: absolute;
	background: #c3e3f6;
	border-bottom: 1px solid #333;
	overflow: hidden;
    z-index: 1;
}
.compTitle{
	line-height: 30px;
    font-weight: 600;
}
.routerView{
	position: absolute;
	padding-top:31px;
}

.router-change-enter-active {
	animation: come .6s;
}
@keyframes come {
	0% {
		transform: scale(0);
	}
	30%{
		transform: scale(0);
	}
	100% {
		transform: scale(1);
	}
}
/*
@media (max-width:500px) {
	.img-title {
		width: 100%;
	}
}
*/
.Menu{
	
	position: fixed;
	bottom: 50px;
	left:0;
	background-color: #444;
	opacity: 0.7;
	color:white;
	padding:3px 5px;
	max-height:30%;
	overflow: hidden;
}
.ul-Menu{
	padding:0;
	min-height: 400px;
}
.ul-Menu li{
	text-align: left;
	width:200px;
	height: 40px;
	font-size: 20px;
	line-height: 40px;
	vertical-align:middle;
	overflow: hidden;
	word-break: keep-all;
	text-overflow: ellipsis;
	list-style:none;
	cursor: pointer;
}
.ul-Menu li:hover{
	background-color: #777;
}
.ul-Menu li a{
	display: inline-block;
	width: 100%;
	height: 100%;
	color:white;
}
.ul-Menu li img{
	margin-top: 6px;
    float: left;
    margin-left: 20px;
    width: 24px;
    height: 24px;
    overflow: hidden;
}
.ul-Menu li span{
	float: left;
	margin-left:20px;
	height: 32px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.Toolbar-bottom{
	position: fixed;
	bottom:0;
	left: 0;
	right: 0;
	background-color: #000;
	opacity: 0.95;
	height: 50px;
}
.ul-Bottom{
	display: inline-block;
	height:100%;
	padding:0 20px;
	cursor: default;
}
.ul-menu{
	position: absolute;
	left: 0;
}
.ul-time{
	position: absolute;
	right: 0;
}
.ul-Bottom li{
	color: white;
	height: 50px;
	list-style: none;
	display: inline-block;
	padding:10px 15px;
	text-align: center;
	vertical-align: middle;
}

.ul-menu li{
	line-height: 30px;
	cursor: pointer;
}
.ul-menu li:hover{
	color:cornflowerblue;
}
.ul-time li{
	white-space: pre-line;
	line-height: 18px;
}

</style>

