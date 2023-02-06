<template>
  <FlashCard class="math-card">
    <div class="number a">{{ a }}</div>
    <div class="operator" v-html="operator"></div>
    <div class="number b">{{ b }}</div>
    <div class="number answer">
      <span v-if="answer || answer === 0" class="answer-text">{{ answer }}</span>
      <form v-else class="answer-input" @submit.prevent="attempt">
        <input type="text" maxlength="3" v-model="innerValue" @keydown="handleKeydown" ref="input" />
      </form>
    </div>
    <slot></slot>
  </FlashCard>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import useAuth from "../../composables/auth";
import { operatorChars } from "../../constants";
import FlashCard from "./FlashCard.vue";

const { user } = useAuth();

const props = defineProps({
  a: {
    type: [Number, String],
    required: true,
  },
  b: {
    type: [Number, String],
    required: true,
  },
  answer: {
    type: [Number, String],
    default: "",
  },
  operation: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['attempt']);

const innerValue = ref('');
const input = ref('input');

const operator = computed(() => {
  return operatorChars[props.operation] || "";
});

const equation = computed(() => `${props.a}${operator.value}${props.b}`);

const allowedKeys = new Set(['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'])

const handleKeydown = (event) => {
  const { key } = event;

  if (allowedKeys.has(key)) return;

  if (Number.isNaN(Number(key))) {
    event.preventDefault();
    return;
  }
};

const focusInput = () => {
  if (!input.value || typeof input.value === 'string') return;
  input.value.focus();
}

const clear = () => {
  innerValue.value = '';
  focusInput();
};

const attempt = () => emit('attempt', innerValue.value);

watch(equation, clear);

onMounted(() => {
  focusInput();
});

defineExpose({ clear });
</script>

<style scoped>
.math-card {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: baseline;
  justify-content: unset;
  font-variant: common-ligatures tabular-nums;
}

.a {
  grid-column-end: span 2;
}

.b {
  grid-column-start: 2;
}

.operator {
  grid-column-start: 1;
  grid-row-start: 2;
  text-align: left;
}

.number {
  font-size: 1.25em;
  line-height: 1;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.answer {
  border-top: 0.0625em solid currentColor;
  grid-column-start: 1;
  grid-column-end: span 2;
  grid-row-start: 3;
  min-height: 1.1em;
  position: relative;
}

.answer::before {
  display: block;
  content: "";
  height: 0.0625em;
  background-color: currentColor;
  width: calc(100% + 0.125em);
  left: -0.0625em;
  top: -0.0625em;
}

.answer-text,
.answer-input {
  min-height: 1.1em;
  display: block;
  width: 100%;
}

.answer-text {
  opacity: 0.3;
}

.answer-input {
  display: flex;
  align-items: center;
  outline: 1px solid #ddd;
  outline-offset: 0.0625em;
}

.answer-input input {
  font: inherit;
  display: block;
  width: 100%;
  text-align: right;
  height: 1em;
  outline: 0 none;
  border: 0 none;
}
</style>
