import Vue from 'vue';
import Router from 'vue-router';
import Card from '@/components/Card';
import Song from '@/components/Song';
import QRCode from '@/components/QRCode';
import ImageProcess from '@/components/ImageProcess';
import Map from '@/components/Map';
import Index from '@/components/Index'
import Welcome from '@/components/Welcome'

Vue.use(Router);
const routes = [
    {path:'/',name:'Index',component:Index,children:[
        { path: '/', name: 'Welcome', component: Welcome },
        { path: '/Song', name: 'Song', component: Song },
        { path: '/ImageProcess', name: 'ImageProcess', component: ImageProcess },
        { path: '/QRCode', name: 'QRCode', component: QRCode },
        { path: '/Card', name: 'Card', component: Card },
        { path: '/Map', name: 'Map', component: Map }]
    }
    
];

const router = new Router({ 
    mode: 'history',
    routes: routes 
});

export default router;
