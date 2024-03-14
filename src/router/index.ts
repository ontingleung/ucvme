import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: () => import('../views/HomePageView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/profilecreation/new',
      name: 'accountCreation',
      component: () => import('../views/AccountCreationView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/listing-creation',
      name: 'listingCreation',
      component: () => import('../views/ListingCreationView.vue')
    },
    {
      path: '/messaging',
      name: 'messaging',
      component: () => import('../views/MessagingView.vue')
    },
    {
      path: '/profile-edit',
      name: 'profileEdit',
      component: () => import('../views/ProfileEditView.vue')
    },
    {
      path: '/profile-search',
      name: 'profileSearch',
      component: () => import('../views/ProfileSearchView.vue')
    },
    {
      path: '/search-listings',
      name: 'searchListings',
      component: () => import('../views/SearchListingsView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/view-profile',
      name: 'viewProfile',
      component: () => import('../views/ViewProfileView.vue')
    }
  ]
})

export default router
