// Dependencies
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Privacy from '../views/Privacy.vue'
import App from '../views/App.vue'
import NotFound from '../views/NotFound.vue'
import { store } from './store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy,
    },
    {
      path: '/app',
      name: 'app',
      component: App,
      meta: { requiresAuth: true },
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = store.state.user

  if (requiresAuth && !user) {
    next('/')
  } else {
    if (to.path === '/' && user) {
      next('/app')
    } else {
      next()
    }
  }
})

export default router
