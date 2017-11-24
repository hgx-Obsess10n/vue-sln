<template>
    <div class="div-Song">
        <div-scroll></div-scroll>
    </div>
</template>
<script>
export default {
    name: 'Song',
    components: {},
    created() {
        let data = {
            url: window.location.hash
        };
        this.$emit('CompInit', data);
    }
};
</script>
<style scoped>
.div-Song {
    height: 500px;
}
</style>