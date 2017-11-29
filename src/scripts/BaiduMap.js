export function BaiduMap() {  
    return new Promise(function (resolve, reject) {  
        window.baiduMap_Init = function () {
            resolve(BMap)  
        }  
        var script = document.createElement("script");  
        script.type = "text/javascript";  
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=D8vIxM49PE7Dq9PYA5DZnzWMdwf1QPIX&callback=baiduMap_Init";  
        script.onerror = reject;
        document.head.appendChild(script); 
    })  
} 