<template>
    <div>
        <input type="text" placeholder="二维码内容" class="codeContent h-center" v-model="txtContent">
        <span class="sp color1 h-center" v-on:click="$_CreateQRCode()">生成</span>
        <div class="codeBox h-center" ref="divCode"></div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2';
export default {
    name: 'QRCode',
    created() {
        let data = {
            url: window.location.hash,
            title: '生成二维码'
        };
        this.$emit('CompInit', data);
    },
    data: function() {
        return {
            txtContent: '',
            qrcode: null
        };
    },
    methods: {
        $_CreateQRCode: function() {
            var self = this;
            self.txtContent = self.txtContent.trim();
            self.$refs.divCode.innerHTML = '';
            if (self.txtContent) {
                self.qrcode = new QRCode(self.$refs.divCode, {
                    text: self.txtContent,
                    width: 128,
                    height: 128,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }
    }
};
</script>
<style scoped>
.codeContent {
    display: block;
    width:200px;
    line-height: 26px;
    margin-top: 15px;
    border-style: none none solid none;
    border-width: 1px;
    border-color: #aaa;
    outline: none;
}
.codeBox {
    margin-top: 20px;
    max-width: 128px;
}
.sp {
    display: block;
    padding: 0 10px;
    border: 1px solid #aaa;
    line-height: 24px;
    max-width: 200px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 11px;
    text-align: center;
    cursor: pointer;
    margin-top: 10px;
    height: 26px;
}
</style>