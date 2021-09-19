const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/booking', component: Booking, name: 'Booking' },
  { path: '/about', component: About, name: 'About' }
];

const router = new VueRouter({
  routes: routes,
  // mode: 'history',
  // base: '/'
})

let app = new Vue({
  el: '#app',
  router: router
})
