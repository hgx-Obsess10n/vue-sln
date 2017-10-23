

<template>
    <div class="div-Song">
        <div-scroll></div-scroll>
    </div>
</template>
<script>
    import divScroll from './Coms/divScroll'
    export default {
        name: 'Song',
        components:{
            divScroll
        },
        created(){
            this.$emit('comInit',window.location.hash)
        }
    }
    
</script>
<style scoped>
    .div-Song{
        height:500px;
    }
</style>