<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  margin: auto;
  background: #fff;
  font-size: 14vmin;
  max-width: 5.625em;
  max-height: 5em;
  aspect-ratio: 3 / 5;
  box-shadow: 0 0.25em 0.5em -0.25em rgba(0 0 0 / 0.75);
  border-radius: 0.125em;
  display: flex;
  font-family: "Jost", sans-serif;
  align-items: center;
  justify-content: center;
  padding: 0.25em;
}
</style>
