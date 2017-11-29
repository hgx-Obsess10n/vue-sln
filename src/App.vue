<template>
	<div id="app" class="app">
		<router-view></router-view>
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
			smallTipShow:false
		}
	},
	methods: {
		
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
</style>

