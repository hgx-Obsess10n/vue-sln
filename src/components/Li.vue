<template>
  
</template>
<script>
    export default {
        name: 'Li',
        created(){
            this.$emit('comInit',window.location.hash)
        }
    }
</script>
<style scoped>

</style>
