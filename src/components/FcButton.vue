<template>
  <button :class="['button', { [`button-${size}`]: size !== 'medium', secondary }]" :disabled="disabled || loading">
    <span class="button--content">
      <slot></slot>
    </span>
    <span class="button--loading" v-if="loading">
      <LoadingSpinner color="white" />
    </span>
  </button>
</template>

<script setup>
import LoadingSpinner from "./LoadingSpinner.vue";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  secondary: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.button {
  appearance: button;
  backface-visibility: hidden;
  background-color: #405cf5;
  border-radius: 6px;
  border-width: 0;
  box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.1) 0 2px 5px 0, rgba(0, 0, 0, 0.07) 0 1px 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 100%;
  min-height: 2rem;
  line-height: 1.15;
  outline: none;
  overflow: hidden;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: center;
  text-transform: none;
  transform: translateZ(0);
  transition: all 0.2s, box-shadow 0.08s ease-in;
  user-select: none;
  touch-action: manipulation;
}

.button.secondary {
  background-color: #33343d;
}

@media (hover: hover) {
  .button:hover {
    background-color: #5971f7;
  }

  .button.secondary:hover {
    background-color: #484951;
  }
}

.button:disabled {
  cursor: default;
  background-color: #6679e2;
}

.button.secondary:disabled {
  background-color: #7c7d87;
}

.button:disabled .button--content {
  opacity: 0.5;
}

.button:focus {
  box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset, rgba(50, 50, 93, 0.2) 0 6px 15px 0, rgba(0, 0, 0, 0.1) 0 2px 2px 0,
    rgba(50, 151, 211, 0.3) 0 0 0 4px;
}

.button-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.button-large {
  padding: 0.75rem;
  font-size: 1.25rem;
  height: auto;
}

.button--loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #405cf588;
}
</style>
