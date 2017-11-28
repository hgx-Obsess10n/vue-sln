<template>
  <div>
    <input type="file" style="display:none" v-on:change="$_changeFile" ref="eleIFile">
    <span class="sp h-center color1" v-on:click="$_chooseFile">选择图片</span>
    <span class="sp h-center color1" v-on:click.stop="$_setFnListShow(true)">{{curFnTitle}}</span>
    <ul v-show="fnListShow" class="fnList ul-nolist">
      <li v-on:click="$_setFnTitle('原图');$_showImg()">原图</li>
      <li v-on:click="$_setFnTitle('灰度变换-浮点算法');$_imgTranslate($_gray,{index:1})">灰度变换-浮点算法</li>
      <!--<li v-on:click="$_setFnTitle('灰度变换-整数算法');$_imgTranslate($_gray,{index:2})">灰度变换-整数算法</li>
      <li v-on:click="$_setFnTitle('灰度变换-移位算法');$_imgTranslate($_gray,{index:3})">灰度变换-移位算法</li>
      <li v-on:click="$_setFnTitle('灰度变换-平均值算法');$_imgTranslate($_gray,{index:4})">灰度变换-平均值算法</li>-->
      <li v-on:click="$_setFnTitle('逆反处理');$_imgTranslate($_reversal)">逆反处理</li>
      <li v-on:click="$_setFnTitle('全取红色');$_imgTranslate($_singleColor,{singleColor:0})">全取红色</li>
      <li v-on:click="$_setFnTitle('全取绿色');$_imgTranslate($_singleColor,{singleColor:1})">全取绿色</li>
      <li v-on:click="$_setFnTitle('全取蓝色');$_imgTranslate($_singleColor,{singleColor:2})">全取蓝色</li>
      <li v-on:click="$_setFnTitle('平滑处理');$_imgTranslate($_smooth)">平滑处理</li>
      <li v-on:click="$_setFnTitle('霓虹处理');$_imgTranslate($_neon)">霓虹处理</li>
      <li v-on:click="$_setFnTitle('浮雕处理');$_imgTranslate($_relief)">浮雕处理</li>
      <li v-on:click="$_setFnTitle('镶嵌处理');$_imgTranslate($_inlay)">镶嵌处理</li>
      <li v-on:click="$_setFnTitle('二值化-弱智127阈值');$_imgTranslate($_twoValued_Fixed)">二值化-弱智127阈值</li>
      <li v-on:click="$_setFnTitle('二值化-平均值阈值');$_imgTranslate($_twoValued_AVG)">二值化-平均值阈值</li>
    </ul>
    <br>
    <canvas class="canvasImg h-center" v-bind:width="canvasWidth" v-bind:height="canvasHeight" ref="eleCanvas"></canvas>
  </div>
</template>
<script>
export default {
    name: "ImageProcess",
    created: function() {
        let data = {
            url: window.location.hash,
            title: "图片处理"
        };
        this.$emit("CompInit", data);
    },
    data: function() {
        return {
            curFileName: "",
            curFnTitle: "原图",
            canvasWidth: 500,
            canvasHeight: 500,
            imgWidth: 0,
            imgHeight: 0,
            MAX_WIDTH: 500,
            MAX_HEIGHT: 500,
            fnListShow: false
        };
    },
    methods: {
        $_chooseFile: function() {
            var self = this;
            self.$refs.eleIFile.click();
        },
        $_setFnListShow: function(bShow) {
            var self = this;
            self.fnListShow = bShow;
        },
        $_setFnTitle: function(text) {
            var self = this;
            self.curFnTitle = text ? text : "";
        },
        $_changeFile: function() {
            var self = this;
            let files = self.$refs.eleIFile.files;
            if (files.length > 0) {
                let file = files[0];
                if (!/^image\//.test(file.type)) {
                    alert("请选择图像文件");
                    return;
                }
                let fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function(res) {
                    self.imgBase64 = res.target.result;
                    self.curFnTitle = "原图";
                    self.$_showImg();
                };
            }
        },
        $_showImg: function(fnCallback) {
            var self = this;
            let img = new Image();
            img.src = self.imgBase64;
            img.onload = function(res) {
                let width = res.target.width;
                let height = res.target.height;
                let ratio = 1;
                if (width > self.MAX_WIDTH) {
                    ratio = self.MAX_WIDTH / width;
                }
                if (height * ratio > self.MAX_HEIGHT) {
                    ratio = self.MAX_HEIGHT / height;
                }

                self.canvasWidth = self.imgWidth = width = width * ratio;
                self.canvasHeight = self.imgHeight = height = height * ratio;

                self.$nextTick(function() {
                    self.$refs.eleCanvas
                        .getContext("2d")
                        .clearRect(0, 0, self.canvasWidth, self.canvasHeight);

                    let eleCanvas = self.$refs.eleCanvas;
                    let ctx = eleCanvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    if (typeof fnCallback == "function") {
                        fnCallback();
                    }
                });
            };
        },
        $_parentGlobalClick: function() {
            var self = this;
            self.fnListShow = false;
        },
        $_imgArrData2MatrixPixel: function(imgArrData) {
            var self = this;
            let pixels = [];
            let rowPixels = [];
            for (let i = 0, rowIndex = 0; i < imgArrData.length; i += 4) {
                if (i >= (rowIndex + 1) * self.canvasWidth * 4) {
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
        $_imgMatrixPixel2ArrData(matrixPixel, arrData) {
            let imgArrData = [];
            let i = 0;
            matrixPixel.forEach(row => {
                row.forEach(pixel => {
                    if (!arrData) {
                        imgArrData.push(pixel.R);
                        imgArrData.push(pixel.G);
                        imgArrData.push(pixel.B);
                        imgArrData.push(pixel.A);
                    } else {
                        arrData[i] = pixel.R;
                        arrData[i + 1] = pixel.G;
                        arrData[i + 2] = pixel.B;
                        arrData[i + 3] = pixel.A;
                        i += 4;
                    }
                });
            });
            if (!arrData) {
                return imgArrData;
            }
        },
        $_imgTranslate: function(fnProcess, fnParas) {
            var self = this;
            if (!self.imgBase64 || typeof fnProcess != "function") {
                return;
            }
            if (!fnParas) {
                fnParas = {};
            }
            self.$_showImg(function() {
                let eleCanvas = self.$refs.eleCanvas;
                let ctx = eleCanvas.getContext("2d");
                let img256 = ctx.getImageData(
                    0,
                    0,
                    self.canvasWidth,
                    self.canvasHeight
                );

                fnParas.imgData = img256;
                img256 = fnProcess(fnParas);
                if (img256) {
                    self.$refs.eleCanvas
                        .getContext("2d")
                        .clearRect(0, 0, self.canvasWidth, self.canvasHeight);
                    ctx.putImageData(
                        img256,
                        0,
                        0,
                        0,
                        0,
                        self.canvasWidth,
                        self.canvasHeight
                    );
                }
            });
        },
        $_gray: function(paras) {
            if (!paras.imgData) {
                return null;
            }
            let index = !paras.index ? 1 : paras.index;
            let img256 = paras.imgData;
            for (let i = 0; i < img256.data.length; i += 4) {
                let R = img256.data[i]; //R(0-255)
                let G = img256.data[i + 1]; //G(0-255)
                let B = img256.data[i + 2]; //B(0-255)

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

                img256.data[i] = gray;
                img256.data[i + 1] = gray;
                img256.data[i + 2] = gray;
            }
            return img256;
        },
        $_reversal: function(paras) {
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            for (let i = 0; i < img256.data.length; i += 4) {
                img256.data[i] = 255 - img256.data[i];
                img256.data[i + 1] = 255 - img256.data[i + 1];
                img256.data[i + 2] = 255 - img256.data[i + 2];
            }
            return img256;
        },
        $_singleColor: function(paras) {
            if (!paras.imgData) {
                return null;
            }
            let singleColor =
                !paras.singleColor ||
                (paras.singleColor != 1 && paras.singleColor != 2)
                    ? 0
                    : paras.singleColor;
            let img256 = paras.imgData;
            for (let i = 0; i < img256.data.length; i += 4) {
                img256.data[i] = 255 - img256.data[i + singleColor];
                img256.data[i + 1] = 255 - img256.data[i + singleColor];
                img256.data[i + 2] = 255 - img256.data[i + singleColor];
            }
            return img256;
        },
        $_smooth: function(paras) {
            var self = this;
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            let matrixPixel = self.$_imgArrData2MatrixPixel(img256.data);
            let newMatrix = matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows; i++) {
                for (let j = 0; j < iColumns; j++) {
                    let tempPixel = { R: 0, G: 0, B: 0, A: 0 };
                    let count = 0;
                    for (let ii = i - 1; ii <= i + 1; ii++) {
                        for (let jj = j - 1; jj <= j + 1; jj++) {
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
            self.$_imgMatrixPixel2ArrData(newMatrix, img256.data);
            return img256;
        },
        $_neon: function(paras) {
            var self = this;
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            let matrixPixel = self.$_imgArrData2MatrixPixel(img256.data);
            let newMatrix = matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows; i++) {
                for (let j = 0; j < iColumns; j++) {
                    if (i + 1 < iRows && j + 1 < iColumns) {
                        newMatrix[i][j].R =
                            2 *
                            Math.sqrt(
                                Math.pow(
                                    matrixPixel[i][j].R -
                                        matrixPixel[i][j + 1].R,
                                    2
                                ) +
                                    Math.pow(
                                        matrixPixel[i][j].R -
                                            matrixPixel[i + 1][j].R,
                                        2
                                    )
                            );
                        newMatrix[i][j].G =
                            2 *
                            Math.sqrt(
                                Math.pow(
                                    matrixPixel[i][j].G -
                                        matrixPixel[i][j + 1].G,
                                    2
                                ) +
                                    Math.pow(matrixPixel[i][j].G - matrixPixel[i + 1][j].G, 2)
                            );
                        newMatrix[i][j].B=
                            2 *
                            Math.sqrt(
                                Math.pow(
                                    matrixPixel[i][j].B -
                                        matrixPixel[i][j + 1].B,
                                    2
                                ) +
                                    Math.pow(
                                        matrixPixel[i][j].B -
                                            matrixPixel[i + 1][j].B,
                                        2
                                    )
                            );
                    } else if (i + 1 < iRows) {
                        newMatrix[i][j].R =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].R -
                                            matrixPixel[i + 1][j].R,
                                        2
                                    )
                            );
                        newMatrix[i][j].G =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].G -
                                            matrixPixel[i + 1][j].G,
                                        2
                                    )
                            );
                        newMatrix[i][j].B =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].B -
                                            matrixPixel[i + 1][j].B,
                                        2
                                    )
                            );
                    } else if (j + 1 < iColumns) {
                        newMatrix[i][j].R =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].R -
                                            matrixPixel[i][j + 1].R,
                                        2
                                    )
                            );
                        newMatrix[i][j].G =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].G -
                                            matrixPixel[i][j + 1].G,
                                        2
                                    )
                            );
                        newMatrix[i][j].B =
                            2 *
                            Math.sqrt(
                                2 *
                                    Math.pow(
                                        matrixPixel[i][j].B -
                                            matrixPixel[i][j + 1].B,
                                        2
                                    )
                            );
                    }
                }
            }
            self.$_imgMatrixPixel2ArrData(newMatrix, img256.data);
            return img256;
        },
        $_relief: function(paras) {
            var self = this;
            if (!paras.imgData) {
                return null;
            }
            const RELIEF_NUMBER = 128;
            let img256 = paras.imgData;
            let matrixPixel = self.$_imgArrData2MatrixPixel(img256.data);
            let newMatrix = matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows - 1; i++) {
                for (let j = 0; j < iColumns - 1; j++) {
                    newMatrix[i][j].R =
                        matrixPixel[i][j].R -
                        matrixPixel[i + 1][j + 1].R +
                        RELIEF_NUMBER;
                    newMatrix[i][j].G =
                        matrixPixel[i][j].G -
                        matrixPixel[i + 1][j + 1].G +
                        RELIEF_NUMBER;
                    newMatrix[i][j].B =
                        matrixPixel[i][j].B -
                        matrixPixel[i + 1][j + 1].B +
                        RELIEF_NUMBER;
                    newMatrix[i][j].R =
                        newMatrix[i][j].R < 0
                            ? 0
                            : newMatrix[i][j].R > 255 ? 255 : newMatrix[i][j].R;
                    newMatrix[i][j].G =
                        newMatrix[i][j].G < 0
                            ? 0
                            : newMatrix[i][j].G > 255 ? 255 : newMatrix[i][j].G;
                    newMatrix[i][j].B =
                        newMatrix[i][j].B < 0
                            ? 0
                            : newMatrix[i][j].B > 255 ? 255 : newMatrix[i][j].B;
                }
            }
            self.$_imgMatrixPixel2ArrData(newMatrix, img256.data);
            img256 = self.$_gray({ imgData: img256, index: 1 });
            return img256;
        },
        $_inlay: function(paras) {
            var self = this;
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            let matrixPixel = self.$_imgArrData2MatrixPixel(img256.data);
            let newMatrix = matrixPixel.slice(0);
            let iRows = matrixPixel.length;
            let iColumns = matrixPixel[0].length;
            for (let i = 0; i < iRows - 2; i += 3) {
                for (let j = 0; j < iColumns - 2; j += 3) {
                    let R =
                        (matrixPixel[i][j].R +
                            matrixPixel[i][j + 1].R +
                            matrixPixel[i][j + 2].R +
                            matrixPixel[i + 1][j].R +
                            matrixPixel[i + 1][j + 1].R +
                            matrixPixel[i + 1][j + 2].R +
                            matrixPixel[i + 2][j].R +
                            matrixPixel[i + 2][j + 1].R +
                            matrixPixel[i + 2][j + 2].R) /
                        9;
                    let G =
                        (matrixPixel[i][j].G +
                            matrixPixel[i][j + 1].G +
                            matrixPixel[i][j + 2].G +
                            matrixPixel[i + 1][j].G +
                            matrixPixel[i + 1][j + 1].G +
                            matrixPixel[i + 1][j + 2].G +
                            matrixPixel[i + 2][j].G +
                            matrixPixel[i + 2][j + 1].G +
                            matrixPixel[i + 2][j + 2].G) /
                        9;
                    let B =
                        (matrixPixel[i][j].B +
                            matrixPixel[i][j + 1].B +
                            matrixPixel[i][j + 2].B +
                            matrixPixel[i + 1][j].B +
                            matrixPixel[i + 1][j + 1].B +
                            matrixPixel[i + 1][j + 2].B +
                            matrixPixel[i + 2][j].B +
                            matrixPixel[i + 2][j + 1].B +
                            matrixPixel[i + 2][j + 2].B) /
                        9;

                    matrixPixel[i][j].R = R;
                    matrixPixel[i][j + 1].R = R;
                    matrixPixel[i][j + 2].R = R;
                    matrixPixel[i + 1][j].R = R;
                    matrixPixel[i + 1][j + 1].R = R;
                    matrixPixel[i + 1][j + 2].R = R;
                    matrixPixel[i + 2][j].R = R;
                    matrixPixel[i + 2][j + 1].R = R;
                    matrixPixel[i + 2][j + 2].R = R;

                    matrixPixel[i][j].G = G;
                    matrixPixel[i][j + 1].G = G;
                    matrixPixel[i][j + 2].G = G;
                    matrixPixel[i + 1][j].G = G;
                    matrixPixel[i + 1][j + 1].G = G;
                    matrixPixel[i + 1][j + 2].G = G;
                    matrixPixel[i + 2][j].G = G;
                    matrixPixel[i + 2][j + 1].G = G;
                    matrixPixel[i + 2][j + 2].G = G;

                    matrixPixel[i][j].B = B;
                    matrixPixel[i][j + 1].B = B;
                    matrixPixel[i][j + 2].B = B;
                    matrixPixel[i + 1][j].B = B;
                    matrixPixel[i + 1][j + 1].B = B;
                    matrixPixel[i + 1][j + 2].B = B;
                    matrixPixel[i + 2][j].B = B;
                    matrixPixel[i + 2][j + 1].B = B;
                    matrixPixel[i + 2][j + 2].B = B;
                }
            }
            self.$_imgMatrixPixel2ArrData(newMatrix, img256.data);
            img256 = self.$_gray({ imgData: img256, index: 1 });
            return img256;
        },
        $_twoValued_Fixed: function(paras) {
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            const THRESHOLD_VALUE = 127;
            for (let i = 0; i < img256.data.length; i += 4) {
                let R = img256.data[i]; //R(0-255)
                let G = img256.data[i + 1]; //G(0-255)
                let B = img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                gray = gray >= THRESHOLD_VALUE ? 255 : 0;

                img256.data[i] = gray;
                img256.data[i + 1] = gray;
                img256.data[i + 2] = gray;
            }

            return img256;
        },
        $_twoValued_AVG: function(paras) {
            if (!paras.imgData) {
                return null;
            }
            let img256 = paras.imgData;
            let iDataSum = 0;
            let iDataCount = 0;
            for (let i = 0; i < img256.data.length; i += 4) {
                let R = img256.data[i]; //R(0-255)
                let G = img256.data[i + 1]; //G(0-255)
                let B = img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                iDataSum += gray;
                iDataCount++;
            }
            let thresholdValue = iDataSum / iDataCount;
            for (let i = 0; i < img256.data.length; i += 4) {
                let R = img256.data[i]; //R(0-255)
                let G = img256.data[i + 1]; //G(0-255)
                let B = img256.data[i + 2]; //B(0-255)

                let gray = R * 0.299 + G * 0.587 + B * 0.114;
                gray = gray >= thresholdValue ? 255 : 0;

                img256.data[i] = gray;
                img256.data[i + 1] = gray;
                img256.data[i + 2] = gray;
            }

            return img256;
        }
    }
};
</script>
<style scoped>
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

.canvasImg {
    display: block;
    margin-top: 15px;
    max-width: 70%;
    max-height: 70%;
}
.fnList {
    position: absolute;
    top: 73px;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border: 1px solid #aaa;
    border-top: none;
    border-radius: 10px;
}
.fnList li {
    text-align: center;
    cursor: pointer;
}
.fnList li:hover {
    background-color: rgb(255, 242, 184);
    color: rgb(0, 136, 186);
}
</style>
