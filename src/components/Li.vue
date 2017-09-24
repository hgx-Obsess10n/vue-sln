<template>
  <div>This is Li</div>
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
