<template>
  <div class="mapPage">
      <div class="tools">
          <input type="button" class="color1 btn" v-on:click="$_location" value="定位" />
          <input class="searchText" placeholder="搜索关键词" type="text" v-model="searchKey">
          <input type="button" class="color1 btn" v-on:click="$_searchByKey" value="搜索" />
      </div>
      <div id="mapBox" class="mapBox h-center" ref="eleMap"></div>
  </div>
</template>
<script>
import {BaiduMap} from '../scripts/BaiduMap'
var map=null;
export default {
    name:'Map',
    data () {
        return {
            searchKey:'',
            loc:{
                address_detail:{
                    province:'',
                    city:'',
                    city_code:-1,
                    district:'',
                    street:'',
                    street_number:''
                },
                point:{
                    lat:'',
                    lng:''
                }
            }
        };
    },
    created () {
        var self=this;
        let data = {
            url: window.location.hash,
            title: '百度地图'
        };
        self.$emit('CompInit', data);
        
    },
    mounted () {
        var self=this;
        BaiduMap().then(function(){
            self.$_mapInit();
        })
        
    },
    methods:{
        $_mapInit:function(){
            var self = this;
            if(map!=null){
                self.$refs.eleMap.innerHTML='';
            }
            map = new BMap.Map('mapBox')    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)  // 初始化地图,设置中心点坐标和地图级别
            //添加地图类型控件
            map.addControl(new BMap.MapTypeControl({
                mapTypes:[
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]}))   
            map.setCurrentCity('北京')          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
            self.$_location()
        },
        $_location:function(){
            var self=this;
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    self.loc={
                        address_detail:{
                            province:r.address.province,
                            city:r.address.city,
                            city_code:r.address.city_code,
                            district:r.address.district,
                            street:r.address.street,
                            street_number:r.address.street_number
                        },
                        point:{
                            lng:r.longitude,
                            lat:r.latitude
                        }
                    };
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    map.setZoom(17);
                    //alert('您的位置：'+r.point.lng+','+r.point.lat);
                }
                else {
                    alert('failed'+this.getStatus());
                    self.$_locationByIP();
                }        
            },{enableHighAccuracy: true})
        },
        $_locationByIP:function(){
            var self=this;
            self.$jsonp('https://api.map.baidu.com/location/ip?ak=D8vIxM49PE7Dq9PYA5DZnzWMdwf1QPIX&coor=bd09ll',null,function(err,data){
                 if (err) {
                    console.error('error',err.message);
                } else {
                    if(data.status===0){
                        self.loc={
                            address_detail:{
                                province:data.content.address_detail.province,
                                city:data.content.address_detail.city,
                                city_code:data.content.address_detail.city_code,
                                district:data.content.address_detail.district,
                                street:data.content.address_detail.street,
                                street_number:data.content.address_detail.street_number
                            },
                            point:{
                                lng:data.content.point.x,
                                lat:data.content.point.y
                            }
                        };
                        if(map){
                            map.centerAndZoom(new BMap.Point(data.content.point.x, data.content.point.y), 11)
                        }
                    }
                }
            });
        },
        $_searchByKey:function(){
            var self=this;
            self.searchKey=self.searchKey.trim();
            if(map){
                map.clearOverlays();
                let local = new BMap.LocalSearch(map, {      
                    renderOptions:{map: map},
                    onSearchComplete:function(searchResult){
                        if(searchResult.getPoi(0)){
                            map.centerAndZoom(searchResult.getPoi(0).point, 13);
                        }
                    }   
                });    
                local.search(self.searchKey);
            }
            
        }
    }
}    
</script>
<style scoped>
.mapPage,.mapBox{
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.tools{
    position: fixed;
    z-index: 1;
    top:0;
    left: 0;
    right:0;
    height: 10%;
    padding-top:10px;
}
.tools input{
    line-height:24px;
    margin:0 5px;
}
.btn{
    white-space: nowrap;
    padding: 0 10px;
    border-radius: 30px;
    border: 1px solid #aaa;
}
.searchText{
    border-style: none none solid none;
    border-width: 1px;
    width:100px;
    outline: none;
    text-indent: 5px;    
    background-color: #F3F3F3;
    border-radius: 3px;
}
</style>

