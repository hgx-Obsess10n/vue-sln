<template>
    <div>
        <span>二维码内容：</span>
        <textarea cols="20" rows="3" v-model="txtContent" v-on:keyup.enter="$_CreateQRCode()"></textarea>
        <span class="color1" v-on:click="$_CreateQRCode()">生成</span>
				<!--<input class="codeContent" type="text" v-model="txtContent" v-on:keyup.enter="$_CreateQRCode()">-->
        <div class="codeBox" ref="divCode"></div>
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
    margin-top: 15px;
}
.codeBox {
    margin-top: 20px;
}
</style>