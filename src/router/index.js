import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Song from '@/components/Song'
import ImgProcess from '@/components/ImgProcess'
import Na from '@/components/Na'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/Song',
      name:'Song',
      component:Song
    },
    {
      path:'/ImgProcess',
      name:'ImgProcess',
      component:ImgProcess
    },
    {
      path:'/Na',
      name:'Na',
      component:Na
    },
    {
      path:'/Index',
      name:'Index',
      component:Index
    }
  ]
})
