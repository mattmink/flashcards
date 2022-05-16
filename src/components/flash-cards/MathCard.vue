<template>
  <FlashCard class="math-card">
    <div class="number a">{{ a }}</div>
    <div class="operator" v-html="operator"></div>
    <div class="number b">{{ b }}</div>
    <div class="number answer">
      <span v-if="answer || answer === 0" class="answer-text">{{ answer }}</span>
      <span v-else>&nbsp;</span>
    </div>
  </FlashCard>
</template>

<script setup>
import { computed } from "vue";
import { operatorChars } from "../../constants";
import FlashCard from "./FlashCard.vue";

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

const operator = computed(() => {
  return operatorChars[props.operation] || "";
});
</script>

<style scoped>
.math-card {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: baseline;
  justify-content: unset;
  font-variant: common-ligatures tabular-nums;
}

.a,
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
}

.answer {
  border-top: 0.0625em solid currentColor;
  grid-column-start: 1;
  grid-column-end: span 2;
  grid-row-start: 3;
}

.answer-text {
  opacity: 0.3;
}
</style>
