<template>
    <div class="toaster">
        <transition name="toast">
            <div class="toast" :class="`toast-${type}`" v-if="show"><slot></slot></div>
        </transition>
    </div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'info'
    },
    show: {
        type: Boolean,
        default: false,
    },
});
</script>

<style>
.toaster {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    overflow: visible;
    z-index: 100;
}

.toast {
    padding: 0.5rem;
    border-radius: 0 0 4px 4px;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgb(0 0 0 / 30%);
    border: 2px solid rgba(255 255 255 / 30%);
    border-top: 0 none;
}

.toast-info {
    background: #33e8ff;
    color: #333;
}

.toast-success {
    background: #19db53;
    color: #333;
}

.toast-error {
    background: #cc3724;
    color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(-100%);
}
</style>