import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import auth from 'firebase';
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        requiresGuest: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta:{
        requiresGuest: true
      }
    },{
      path: '/lesson plans',
      name: 'lesson plans',
      component: () => import(/* webpackChunkName: "about" */ './views/lesson plans.vue'),
      meta:{
        requiresAuth: true
      }
    },{
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "about" */ './views/empoyeeChart.vue'),
      meta:{
        requiresAuth: true
      }
      
    }
    ,{
      path: '/dashboard/:id',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "about" */ './views/Dashboard.vue'),
      meta:{
        requiresAuth: true
      }
    }
    ,{
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "about" */ './views/popup-signin.vue'),
      meta:{
        requiresGuest: true
      }
    }
    ,{
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "about" */ './views/popup-signup.vue'),
      meta:{
        requiresGuest: true
      }
    }
   
 
  ]
})

//Nav Guards
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!auth.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.hash
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (auth.auth().currentUser) {
      // Go to login
      next({
        path: '/dashboard',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;