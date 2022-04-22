<template>
  <div class="card">
    <div class="number a">{{ a }}</div>
    <div class="operator" v-html="operator"></div>
    <div class="number b">{{ b }}</div>
    <div class="number answer">{{ answer }}<span v-if="answer === ''">&nbsp;</span></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { operatorChars } from "../constants";

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
.card {
  background: #fff;
  font-size: 16vmin;
  max-width: 5.625em;
  max-height: 5em;
  aspect-ratio: 3 / 5;
  box-shadow: 0 0.25em 0.5em -0.25em rgba(0 0 0 / 0.75);
  border-radius: .125em;
  display: grid;
  font-family: "Jost", sans-serif;
  grid-template-columns: 1fr max-content;
  align-items: baseline;
  font-variant: common-ligatures tabular-nums;
  padding: .25em;
}

.a, .b {
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
  border-top: .0625em solid currentColor;
  grid-column-start: 1;
  grid-column-end: span 2;
  grid-row-start: 3;
}
</style>
