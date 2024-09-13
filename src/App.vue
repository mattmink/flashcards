<template>
  <LoadingOverlay v-if="isLoading || isInitialLoading">
    <template #title v-if="isInitialLoading">
      <div class="loading-title">Flash Cards</div>
    </template>
  </LoadingOverlay>

  <template v-else>
    <MainNav />
    <LoginForm v-if="!user" />
    <div v-else class="content">
      <RouterView />
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import useAuth from "./composables/auth";
import useLoading from "./composables/loading";
import LoginForm from "./components/LoginForm.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import MainNav from "./components/MainNav.vue";

const { user } = useAuth();
const { isLoading } = useLoading();
const isInitialLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isInitialLoading.value = false
  }, 3000)
});
</script>

<style>
@import "./assets/base.css";
</style>

<style scoped>
.loading-title {
  color: #e2e7ff;
  opacity: 0.5;
  font-size: 3rem;
  font-weight: 900;
}

.content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
