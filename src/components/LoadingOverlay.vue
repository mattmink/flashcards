<template>
  <div class="loading-overlay">
    <div>
      <slot name="title"></slot>
      <div>
        <LoadingSpinner class="loading-overlay--spinner" />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from "./LoadingSpinner.vue";
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;

}

.loading-overlay--spinner {
  font-size: 3rem;
}
</style>