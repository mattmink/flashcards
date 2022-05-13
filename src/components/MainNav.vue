<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-brand">Flash Cards</RouterLink>
      <div class="main-nav" v-if="user">
        <div class="nav-item nav-user">Hello, {{ user.name }}!</div>
        <a class="nav-item" href="#" @click.prevent="logout">Log out</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import useAuth from "../composables/auth";

const { user, logout } = useAuth();
</script>

<style scoped>
header {
  background: #333;
  border-bottom: 2px solid #555;
  box-shadow: 0 0.25rem 0.5rem rgba(0 0 0 / 0.2);
  color: #fff;
  padding: 0 1rem;
}

nav,
.main-nav {
  display: flex;
  align-items: center;
}

nav {
  justify-content: space-between;
}

.nav-brand {
  color: #e2e7ff;
  text-decoration: none;
  font-weight: 900;
  opacity: 0.5;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.5rem;
}

.main-nav .nav-item {
  color: inherit;
  text-decoration: none;
  display: block;
  line-height: 1;
  padding: 0.75rem;
}

.nav-user {
  opacity: 0.5;
}
</style>
