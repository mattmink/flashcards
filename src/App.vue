<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-brand">Flash Cards</RouterLink>
    </nav>
  </header>
  {{user}}
  <LoginForm v-if="!user" />
  <RouterView v-else />
</template>


<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import useAuth from "./composables/auth";
import LoginForm from "./components/LoginForm.vue";

const { user, getCurrentUser } = useAuth();
const isInitialLoading = ref(true);

getCurrentUser().finally(() => {
  isInitialLoading.value = false;
});
</script>

<style>
@import "./assets/base.css";
</style>