import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Vuetify from 'vuetify'
// import dotenv from 'dotenv'
// dotenv.config();
import VeeValidate from 'vee-validate';
import  {auth} from 'firebase/app'; 
import './components/firebaseInit'; 
 
let app;
auth().onAuthStateChanged((user)=>{
  if(!app){
    app = new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
Vue.use(VeeValidate);
Vue.use(Vuetify, {
  iconfont: 'sm'
}) 
Vue.config.productionTip = false
// Vue.use(BootstrapVue) 

global.vm = app;

