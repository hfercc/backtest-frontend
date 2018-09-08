// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import 'fontawesome'
Vue.config.productionTip = false
import axios from 'axios'
import store from 'storejs'
import './assets/style.css'

function GetUrlParams(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");

　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;

　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");

　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　}

function goodTime(str){
  var now = new Date().getTime(),
  oldTime = new Date(str).getTime(),
  difference = now - oldTime,
  result='',
  minute = 1000 * 60,
  hour = minute * 60,
  day = hour * 24,
  halfamonth = day * 15,
  month = day * 30,
  year = month * 12,
 
  _year = difference/year,
  _month =difference/month,
  _week =difference/(7*day),
  _day =difference/day,
  _hour =difference/hour,
  _min =difference/minute;
  if(_year>=1) {result= "    Uploaded " + ~~(_year) + " year(s) ago"}
  else if(_month>=1) {result= "    Uploaded " + ~~(_month) + " month(s) ago"}
  else if(_week>=1) {result= "    Uploaded " + ~~(_week) + " week(s) ago"}
  else if(_day>=1) {result= "    Uploaded " + ~~(_day) +" day(s) ago"}
  else if(_hour>=1) {result= "    Uploaded " + ~~(_hour) +" hour(s) ago"}
  else if(_min>=1) {result= "    Uploaded " + ~~(_min) +" minutes(s) ago"}
  else result="    Just now";
  return result;
}
Vue.filter('time', function (value) {
  return goodTime(value);
})
window.GetUrlParams = GetUrlParams

axios.interceptors.request.use(
    config => {
        let token = store.get('token')
        if (token && token.length > 0)
            config.headers['Authorization'] = 'JWT ' + token
        return config
    })
window.axios = axios
window.store = store
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    'user': null
  },
})
