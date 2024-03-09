<script setup>
import { RouterLink, useRoute } from 'vue-router';
</script>

<template>
    <header>
        <nav class="container">
            <div class="logo">
                <h1>UVCME</h1>
                <RouterLink to="/">
                </RouterLink>
            </div>
            <ul class="nav-routes">
                <!-- <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
                <RouterLink to="/signup">SignUp</RouterLink>
                <router-link to="/listing-creation">Listing Creation</router-link>
                <router-link to="/messaging">Messaging</router-link>
                <router-link to="/profile-edit">Profile Edit</router-link>
                <router-link to="/profile-search">Profile Search</router-link>
                <router-link to="/search-listings">Search Listings</router-link>
                <router-link to="/settings">Settings</router-link>
                <router-link to="/view-profile">View Profile</router-link> -->
            </ul>
        </nav>
    </header>
</template>

<style lang="scss" scoped>

header {
  // background-color: #315639;
  nav {
    display: flex;
    align-items: center;
    padding: 25px 30px;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      img {
        max-width: 80px;
      }

      h1 {
        font-size: 40px;
        text-decoration: none;
        color: #315639;
      }
    }

    .nav-routes {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      gap: 20px;
      list-style: none;

      a {
        text-decoration: none;
        color: inherit;
      }
    }
  }
}
</style>