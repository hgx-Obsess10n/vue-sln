<template>
    <div class="div-scroll-box">
        <div>

        </div>
        <div class="div-scroll" v-bind:style="scrollStyle">
            {{top}}
        </div>
    </div>
</template>
<script>
    export default{
        name:'divScroll',
        data(){
            let _this=this;
            _this.calcTop();
            return {
                top:100,
                scrollStyle:{
                    color:'blue'
                },
                timerTop:null
            }
        },
        methods:{
            calcTop:function(){
                let _this=this;
                clearInterval(_this.timerTop);
                _this.timerTop=setInterval(function(){console.log(_this.top);_this.scrollStyle.top=_this.top+'px'; _this.top++},300);
                
            }
        }
    }
</script>
<style scoped>
    .div-scroll-box{
        width:100%;
        height: 100%;
        overflow: hidden;
    }
    .div-scroll{
        position: relative;
        left: 100%;
        transform: translateX(-100%);
        width:150px;
        height:100px;
        border-radius: 10px;
    }
    .div-scroll div{
        width: 150px;
        border: 1px solid #aaa;
        background-color: #aaa;
    }
</style>
