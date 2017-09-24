<template>
	<div id="app" class="app">
		<router-link to="/">
			<img class="img-title" src="./assets/img/title/title.png">
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
		<transition name="router-change">
			<router-view class="div-max-c" v-on:comInit="changeRouter"></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {
			curRouter: window.location.pathname
		}
	},
	methods: {
		changeRouter: function(e) {
			this.curRouter = e;
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

@media (max-width:500px) {
	.img-title {
		width: 100%;
	}
}

.rt {
	display: block;
	float: left;
	width: 33%;
	height: 40px;
}

.rt span {
	font-weight: 800;
	font-size: 30px;
}

.span-active {
	display: block;
	animation: span-anim 2.5s infinite;
}

@keyframes span-anim {
	0%,
	100% {
		transform: rotate(30deg);
		transform-origin: top center;
	}
	50% {
		transform: rotate(-30deg);
		transform-origin: top center;
	}
}

.router-change-enter-active {
	animation: come .3s;
}

@keyframes come {
	0% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(0);
	}
}
</style>

