import Vue from 'vue';
import Router from 'vue-router';
import Card from '@/components/Card';
import Song from '@/components/Song';
import ImgProcess from '@/components/ImgProcess';
import QRCode from '@/components/QRCode';
import ImageProcess from '@/components/ImageProcess';

Vue.use(Router);

/*
export default new Router({
  routes:[
    { path:'/Song', name:'Song', component:Song },
    { path:'/ImgProcess', name:'ImgProcess', component:ImgProcess },
    { path:'/QRCode', name:'QRCode', component:QRCode },
    { path:'/Card', name:'Card', component:Card }
  ]
})*/

const routes = [
    { path: '/Song', name: 'Song', component: Song },
    { path: '/ImgProcess', name: 'ImgProcess', component: ImgProcess },
    { path: '/ImageProcess', name: 'ImageProcess', component: ImageProcess },
    { path: '/QRCode', name: 'QRCode', component: QRCode },
    { path: '/Card', name: 'Card', component: Card }
];

const router = new Router({ routes: routes });

export default router;
