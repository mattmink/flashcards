<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-brand">Flash Cards</RouterLink>
      <div class="main-nav" v-if="user">
        <RouterLink to="/" class="nav-item">Math</RouterLink>
        <RouterLink to="/speech-training" class="nav-item"
          >Speech Training</RouterLink
        >
      </div>
      <div class="nav-user" v-if="user">
        <div class="nav-item nav-item-user">Hello, {{ user.name }}!</div>
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
  font-size: 0.75rem;
}

nav,
.main-nav,
.nav-user {
  display: flex;
  align-items: center;
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

.nav-user {
  margin-left: auto;
}

.nav-item {
  color: inherit;
  text-decoration: none;
  display: block;
  line-height: 1;
  padding: 0.33rem;
  transition: background-color ease-in 0.2s;
}

.main-nav .nav-item {
  margin-left: 1rem;
  border-radius: 0.125rem;
}

.nav-item.router-link-active {
  background-color: #fff;
  color: #333;
  cursor: default;
}

@media (hover: hover) {
  .main-nav .nav-item:not(.router-link-active):hover {
    background-color: #555;
  }
}

.nav-item-user {
  opacity: 0.5;
}
</style>
