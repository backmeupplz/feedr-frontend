// Dependencies
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Privacy from '../views/Privacy.vue'
import App from '../views/App.vue'
import NotFound from '../views/NotFound.vue'
import paymentFailure from '../views/FailedPayment.vue'
import paymentSuccess from '../views/SuccessPayment.vue'
import { store } from './store/store'
import * as storemodule from './store/store'
import * as api from '../utils/api'
declare let sockets: any

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'login',
          name: 'login',
          component: App,
          children: [{ path: 'tg', name: 'tg-login', component: App }],
        },
      ],
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
      children: [
        {
          path: 'chat/:id',
          name: 'chat',
          component: App,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
    {
      path: '/payment_success',
      name: 'paymentSuccess',
      component: paymentSuccess,
    },
    {
      path: '/payment_failure',
      name: 'paymentFailure',
      component: paymentFailure,
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = store.state.user

  // TG-LOGIN
  if (to.name === 'tg-login') {
    try {
      const user = await api.loginTelegram(to.query)
      storemodule.setUser(user)
      sockets.send('authorization', user.token)
      try {
        storemodule.setBots(await api.getBots())
        next('/app')
      } catch (err) {
        next('/')
        storemodule.setSnackbarError(err.message)
      }
    } catch (err) {
      next('/')
      storemodule.setSnackbar({
        message: 'errors.login.telegram',
        color: 'error',
        active: true,
      })
    }
    return
  }
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
