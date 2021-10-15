const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/create_and_view_booking', component: CreateAndViewBooking, name: 'CreateAndViewBooking' },
  { path: '/manage_booking', component: ManageBooking, name: 'ManageBooking' },
  { path: '/manage_assets', component: ManageAssets, name: 'ManageAssets' },
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
});

Vue.use(Dropdown);
Vue.component('star-rating', VueStarRating.default);