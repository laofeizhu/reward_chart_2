import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  // For fire base auto sign in. See https://medium.com/@oleg.agapov/basic-single-page-application-using-vue-js-and-firebase-part-2-143a3084266f
  created () {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        store.dispatch('autoSignIn')
      }
    })
  },
}).$mount('#app')
