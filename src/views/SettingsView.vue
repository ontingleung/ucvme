<template>
  <div class="settings-container">
    <div class="settings-card">
      <h1 class="settings-header">
        Account Settings
      </h1>
      <form class="settings-form" @submit.prevent="updateSettings">

        <div>
          <label class="block text-gray-700">Update Email</label>
          <input
            class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type="email" :placeholder="user_email_current" v-model="user_email_new" @input="show_email_verify = true">
        </div>
        <div v-if="show_email_verify">
          <label class="block text-gray-700">Confirm email</label>
          <input
            class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type="text" placeholder="Repeat Email" v-model="email_verify">
        </div>
        <div>
          <label class="block text-gray-700">New Password</label>
          <input
            class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type="password" placeholder="Password" v-model="new_pwd" @input="show_password_verify = true">
        </div>
        <div v-if="show_password_verify">
          <label class="block text-gray-700">Confirm Password</label>
          <input
            class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type="text" placeholder="Repeat Password" v-model="password_verify">
        </div>

        <button class="py-4 px-5 mt-5 w-full bg-green-500 rounded-full hover:bg-green-300 text-white font-bold  border-b-4 border-green-700 hover:border-green-500 " type="submit">
          Update
        </button>
        <button class="py-4 px-5 mt-5 w-full bg-red-500 rounded-full hover:bg-red-300 text-white font-bold  border-b-4 border-red-700 hover:border-red-500 " @click="del_account">
          Delete Account
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword, updateEmail, deleteUser  } from 'firebase/auth';
import router from '@/router';

const user_email_new = ref('');
const user_email_current = ref('');
const new_pwd = ref('');


const show_email_verify = ref(false);
const show_password_verify = ref(false);
const email_verify = ref('');
const password_verify = ref('');

onMounted(() => {
  onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
      const userRef = doc(db, "users", authUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        user_email_current.value = userSnap.data().email;
      } else {
        console.error("No such document!");
      }
    } else {
      console.warn("No user is signed in.");
    }
  });
});

async function updateSettings() {
  const authUser = auth.currentUser;
  if (authUser) {
    var ok_to_proceed = true;

    const userRef = doc(db, "users", authUser.uid);

    if (user_email_new.value == '' && new_pwd.value == '') {
      alert("No changes made");
    }
    // Check Email
    else if (user_email_new.value != email_verify.value && user_email_new.value != '') {
      alert("Please make sure that you entered your new email correctly");
      console.warn(user_email_new.value + " != " + email_verify.value)
    }
    // Check Password
    else if (new_pwd.value != password_verify.value && new_pwd.value != '') {
      alert("Please make sure that you entered your new password correctly");
      console.warn(new_pwd.value + " != " + password_verify.value)
    }

    // DOUBLE CHECK WITH USER
    else if (confirm("Are you sure you wish to update your credentials?")) {
      // Update email
      if (user_email_new.value != '') {
        await setDoc(userRef, {
          email: user_email_new.value
        }, { merge: true }).then(() => {
          console.debug('Users doc updated successfully');
        }).catch((error) => {
          console.error("Error updating document: ", error);
        });

        updateEmail(authUser, user_email_new.value).then(() => {
          // Email updated!
          console.debug("Email Updated successfully");
        }).catch((error) => {
          // An error occurred
          console.error("Error updating email: ", error);
        });
      }

      if (new_pwd.value != '') {
        updatePassword(authUser, new_pwd.value).then(() => {
          // Update successful.
          console.debug("Password Updated successfully");
        }).catch((error) => {
          console.error("Error updating Password: ", error);
        });
      }
    }
  }
}

async function del_account() {
  const authUser = auth.currentUser;
  if (confirm("Are you SURE you want to delete the account for " + authUser.email + "?")) 
  {
    if (confirm("Once you delete the account for " + authUser.email + ", it will be impossible to recover this account... continue?")) 
    {
      deleteUser(authUser).then(() => {
        alert("Account deleted successfully");
        router.push("/")
      }).catch((error) => {
        console.error(error);
      });
    }
  }
}


function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    user.value.profilePicture = URL.createObjectURL(file);
  }
}
</script>


<style scoped>
.settings-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f7f6;
}

.settings-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.settings-header {
  color: #047857;
  /* Emerald color */
  text-align: center;
  margin-bottom: 2rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  color: #1f2937;
  /* Gray-800 */
  margin-bottom: 0.5rem;
}

.input-file {
  border: 2px solid #d1fae5;
  /* Light emerald */
  border-radius: 0.375rem;
  /* 6px */
  padding: 0.5rem;
}

.input-file::file-selector-button {
  padding: 0.5rem;
  border: none;
  background-color: #10b981;
  color: white;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
}

.image-preview {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.image-thumbnail {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.submit-button {
  padding: 0.75rem;
  background-color: #059669;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #047857;
}

.del-button {
  padding: 0.75rem;
  background-color: #960505;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.del-button:hover {
  background-color: #780404;
}

@media (max-width: 640px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-card {
    padding: 1.5rem;
  }
}
</style>