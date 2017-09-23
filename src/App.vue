<template>
	<div id="app" class="app">
		<router-link to="/">
			<img src="./assets/img/title/title.png">
		</router-link>
		<div class="div-max-c clearFix">
			<router-link class="rt" to="/Song">
				<span v-bind:class="curRouter=='#/Song'?'span-active':''">S</span>
			</router-link>
			<router-link class="rt" to="/Li">
				<span v-bind:class="curRouter=='#/Li'?'span-active':''">L</span>
			</router-link>
			<router-link class="rt" to="/Na">
				<span v-bind:class="curRouter=='#/Na'?'span-active':''">N</span>
			</router-link>
		</div>
		<router-view class="div-max-c" v-on:comInit="changeRouter"></router-view>
	</div>
</template>

<script>
export default {
	name: 'app',
	data(){
		return{
			curRouter:window.location.pathname
		}
	},
	methods:{
		changeRouter:function(e){
			this.curRouter=e;
		}
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
	margin-top: 40px;
}
.rt{
	display: block;
	float: left;
	width:400px;
	height: 40px;
}
.rt span{
	font-weight: 800;
	font-size: 30px;
}
.span-active{
	display: block;
	animation: span-anim 2.5s infinite;
}
@keyframes span-anim {
	 0%,100% {
       transform: rotate(30deg);
       transform-origin: top center;
    }
    50% {
       transform: rotate(-30deg);
       transform-origin: top center;
    }
}
</style>

