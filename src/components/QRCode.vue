<template>
    <div>
        <input class="codeContent" type="text" v-model="txtContent" v-on:keyup.enter="$_CreateQRCode()">
        <div class="codeBox" ref="divCode">
            
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
    name: "QRCode",
    created() {
        let data = {
            url: window.location.hash,
            title: "生成二维码"
        };
        this.$emit("CompInit", data);
    },
    data: function() {
        return {
            txtContent:'',
            qrcode:null
        };
    },
    methods: {
        $_CreateQRCode:function(){
            var _this=this;
            _this.txtContent=_this.txtContent.trim();
            if(!!_this.txtContent){
                if(_this.qrcode!=null){
                    _this.qrcode.makeCode(_this.txtContent);
                }
                else{
                    _this.qrcode=new QRCode(_this.$refs.divCode, {
                        text: _this.txtContent,
                        width: 128,
                        height: 128,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
            }
            else if(_this.qrcode!=null)
                _this.qrcode.clear();

        }
    }
};
</script>
<style scoped>
.codeContent{
    margin-top:15px;
}
.codeBox{
    margin-top:20px;
}
</style>