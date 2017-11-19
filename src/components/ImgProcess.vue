<template>
  <div class="clearfix">
      <!--Menu-->
      <div class="menuContent">
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
             <li v-on:click="$_imgTranslate($_imgSmooth)">平滑处理</li>
             <li v-on:click="$_imgTranslate($_imgNeon)">霓虹处理</li>
             <li v-on:click="$_imgTranslate($_imgRelief)">浮雕处理</li>
          </ul>
      </div>
      <!--Image-->
      <div class="imgContent">
            <input class="v-center" type="file" v-on:change="$_imgFileChange" ref="eleImgFile">
            <canvas class="imgShow" v-bind:width="imgWidth" v-bind:height="imgHeight" ref="eleImgCanvas"></canvas>
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
            imgWidth: 500,
            imgHeight: 500
        };
    },
    methods: {
        $_imgFileChange: function() {
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
                    _this.$_showImg();
                };
            }
        },
        $_showImg: function(callback) {
            var _this = this;
            let img = new Image();
            img.src = _this.imgNowData;
            img.onload = function(res) {
                let _width = res.target.width;
                let _height = res.target.height;
                let ratio = 1;
                if (_width > 500) ratio = 500 / _width;
                if (_height * ratio > 500) ratio = 500 / _height;

                _width = _width * ratio;
                _height = _height * ratio;

                _this.$refs.eleImgCanvas
                    .getContext("2d")
                    .clearRect(0, 0, _this.imgWidth, _this.imgHeight);

                let eleCanvas = _this.$refs.eleImgCanvas;
                let ctx = eleCanvas.getContext("2d");
                ctx.drawImage(
                    img,
                    (_this.imgWidth - _width) / 2,
                    (_this.imgHeight - _height) / 2,
                    _width,
                    _height
                );

                if (typeof callback == "function") callback();
            };
        },
        $_imgArrData2MatrixPixel: function(imgArrData) {
            var _this = this;
            let pixels = [];
            let rowPixels = [];
            for (let i = 0, rowIndex = 0; i < imgArrData.length; i += 4) {
                if (i >= (rowIndex + 1) * _this.imgWidth * 4) {
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
        $_imgMatrixPixel2ArrData(matrixPixel,arrData) {
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
        $_imgTranslate: function(funcName, funcPara) {
            var _this = this;
            if (!_this.imgData || typeof funcName != "function") return;
            if (funcPara == undefined) funcPara = {};
            _this.$_showImg(function() {
                let eleCanvas = _this.$refs.eleImgCanvas;
                let ctx = eleCanvas.getContext("2d");
                let _img256 = ctx.getImageData(
                    0,
                    0,
                    _this.imgWidth,
                    _this.imgHeight
                );

                funcPara.imgData = _img256;
                _img256 = funcName(funcPara);
                if (_img256) {
                    _this.$refs.eleImgCanvas
                        .getContext("2d")
                        .clearRect(0, 0, _this.imgWidth, _this.imgHeight);
                    ctx.putImageData(
                        _img256,
                        0,
                        0,
                        0,
                        0,
                        _this.imgWidth,
                        _this.imgHeight
                    );
                }
            });
        },
        $_imgGray: function(paras) {
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
        $_imgReversal: function(paras) {
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
        $_imgSingleColor: function(paras) {
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
        $_imgSmooth: function(paras) {
            var _this = this;
            if (!paras.imgData) return null;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_imgArrData2MatrixPixel(_img256.data);
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
            _this.$_imgMatrixPixel2ArrData(newMatrix,_img256.data);
            return _img256;
        },
        $_imgNeon:function(paras){
            var _this = this;
            if (!paras.imgData) return null;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_imgArrData2MatrixPixel(_img256.data);
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
            _this.$_imgMatrixPixel2ArrData(newMatrix,_img256.data);
            return _img256;
        },
        $_imgRelief:function(paras){
            var _this = this;
            if (!paras.imgData) return null;
            const RELIEF_NUMBER=128;
            let _img256 = paras.imgData;
            let matrixPixel = _this.$_imgArrData2MatrixPixel(_img256.data);
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
            _this.$_imgMatrixPixel2ArrData(newMatrix,_img256.data);
            _img256=_this.$_imgGray({imgData:_img256,index:1});
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
