<template>
  <div>This is Na</div>
</template>
<script>
    export default {
        name: 'Na',
        created(){
            this.$emit('comInit',window.location.hash)
        }
    }
</script>
<style scoped>

</style>