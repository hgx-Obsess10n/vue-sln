<template>
	<!--PC & Mobile-->
	<div class="divMax"
		v-on:click="$_globalClick()">
		<span v-show="compShow" class="compTitle">{{compTitle}}</span>
		<!--菜单ICON-->
        <div v-bind:class="menuShow?'':'divMenuIconHidden'" class="divMenuIcon">
            <img class="imgMenu" v-bind:src="menuShow?'/static/img/icon/menu-on.png':'/static/img/icon/menu-off.png'" v-on:click.stop="$_triggerMenuShow" alt="Menu">
        </div>
		
		<!--菜单-->
		<div class="funcMenu" v-show="menuShow">
			<router-link to="/" v-on:click.native="$_closeRouter" title="首页"><img src="/static/img/icon/index.png" alt="Index"></router-link>
			<router-link to="/ImageProcess" title="图片处理"><img src="/static/img/icon/image.png" alt="Img"></router-link>
			<router-link to="/QRCode" title="生成二维码"><img src="/static/img/icon/qr-code.png" alt="QRCode"></router-link>
            <router-link to="/Map" title="百度地图"><img src="/static/img/icon/baiduMap.png" alt="Map"></router-link>
		</div>
		<router-view class="routerView"
			v-on:CompInit="$_routerCompInit"
			ref="eleRouterItem"> 
		</router-view>

	</div>
</template>
<script>
export default {
    name: 'Index',
    created: function() {},
    data() {
        return {
            curRouter: window.location.pathname,
            curTime: '',
            compShow: false,
            compTitle: '',
            menuShow: false
        };
    },
    methods: {
        $_routerCompInit: function(paras) {
            if (paras) {
                if (paras.url) {
                    this.curRouter = paras.url;
                    this.compShow = true;
                }
            }
            this.compTitle = paras && paras.title ? paras.title : '';
        },
        $_closeRouter: function() {
            this.curRouter = null;
            this.compShow = false;
            this.compTitle = '';
        },
        $_triggerMenuShow: function() {
            this.menuShow = !this.menuShow;
        },
        $_globalClick: function() {
            this.menuShow = false;
            if (
                this.$refs.eleRouterItem &&
                this.$refs.eleRouterItem.$_parentGlobalClick
            ) {
                this.$refs.eleRouterItem.$_parentGlobalClick();
            }
        }
    },
    components: {}
};
</script>
<style scoped>
.divMax{
    height: 100%;
    widows: 100%;
}
.menu {
    overflow: hidden;
}
.divMenuIcon{
    position: fixed;
    z-index: 101;
    right: 10px;
    top: 20px;
    padding: 5px;
    border: 1px solid #777;
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
}
.divMenuIconHidden{
    transform: translateX(80%);
}
.imgMenu {
    display: block;
    width: 32px;
    height: 32px;
}
.funcMenu {
    position: fixed;
    z-index: 101;
    right: 17px;
    top: 66px;
    border: 1px #aaa;
    border-style: none none dotted none;
    box-shadow: 2px 2px 10px #aaa;
    background-color: #fff;
}
.funcMenu > a {
    display: block;
    padding: 5px 5px;
    cursor: pointer;
}
.funcMenu > a > img {
    display: block;
    width: 20px;
    height: 20px;
}
.funcMenu > a:hover {
    background-color: rgb(255, 242, 184);
}

.routerView {
    /*position: absolute;
    top: 75px;
    left: 50%;
    max-width: 70%;
    max-height: 70%;
    transform: translateX(-50%);
    box-shadow: 2px 2px 10px #aaa;*/
    width:100%;
    height: 100%;
    overflow: hidden;
}
.compTitle {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 32px;
    color: rgb(0, 136, 186);
}
</style>

