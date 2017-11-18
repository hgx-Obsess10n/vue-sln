<template>
  <div class="clearfix">
      <!--Menu-->
      <div class="menuContent h100">
        <span class="menuTitle">功能列表</span>
          <ul class="FuncMenu">
             <li v-on:click="$_showImg()">原图</li>
             <li v-on:click="$_imgTranslate($_imgGray,{index:1})">灰度变换-浮点算法</li>
             <li v-on:click="$_imgTranslate($_imgGray,{index:2})">灰度变换-整数算法</li>
             <li v-on:click="$_imgTranslate($_imgGray,{index:3})">灰度变换-移位算法</li>
             <li v-on:click="$_imgTranslate($_imgGray,{index:4})">灰度变换-平均值算法</li>
             <li v-on:click="$_imgTranslate($_imgReversal)">逆反处理</li>
             <li v-on:click="$_imgTranslate($_imgSingleColor,{singleColor:0})">全取红色</li>
             <li v-on:click="$_imgTranslate($_imgSingleColor,{singleColor:1})">全取绿色</li>
             <li v-on:click="$_imgTranslate($_imgSingleColor,{singleColor:2})">全取蓝色</li>
          </ul>
      </div>
      <!--Image-->
      <div class="imgContent h100">
            <input class="v-center" type="file" v-on:change="$_imgFileChange" ref="eleImgFile">
            <canvas class="imgShow" v-bind:width="imgWidth" v-bind:height="imgHeight" ref="eleImgCanvas"></canvas>
      </div>
  </div>
</template>
<script>
    export default {
        name: 'ImgProcess',
        created(){
            this.$emit('comInit',window.location.hash)
        },
        data:function(){
            return {
                imgData:null,
                imgNowData:'',
                imgWidth:500,
                imgHeight:500
            }
        },
        methods:{
            $_imgFileChange:function(){
                var _this=this;
                let files =this.$refs.eleImgFile.files;
                if(files.length>0){
                    let file = files[0];
                    if(!(/^image\//).test(file.type)){
                        alert('请选择图像文件');
                        return;
                    }
                    let fr=new FileReader();
                    fr.readAsDataURL(file);
                    fr.onload=function(res){
                        _this.imgData=res.target.result;
                        _this.imgNowData=_this.imgData;
                        _this.currentFuction='';
                        _this.$_showImg();
                    }
                }
            },
            $_showImg:function(callback){
                var _this=this;
                let img=new Image();
                img.src=_this.imgNowData;
                img.onload=function(res){
                    let _width=res.target.width;
                    let _height=res.target.height;
                    let ratio=1;
                    if(_width>500) ratio=500/_width;
                    if(_height*ratio>500) ratio=500/_height;

                    _width=_width*ratio;
                    _height=_height*ratio;


                    _this.$refs.eleImgCanvas.getContext('2d').clearRect(0,0,_this.imgWidth,_this.imgHeight)

                    let eleCanvas=_this.$refs.eleImgCanvas;
                    let ctx=eleCanvas.getContext('2d');
                    ctx.drawImage(img,(_this.imgWidth-_width)/2,(_this.imgHeight-_height)/2,_width,_height);
                    
                    if(typeof callback =='function')
                        callback();
                }
            },
            $_imgTranslate:function(funcName,funcPara){
                var _this=this;
                if(!_this.imgData||typeof funcName!='function')
                    return;
                if(funcPara==undefined) funcPara={};
                _this.$_showImg(function(){
                    let eleCanvas=_this.$refs.eleImgCanvas;
                    let ctx=eleCanvas.getContext('2d');
                    let _img256=ctx.getImageData(0,0,_this.imgWidth,_this.imgHeight);

                    funcPara.imgData=_img256;
                    _img256=funcName(funcPara);
                    if(_img256){
                        _this.$refs.eleImgCanvas.getContext('2d').clearRect(0,0,_this.imgWidth,_this.imgHeight)
                        ctx.putImageData(_img256,0,0,0,0,_this.imgWidth,_this.imgHeight);
                    }
                });
            },
            $_imgGray:function(paras){
                var _this=this;
                if(!paras.imgData)
                    return null;
                let index=!paras.index?1:paras.index;
                let _img256=paras.imgData;
                for (var i=0;i<_img256.data.length;i+=4)
                {
                    var R = _img256.data[i]; //R(0-255)
                    var G = _img256.data[i+1]; //G(0-255)
                    var B = _img256.data[i+2]; //B(0-255)
                    //var Alpha = _img256.data[i+3]; //Alpha(0-255)

                    let gray=0;
                    if(!index||index==1){
                        gray = R*0.299 + G*0.587 + B*0.114;//浮点算法
                    }
                    else if(index==2){
                        gray = (R*299 + G*587 + B*114 + 500) / 1000;　//整数算法
                    }
                    else if(index==3){
                        gray =(R*76+G*151+B*28)>>8;//移位算法
                    }
                    else if(index==4){
                        gray = (R+G+B)/3;//平均值算法
                    }
                    else{
                        gray = G;//仅取绿色
                    }
                    
                    _img256.data[i] = gray;
                    _img256.data[i+1] = gray; 
                    _img256.data[i+2] = gray; 
                    //_img256.data[i+3] = Alpha; 
                }
                return _img256;
            },
            $_imgReversal:function(paras){
                var _this=this;
                if(!paras.imgData)
                    return null;
                let _img256=paras.imgData;
                for (var i=0;i<_img256.data.length;i+=4)
                {
                    _img256.data[i] = 255-_img256.data[i];
                    _img256.data[i+1] = 255-_img256.data[i+1]; 
                    _img256.data[i+2] = 255-_img256.data[i+2]; 
                }
                return _img256;
            },
            $_imgSingleColor:function(paras){
                var _this=this;
                if(!paras.imgData)
                    return null;
                let _singleColor=!paras.singleColor||(paras.singleColor!=1&&paras.singleColor!=2)?0:paras.singleColor;
                let _img256=paras.imgData;
                for (var i=0;i<_img256.data.length;i+=4)
                {
                    _img256.data[i] = 255-_img256.data[i+_singleColor];
                    _img256.data[i+1] = 255-_img256.data[i+_singleColor]; 
                    _img256.data[i+2] = 255-_img256.data[i+_singleColor]; 
                }
                return _img256;

            }
            
        }
    }
</script>
<style scoped>
    .menuTitle{
        color: wheat;
        text-align: left;
        line-height: 40px;
        margin-left:20px;
        font-weight: 500;
        font-size: 20px;
    }
    .menuContent{
        position: absolute;
        top:31px;
        left: 0;
        bottom: 0;
        width: 200px;
        background-color: #333;
        text-align: left;
        display: inline-block;
    }
    .FuncMenu{
        color:white;
        text-align: center;
    }
    .FuncMenu li{
        cursor: pointer;
        line-height:36px;
        text-align: left;
        padding-left: 35px;
    }
    .FuncMenu li:hover{
        background-color: #aaa;
        color: #333;
    }

    .imgContent{
        position: absolute;
        top:31px;
        bottom: 0;
        left: 220px;
        right: 20px;
        display: inline-block;
        overflow: hidden;
    }
    .imgShow{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        /*max-width: 500px;
        max-height: 500px;*/
    }

</style>
