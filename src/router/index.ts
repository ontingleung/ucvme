import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// ***************************************************************
//
// Sections with authentication guard have been commented for when the team is developing pages.
// -- Onting [19/03/2024]
//
// ***************************************************************

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePageView.vue')
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
      component: () => import('../views/AccountCreationView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/listing-creation',
      name: 'listingCreation',
      component: () => import('../views/ListingCreationView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/messaging',
      name: 'messaging',
      component: () => import('../views/MessagingView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/profile-edit',
      name: 'profileEdit',
      component: () => import('../views/ProfileEditView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/profile-search',
      name: 'profileSearch',
      component: () => import('../views/ProfileSearchView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/search-listings',
      name: 'searchListings',
      component: () => import('../views/SearchListingsView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      // When NO profile ID is given, redirect to profile search
      path: '/view-profile',
      name: 'noProfileProvided',
      component: () => import('../views/ProfileSearchView.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/view-profile/:profileID',
      name: 'viewProfile',
      component: () => import('../views/ViewProfileView.vue'),
    },
    {
      path: '/:profileID/create-job-listing',
      name: 'create-job',
      component: () => import('../views/ListingCreationView.vue'),
    },
    {
      // When NO profile ID is given, redirect to profile search
      path: '/view-listings',
      name: 'noListingProvided',
      component: () => import('../views/JobSearchView.vue')
    },
    {
      // When NO profile ID is given, redirect to profile search
      path: '/view-listings/:job_ID',
      name: 'View_Job',
      component: () => import('../views/JobView.vue')
    }
  ]
})


const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  })
};

router.beforeEach(async (to, from, next) => {
  if(to.matched.some((record) => record.meta.requireAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next('/')
    }
  } else {
    next()
  }
});

export default router
