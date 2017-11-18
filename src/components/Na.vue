<template>
  <div>This is Na</div>
</template>
<script>
    export default {
        name: 'Na',
        created(){
            let data={
                url:window.location.hash
            };
            this.$emit('CompInit',data )
        }
    }
</script>
<style scoped>

</style>