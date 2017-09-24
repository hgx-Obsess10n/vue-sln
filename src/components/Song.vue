<template>
    <div>This is Song</div>
</template>
<script>
    export default {
        name: 'Song',
        created(){
            this.$emit('comInit',window.location.hash)
        }
    }
</script>
<style scoped>

</style>