import Vue from "vue"
import Router from "vue-router"
import { auth } from '@/firebase'

const routerOptions = [
  { path: "/", component: "Landing" },
  { path: "/signin", component: "SignIn" },
  { path: "/signup", component: "SignUp" },
  { path: "/kids", component: "Kids", meta: { requiresAuth: true } },
  { path: "/badges", component: "Badges", meta: { requiresAuth: true } },
  { path: "/rewards", component: "Rewards", meta: { requiresAuth: true } },
  { path: "/home", component: "Home", meta: { requiresAuth: true } },
  { path: "*", component: "NotFound" }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  };
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/signin')
  } else {
    next()
  }
})

export default router
