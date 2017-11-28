<template>
	<!--PC & Mobile-->
	<div id="app" class="app"
		v-on:click="$_globalClick()">
		<span v-show="compShow" class="compTitle">{{compTitle}}</span>
		<!--菜单ICON-->
		<img class="imgMenu" v-bind:src="menuShow?'/static/img/icon/menu-on.png':'/static/img/icon/menu-off.png'" v-on:click.stop="$_triggerMenuShow" alt="Menu">
		<!--菜单-->
		<div class="funcMenu" v-show="menuShow">
			<router-link to="/" v-on:click.native="$_closeRouter" title="首页"><img src="/static/img/icon/index.png" alt="Index"></router-link>
			<router-link to="/ImageProcess" title="图片处理"><img src="/static/img/icon/image.png" alt="Img"></router-link>
			<router-link to="/QRCode" title="生成二维码"><img src="/static/img/icon/qr-code.png" alt="QRCode"></router-link>
		</div>
		<router-view class="routerView"
			v-on:CompInit="$_routerCompInit"
			ref="eleRouterItem"> 
		</router-view>

	</div>
</template>
<script>
export default {
    name: 'app',
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
.app {
    width: 100%;
    height: 100%;
}
.menu {
    overflow: hidden;
}
.imgMenu {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 32px;
    height: 32px;
}
.funcMenu {
    position: absolute;
    right: 11px;
    top: 51px;
    border: 1px #aaa;
    border-style: none none dotted none;
    box-shadow: 2px 2px 10px #aaa;
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
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 70%;
    max-height: 70%;
    transform: translateX(-50%) translateY(-50%);
    box-shadow: 2px 2px 10px #aaa;
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

