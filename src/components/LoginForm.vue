<template>
  <Toast :show="!!toastMessage" :type="toastMessage?.type">{{ toastMessage?.message }}</Toast>
  <div class="login-form">
    <h1>Who is ready to practice?</h1>
    <div v-for="user in users" :key="user._id">
      <FcButton class="button button-large" type="button" @click="handleUserClick(user)">
        {{ user.name }}
      </FcButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { fql } from "fauna";
import useAuth from "../composables/auth";
import { query } from "../db";
import FcButton from "./FcButton.vue";
import Toast from "./Toast.vue";
import useLoading from "../composables/loading";

const users = ref([]);
const toastMessage = ref(null);
const { login } = useAuth();
const { isLoading } = useLoading();

const showToast = (message, type, clearDelay = 10000) => {
  toastMessage.value = { message, type };
  setTimeout(() => {
    toastMessage.value = null;
  }, clearDelay);
};

const handleUserClick = async (user) => {
  toastMessage.value = null;
  isLoading.value = true;
  try {
    await Promise.all([
      new Promise((resolve) => {
        setTimeout(resolve, 2000)
      }),
      login(user)
    ])
  } catch (error) {
    showToast(`Oops! I tried to log in as ${user.name}, but something went wrong. Try again. If it still doesn't work, go tell Dad.`, 'error')
  }
  isLoading.value = false;
}

query(fql`User.all()`).then(({ data: { data } }) => {
  users.value = data;
})
</script>

<style scoped>
.button {
  margin: 1rem;
  width: 100%;
  max-width: 300px;
}

.login-form {
  padding: 2rem 0;
}
</style>
