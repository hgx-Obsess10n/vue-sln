<template>
    <div>
        <span class="welcomeText">{{welcomeText}}</span>
    </div>
</template>
<script>
    export default{
        name:'Welcome',
        created () {

        },
        data () {
            return {
                welcomeText:'Welcome ...'
            }
        },
        methods : {
            
        }
    }
</script>
<style scoped>
.welcomeText{
    position: fixed;
    top:20%;
    left: 50%;
    transform: translateX(-50%);
}
</style>
