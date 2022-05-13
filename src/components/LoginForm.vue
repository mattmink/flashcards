<template>
  <div class="login-form">
    <h1>Who is ready to practice?</h1>
    <div v-for="user in users" :key="user._id">
      <button class="button" type="button" @click="handleClick(user)">
        {{ user.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useAuth from "../composables/auth";
import { query } from "../db";

const users = ref([]);
const auth = useAuth();

const handleClick = ({ name }) => {
  auth.login(name, "123");
};

query("allUsers { data { _id, name, role } }").then(
  ({ allUsers: { data } }) => {
    users.value = data;
  }
);
</script>

<style scoped>
.button {
  margin: 1rem;
  /* display: block; */
  width: 100%;
  padding: .75rem;
  font-size: 1.25rem;
  height: auto;
  max-width: 300px;
}
.login-form {
  padding: 2rem 0;
}
</style>
