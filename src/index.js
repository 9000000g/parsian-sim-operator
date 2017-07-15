/* global CONFIG, PKG_NAME, PKG_VERSION, process */
import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from 'framevuerk/dist/framevuerk-fa.js'
import moment from 'moment-jalaali'
import 'font-awesome/css/font-awesome.css'
import './index.html'
import _main from './pages/_main'
import login from './pages/login'
import main from './pages/main'
import qs from 'qs'
import axios from 'axios'

framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(framevuerk)


// Routes
const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'main',
      path: '/',
      component: main
    },
    {
      name: 'notfound',
      path: '/*'
    }
  ]
})

const ENV = process.env.NODE_ENV || 'development';
const SSO_URL = process.env.SSO_URL || (ENV == 'development'? 'https://radtest.pec.ir/sso/v1/oauth2/token': 'https://ssoapi.pec.ir/v1/oauth2/token');
const CLIENT_ID = process.env.CLIENT_ID || ('b9dc712c952b4aafb481abede0fec4d8');

const session = JSON.parse( global.localStorage.getItem('me') );
const guestUser = {
    access_token: null,
    token_type: null
}
export default new Vue({
  data () {
    return {
      mainClass: ['fv-col-lg-10', 'fv-col-offset-lg-1', 'fv-col-xl-8', 'fv-col-offset-xl-2'],
      mainClassMin: ['fv-col-sm-8', 'fv-col-offset-sm-2', 'fv-col-md-6', 'fv-col-offset-md-3'],
      me: session === null? guestUser: session,
      loading: false,
      axios: axios.create({
        baseURL: '/api',
        timeout: 120000,
        headers: {
          token: null,
          "cache-control": "no-cache"
        }
      }),
    }
  },
  created(){
    this.setToken();
    this.routeChange();
  },
  watch: {
    $route(){
      this.routeChange();
    }
  },
  methods: {
    login (user) {
      this.loading = true;
      const failed = ()=>{
        this.logout();
        alert('نام کاربری یا رمزعبور اشتباه است!');
      }
      user.client_id = CLIENT_ID;
      axios({
        method: 'post',
        url: SSO_URL,
        data: qs.stringify(user),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        this.loading = false;
        if( response.status === 200 ){
          this.me = response.data;
          global.localStorage.setItem('me', JSON.stringify(this.me) );
          this.setToken();
          this.$router.push(`/`);
        }
        else{
          failed();
        }
      }).catch(response => {
        this.loading = false;
        failed();
      });
    },
    logout (force=false) {
      this.me = guestUser;
      global.localStorage.removeItem('me');
      this.setToken();
      this.$router.push(`/login`);
    },
    setToken(){
      this.$root.axios.defaults.headers.Authorization = this.me.access_token;
    },
    routeChange(){
      // if (!this.$refs.sidebar.pPin) {
      //   this.$refs.sidebar.close()
      // }

      if( this.me.access_token === null ){
        this.logout();
      }
      else if( this.$route.name === 'login' || this.$route.name === 'notfound' ){
        this.$router.push(`/`);
      }
    }
  },
  router,
  render: h => h(_main)
}).$mount('#app')