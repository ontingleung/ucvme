<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref(null);
const menuOpen = ref(false);
let uid = ref("");


onMounted(() => {
  onAuthStateChanged(auth, (authUser) => {
    user.value = authUser;
    uid = user.value.uid;
  });
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  console.log('Menu Open:', menuOpen.value);
}

async function logout() {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
}
</script>

<template>
  <header class="shadow">
    <nav class="container">
      <div class="logo">
        <RouterLink to="/homePage">
          <h1>UVCME</h1>
        </RouterLink>
      </div>
      <div class="navigation">
        <ul class="nav-routes mr-2">
          <li v-if="!user">
            <RouterLink to="/signup">SignUp</RouterLink>
          </li>
          <li v-if="!user">
            <RouterLink to="/login">Login</RouterLink>
          </li>
        </ul>
        <div class="menu-container">
          <button @click="toggleMenu" class="burger">☰</button>
          <div class="menu rounded-lg" v-show="menuOpen">
            <ul>
              <li class="menu-heading" v-if="user">Work</li>
              <li v-if="user">
                <RouterLink :to="`/${uid}/create-job-listing`" @click.native="toggleMenu">Create a Job</RouterLink>
              </li>
              <li v-if="user">
                <RouterLink :to="`/view-listings`" @click.native="toggleMenu">Jobs</RouterLink>
              </li>
              <li class="menu-heading">Profile</li>
              <li>
                <RouterLink :to="`/view-profile/${uid}`" @click.native="toggleMenu">My Profile</RouterLink>
              </li>
              <li>
                <RouterLink to="/view-profile" @click.native="toggleMenu">Profile Search</RouterLink>
              </li>
              <li>
                <RouterLink to="/profile-edit" @click.native="toggleMenu">Profile Edit</RouterLink>
              </li>
              <li>
                <RouterLink to="/settings" @click.native="toggleMenu">Settings</RouterLink>
              </li>
              <li v-if="user">
                <button class="logout-btn" @click="logout" @click.native="toggleMenu">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>


<style lang="scss" scoped>
header {
  nav {
    display: flex;
    align-items: center;
    padding: 25px 30px;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      h1 {
        font-size: 40px;
        text-decoration: none;
        color: #315639;
      }
    }

    .navigation {
      display: flex;
      align-items: center;
      position: relative;
      gap: 20px;
      margin-left: auto;

      .nav-routes {
        display: flex;
        list-style: none;

        a {
          text-decoration: none;
          color: inherit;
          padding: 10px;
        }
      }

      .menu-container {
        position: relative;

        .burger {
          background: none;
          border: none;
          font-size: 30px;
          cursor: pointer;
        }

        .menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: 200px;
          background-color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: opacity 0.3s ease;
          z-index: 100;

          ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;

            .menu-heading {
              padding: 8px 20px;
              font-weight: bold;
              color: #315639;
              background-color: #f0f0f0;
            }

            li {
              width: 100%;

              a {
                display: block;
                padding: 10px 20px;
                text-decoration: none;
                color: black;

                &:hover {
                  background-color: #eee;
                }

              }
            }
          }
        }
      }
    }
  }
}

.logout-btn {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.logout-btn:hover {
  background-color: #f5c6cb;
  border-color: #e0a8ad;
}
</style>
