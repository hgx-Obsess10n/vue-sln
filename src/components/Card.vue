<template>
    
    <div id="indexCard" class="clearFix div-card-content">
        <div @click="hoverIndex=index" class="div-card" v-for="(item,index) in cards" :key="index">
            <div class="div-card-header" v-if="item.header&&item.header.length>0">{{item.header}}</div>
            <div class="div-card-body">{{item.body}}</div>
            <div class="div-card-footer" v-if="item.footer&&item.footer.length>0">{{item.footer}}</div>
        </div>
        <transition name="hover-anim">
            <div @click="hoverIndex=-1" v-if="hoverIndex!=-1" class="div-cover"></div>
        </transition>
        <transition name="hover-anim1">
            <div @click="hoverIndex=-1" v-if="hoverIndex!=-1" class="div-card-hover">
                <div class="div-card-header" v-if="cards[hoverIndex].header&&cards[hoverIndex].header.length>0">{{cards[hoverIndex].header}}</div>
                <div class="div-card-body-container">
                    <div class="div-card-body-hover">{{cards[hoverIndex].body}}</div>
                </div>
                <div class="div-card-footer" v-if="cards[hoverIndex].footer&&cards[hoverIndex].footer.length>0">{{cards[hoverIndex].footer}}</div>
            </div>
        </transition>
    </div>
    
    
</template>

<script>
export default {
    name: 'Card',
    data() {
        let self = this;
        let cards = [];
        self.getCards();
        return {
            cards: cards,
            hoverIndex: -1
        };
    },
    created() {
        let data = {
            url: window.location.hash
        };
        this.$emit('CompInit', data);
    },
    methods: {
        getCards: function() {
            var self = this;
            this.$axios.get('static/json/index-card.json').then(res => {
                console.log('res', res);
                if (res.status === 200) {
                    self.cards = res.data.list;
                }
            });
        }
    }
};
</script>

<style scoped>
.div-card-content {
    padding-left: 20px;
}
.div-card-header {
    margin-bottom: 10px;
    font-size: 18px;
    color: olivedrab;
    text-align: center;
    font-weight: 800;
}

.div-card-footer {
    text-align: right;
    color: darkgray;
}

.div-card {
    float: left;
    border-radius: 10px;
    display: block;
    margin: 0 30px 30px 0;
    border: 1px dotted #aaa;
    box-shadow: 2px 2px 10px #aaa;
    padding: 15px 20px;
    color: royalblue;
    cursor: pointer;
}

.div-card-hover {
    border: 1px dotted #aaa;
    box-shadow: 2px 2px 10px #aaa;
    color: royalblue;
    padding: 15px 20px;
    cursor: pointer;

    position: fixed;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    z-index: 1;
    border-radius: 20px;
    width: max-content;
    max-width: 80%;
    max-height: 90%;
    opacity: 100;
}
.div-card-body-container {
    overflow-y: scroll;
}

.div-card-body {
    white-space: pre-line;
    line-height: 26px;
    text-align: left;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.div-card-body-hover {
    white-space: pre-line;
    word-break: break-all;
    line-height: 26px;
    text-align: left;
}

.hover-anim-leave-active {
    animation: hover-anim 0.3s reverse;
}

@keyframes hover-anim {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.25;
    }
    100% {
        opacity: 0.5;
    }
}

.hover-anim1-enter-active {
    animation: hover-anim1 0.3s;
}

.hover-anim1-leave-active {
    animation: hover-anim1 0.3s reverse;
}

@keyframes hover-anim1 {
    0% {
        opacity: 0;
    }
    20% {
        opacity: 0.2;
    }
    40% {
        opacity: 0.4;
    }
    60% {
        opacity: 0.6;
    }
    80% {
        opacity: 0.8;
    }
    100% {
        opacity: 1;
    }
}
</style>

