<template>
  <div class="clearfix">
      <!--Menu-->
      <div class="menuContent">
        <span class="menuTitle">功能列表</span>
          <ul class="FuncMenu">
             <li v-on:click="$_ShowImg()">原图</li>
             <li v-on:click="$_ImgTranslate($_Gray,{index:1})">灰度变换-浮点算法</li>
             <!--<li v-on:click="$_ImgTranslate($_Gray,{index:2})">灰度变换-整数算法</li>
             <li v-on:click="$_ImgTranslate($_Gray,{index:3})">灰度变换-移位算法</li>
             <li v-on:click="$_ImgTranslate($_Gray,{index:4})">灰度变换-平均值算法</li>-->
             <li v-on:click="$_ImgTranslate($_Reversal)">逆反处理</li>
             <li v-on:click="$_ImgTranslate($_SingleColor,{singleColor:0})">全取红色</li>
             <li v-on:click="$_ImgTranslate($_SingleColor,{singleColor:1})">全取绿色</li>
             <li v-on:click="$_ImgTranslate($_SingleColor,{singleColor:2})">全取蓝色</li>
             <li v-on:click="$_ImgTranslate($_Smooth)">平滑处理</li>
             <li v-on:click="$_ImgTranslate($_Neon)">霓虹处理</li>
             <li v-on:click="$_ImgTranslate($_Relief)">浮雕处理</li>
             <li v-on:click="$_ImgTranslate($_Inlay)">镶嵌处理</li>
             <li v-on:click="$_ImgTranslate($_TwoValued_Fixed)">二值化-弱智127阈值</li>
             <li v-on:click="$_ImgTranslate($_TwoValued_AVG)">二值化-平均值阈值</li>
          </ul>
      </div>
      <!--Image-->
      <div class="imgContent">
            <input class="v-center" type="file" v-on:change="$_ImgFileChange" ref="eleImgFile">
            <canvas title="左键点击下载" class="imgShow" v-bind:width="canvasWidth" v-bind:height="canvasHeight" ref="eleImgCanvas"></canvas>
      </div>
  </div>
</template>
<script>
export default {
    name: "ImgProcess",
    created() {
        let data = {
            url: window.location.hash,
            title: "图片处理"
        };
        this.$emit("CompInit", data);
    },
    data: function() {
        return {
            imgData: null,
            imgNowData: "",
            canvasWidth: 500,
            canvasHeight: 500,
            imgWidth:0,
            imgHeight:0,
            MAX_WIDTH:500,
            MAX_HEIGHT:500
        };
    },
    methods: {
        $_ImgFileChange: function() {
            var _this = this;
            let files = this.$refs.eleImgFile.files;
            if (files.length > 0) {
                let file = files[0];
                if (!/^image\//.test(file.type)) {
                    alert("请选择图像文件");
                    return;
                }
                let fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function(res) {
                    _this.imgData = res.target.result;
                    _this.imgNowData = _this.imgData;
                    _this.currentFuction = "";
                    _this.$_ShowImg();
                };
            }
        },
        $_ShowImg: function(callback) {
            var _this = this;
            let img = new Image();
            img.src = _this.imgNowData;
            img.onload = function(res) {
                let _width = res.target.width;
                let _height = res.target.height;
                let ratio = 1;
                if (_width > _this.MAX_WIDTH) ratio = _this.MAX_WIDTH / _width;
                if (_height * ratio > _this.MAX_HEIGHT) ratio = _this.MAX_HEIGHT / _height;

                _this.canvasWidth=_this.imgWidth=_width = _width * ratio;
                _this.canvasHeight=_this.imgHeight=_height = _height * ratio;
                
                _this.$nextTick(function(){
                    _this.$refs.eleImgCanvas
                        .getContext("2d")
                        .clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);

                    let eleCanvas = _this.$refs.eleImgCanvas;
                    let ctx = eleCanvas.getContext("2d");
                    ctx.drawImage(
                        img,
                        (_this.canvasWidth - _width) / 2,
                        (_this.canvasHeight - _height) / 2,
                        _width,
                        _height
                    );

                    if (typeof callback == "function") callback();
                });
            };
        },
        $_ImgArrData2MatrixPixel: function(imgArrData) {
            var _this = this;
            let pixels = [];
            let rowPixels = [];
            for (let i = 0, rowIndex = 0; i < imgArrData.length; i += 4) {
                if (i >= (rowIndex + 1) * _this.canvasWidth * 4) {
                    rowIndex += 1;
                    pixels.push(rowPixels.slice(0));
                    rowPixels.length = 0;
                }
                rowPixels.push({
                    R: imgArrData[i],
                    G: imgArrData[i + 1],
                    B: imgArrData[i + 2],
                    A: imgArrData[i + 3]
                });
            }
            pixels.push(rowPixels.slice(0));
            rowPixels.length = 0;
            return pixels;
        },
        $_ImgMatrixPixel2ArrData(matrixPixel,arrData) {
            var _this = this;
            let bNeedReturn = arrData==undefined;
            let imgArrData = [];
            let i=0;
            matrixPixel.forEach(row => {
                row.forEach(pixel => {
                    if(bNeedReturn){
                        imgArrData.push(pixel.R);
                        imgArrData.push(pixel.G);
                        imgArrData.push(pixel.B);
                        imgArrData.push(pixel.A);
                    }
                    else{
                        arrData[i]=pixel.R;
                        arrData[i+1]=pixel.G;
                        arrData[i+2]=pixel.B;
                        arrData[i+3]=pixel.A;
                        i+=4;
                    }
                });
            });
            if(bNeedReturn)
                return imgArrData;
        },
        $_ImgTranslate: function(funcName, funcPara) {
            var _this = this;
            if (!_this.imgData || typeof funcName != "function") return;
            if (funcPara == undefined) funcPara = {};
            _this.$_ShowImg(function() {
                let eleCanvas = _this.$refs.eleImgCanvas;
                let ctx = eleCanvas.getContext("2d");
                let _img256 = ctx.getImageData(
                    0,
                    0,
                    _this.canvasWidth,
                    _this.canvasHeight
                );

                funcPara.imgData = _img256;
                _img256 = funcName(funcPara);
                if (_img256) {
                    _this.$refs.eleImgCanvas
                        .getContext("2d")
                        .clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
                    ctx.putImageData(
                        _img256,
                        0,
                        0,
                        0,
                        0,
                        _this.canvasWidth,
                        _this.canvasHeight
                    );
                }
            });
        },
        $_Gray: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let index = !paras.index ? 1 : paras.index;
            let _img256 = paras.imgData;
            for (let i = 0; i < _img256.data.length; i += 4) {
                let R = _img256.data[i]; //R(0-255)
                let G = _img256.data[i + 1]; //G(0-255)
                let B = _img256.data[i + 2]; //B(0-255)

                let gray = 0;
                if (!index || index == 1) {
                    gray = R * 0.299 + G * 0.587 + B * 0.114; //浮点算法
                } else if (index == 2) {
                    gray = (R * 299 + G * 587 + B * 114 + 500) / 1000; //整数算法
                } else if (index == 3) {
                    gray = (R * 76 + G * 151 + B * 28) >> 8; //移位算法
                } else if (index == 4) {
                    gray = (R + G + B) / 3; //平均值算法
                } else {
                    gray = G; //仅取绿色
                }

                _img256.data[i] = gray;
                _img256.data[i + 1] = gray;
                _img256.data[i + 2] = gray;
            }
            return _img256;
        },
        $_Reversal: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let _img256 = paras.imgData;
            for (let i = 0; i < _img256.data.length; i += 4) {
                _img256.data[i] = 255 - _img256.data[i];
                _img256.data[i + 1] = 255 - _img256.data[i + 1];
                _img256.data[i + 2] = 255 - _img256.data[i + 2];
            }
            return _img256;
        },
        $_SingleColor: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let _singleColor =
                !paras.singleColor ||
                (paras.singleColor != 1 && paras.singleColor != 2)
                    ? 0
                    : paras.singleColor;
            let _img256 = paras.imgData;
            for (let i = 0; i < _img256.data.length; i += 4) {
                _img256.data[i] = 255 - _img256.data[i + _singleColor];
                _img256.data[i + 1] = 255 - _img256.data[i + _singleColor];
                _img256.data[i + 2] = 255 - _img256.data[i + _singleColor];
            }
            return _img256;
        },
        $_Smooth: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_ImgArrData2MatrixPixel(_img256.data);
            let newMatrix=matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows; i++) {
                for (let j = 0; j < iColumns; j++) {
                    let pixel = matrixPixel[i][j];
                    let tempPixel = { R: 0, G: 0, B: 0,A:0 };
                    let count = 0;
                    for (let ii = i - 1; ii <= i + 1; ii++) {
                        for (let jj = j-1; jj <= j + 1; jj++) {
                            if (
                                ii >= 0 &&
                                ii < iRows &&
                                jj >= 0 &&
                                jj < iColumns
                            ) {
                                count++;
                                tempPixel.R += matrixPixel[ii][jj].R;
                                tempPixel.G += matrixPixel[ii][jj].G;
                                tempPixel.B += matrixPixel[ii][jj].B;
                            }
                        }
                    }
                    newMatrix[i][j].R = tempPixel.R / count;
                    newMatrix[i][j].G = tempPixel.G / count;
                    newMatrix[i][j].B = tempPixel.B / count;
                }
            }
            _this.$_ImgMatrixPixel2ArrData(newMatrix,_img256.data);
            return _img256;
        },
        $_Neon:function(paras){
            var _this = this;
            if (!paras.imgData) return null;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_ImgArrData2MatrixPixel(_img256.data);
            let newMatrix=matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows; i++) {
                for (let j = 0; j < iColumns; j++) {
                    if(i+1<iRows&&j+1<iColumns){
                        newMatrix[i][j].R=2*Math.sqrt(Math.pow((matrixPixel[i][j].R-matrixPixel[i][j+1].R),2)+Math.pow((matrixPixel[i][j].R-matrixPixel[i+1][j].R),2));
                        newMatrix[i][j].G=2*Math.sqrt(Math.pow((matrixPixel[i][j].G-matrixPixel[i][j+1].G),2)+Math.pow((matrixPixel[i][j].G-matrixPixel[i+1][j].G),2));
                        newMatrix[i][j].B=2*Math.sqrt(Math.pow((matrixPixel[i][j].B-matrixPixel[i][j+1].B),2)+Math.pow((matrixPixel[i][j].B-matrixPixel[i+1][j].B),2));
                    }
                    else if(i+1<iRows){
                        newMatrix[i][j].R=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].R-matrixPixel[i+1][j].R),2));
                        newMatrix[i][j].G=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].G-matrixPixel[i+1][j].G),2));
                        newMatrix[i][j].B=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].B-matrixPixel[i+1][j].B),2));
                    }
                    else if(j+1<iColumns){
                        newMatrix[i][j].R=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].R-matrixPixel[i][j+1].R),2));
                        newMatrix[i][j].G=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].G-matrixPixel[i][j+1].G),2));
                        newMatrix[i][j].B=2*Math.sqrt(2*Math.pow((matrixPixel[i][j].B-matrixPixel[i][j+1].B),2));
                    }
                }
            }
            _this.$_ImgMatrixPixel2ArrData(newMatrix,_img256.data);
            return _img256;
        },
        $_Relief:function(paras){
            var _this = this;
            if (!paras.imgData) return null;
            const RELIEF_NUMBER=128;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_ImgArrData2MatrixPixel(_img256.data);
            let newMatrix=matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows-1; i++) {
                for (let j = 0; j < iColumns-1; j++) {
                    newMatrix[i][j].R=(matrixPixel[i][j].R-matrixPixel[i+1][j+1].R+RELIEF_NUMBER);
                    newMatrix[i][j].G=(matrixPixel[i][j].G-matrixPixel[i+1][j+1].G+RELIEF_NUMBER);
                    newMatrix[i][j].B=(matrixPixel[i][j].B-matrixPixel[i+1][j+1].B+RELIEF_NUMBER);
                    newMatrix[i][j].R<0?0:newMatrix[i][j].R>255?255:newMatrix[i][j].R;
                    newMatrix[i][j].G<0?0:newMatrix[i][j].R>255?255:newMatrix[i][j].G;
                    newMatrix[i][j].B<0?0:newMatrix[i][j].R>255?255:newMatrix[i][j].B;
                }
            }
            _this.$_ImgMatrixPixel2ArrData(newMatrix,_img256.data);
            _img256=_this.$_Gray({imgData:_img256,index:1});
            return _img256;
        },
        $_Inlay:function(paras){
            var _this = this;
            if (!paras.imgData) return null;
            const RELIEF_NUMBER=128;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_ImgArrData2MatrixPixel(_img256.data);
            let newMatrix=matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows-2; i+=3) {
                for (let j = 0; j < iColumns-2; j+=3) {
                    let R=(matrixPixel[i][j].R+matrixPixel[i][j+1].R+matrixPixel[i][j+2].R+matrixPixel[i+1][j].R+matrixPixel[i+1][j+1].R+matrixPixel[i+1][j+2].R+matrixPixel[i+2][j].R+matrixPixel[i+2][j+1].R+matrixPixel[i+2][j+2].R)/9;
                    let G=(matrixPixel[i][j].G+matrixPixel[i][j+1].G+matrixPixel[i][j+2].G+matrixPixel[i+1][j].G+matrixPixel[i+1][j+1].G+matrixPixel[i+1][j+2].G+matrixPixel[i+2][j].G+matrixPixel[i+2][j+1].G+matrixPixel[i+2][j+2].G)/9;
                    let B=(matrixPixel[i][j].B+matrixPixel[i][j+1].B+matrixPixel[i][j+2].B+matrixPixel[i+1][j].B+matrixPixel[i+1][j+1].B+matrixPixel[i+1][j+2].B+matrixPixel[i+2][j].B+matrixPixel[i+2][j+1].B+matrixPixel[i+2][j+2].B)/9;

                    matrixPixel[i][j].R=R;
                    matrixPixel[i][j+1].R=R;
                    matrixPixel[i][j+2].R=R;
                    matrixPixel[i+1][j].R=R;
                    matrixPixel[i+1][j+1].R=R;
                    matrixPixel[i+1][j+2].R=R;
                    matrixPixel[i+2][j].R=R;
                    matrixPixel[i+2][j+1].R=R;
                    matrixPixel[i+2][j+2].R=R;

                    matrixPixel[i][j].G=G;
                    matrixPixel[i][j+1].G=G;
                    matrixPixel[i][j+2].G=G;
                    matrixPixel[i+1][j].G=G;
                    matrixPixel[i+1][j+1].G=G;
                    matrixPixel[i+1][j+2].G=G;
                    matrixPixel[i+2][j].G=G;
                    matrixPixel[i+2][j+1].G=G;
                    matrixPixel[i+2][j+2].G=G;

                    matrixPixel[i][j].B=B;
                    matrixPixel[i][j+1].B=B;
                    matrixPixel[i][j+2].B=B;
                    matrixPixel[i+1][j].B=B;
                    matrixPixel[i+1][j+1].B=B;
                    matrixPixel[i+1][j+2].B=B;
                    matrixPixel[i+2][j].B=B;
                    matrixPixel[i+2][j+1].B=B;
                    matrixPixel[i+2][j+2].B=B;
                }
            }
            _this.$_ImgMatrixPixel2ArrData(newMatrix,_img256.data);
            _img256=_this.$_Gray({imgData:_img256,index:1});
            return _img256;
        },
        $_TwoValued_Fixed: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let index = !paras.index ? 1 : paras.index;
            let _img256 = paras.imgData;
            const THRESHOLD_VALUE=127;
            for (let i = 0; i < _img256.data.length; i += 4) {
                let R = _img256.data[i]; //R(0-255)
                let G = _img256.data[i + 1]; //G(0-255)
                let B = _img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                gray=gray>=THRESHOLD_VALUE?255:0;

                _img256.data[i] = gray;
                _img256.data[i + 1] = gray;
                _img256.data[i + 2] = gray;
            }

            return _img256;
        },
        $_TwoValued_AVG: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let index = !paras.index ? 1 : paras.index;
            let _img256 = paras.imgData;
            let iDataSum=0;
            let iDataCount=0;
            for (let i = 0; i < _img256.data.length; i += 4) {
                let R = _img256.data[i]; //R(0-255)
                let G = _img256.data[i + 1]; //G(0-255)
                let B = _img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                iDataSum+=gray;
                iDataCount++;
            }
            let thresholdValue=iDataSum/iDataCount;
            for (let i = 0; i < _img256.data.length; i += 4) {
                let R = _img256.data[i]; //R(0-255)
                let G = _img256.data[i + 1]; //G(0-255)
                let B = _img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                gray=gray>=thresholdValue?255:0;

                _img256.data[i] = gray;
                _img256.data[i + 1] = gray;
                _img256.data[i + 2] = gray;
            }

            return _img256;
        }
    }
};
</script>
<style scoped>
.menuTitle {
    color: wheat;
    text-align: left;
    line-height: 40px;
    margin-left: 20px;
    font-weight: 500;
    font-size: 20px;
}
.menuContent {
    position: absolute;
    top: 31px;
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: #333;
    text-align: left;
    display: inline-block;
}
.FuncMenu {
    color: white;
    text-align: center;
}
.FuncMenu li {
    cursor: pointer;
    line-height: 36px;
    text-align: left;
    padding-left: 35px;
}
.FuncMenu li:hover {
    background-color: #aaa;
    color: #333;
}

.imgContent {
    position: absolute;
    top: 31px;
    bottom: 0;
    left: 220px;
    right: 20px;
    display: inline-block;
    overflow: hidden;
    padding-top: 10px;
}
.imgShow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
</style>
