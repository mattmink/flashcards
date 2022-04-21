<template>
  <h1>Flash Cards</h1>
  <div v-if="isRunning">
    <Card
      :a="currentEquation[0]"
      :b="currentEquation[1]"
      :operation="operations.add"
    />
  </div>
  <button v-else @click="startRound">Start!</button>
</template>

<script setup>
import { ref, computed } from "vue";
import Card from "./components/Card.vue";

const numbers = [...Array(145)].map((_, i) => i);

// eslint-disable-next-line no-undef
const recognition = new webkitSpeechRecognition();
// eslint-disable-next-line no-undef
const speechRecognitionList = new webkitSpeechGrammarList();

speechRecognitionList.addFromString(
  `#JSGF V1.0; grammar numbers; public <number> = ${numbers.join(" | ")} ;`,
  1
);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const operations = {
  add: "add",
  subtract: "subtract",
  multiply: "multiply",
  divide: "divide",
};
const operationFns = {
  [operations.add]: (a, b) => a + b,
  [operations.subtract]: (a, b) => a - b,
  [operations.multiply]: (a, b) => a * b,
  [operations.divide]: (a, b) => a / b,
};

// REACTIVE DATA
const equations = ref([]);
const completed = ref([]);
const startTime = ref(null);
const endTime = ref(null);

// COMPUTED DATA
const currentEquation = computed(() => equations.value[0]);

const isStarted = computed(() => Boolean(startTime.value));
const isComplete = computed(() => isStarted.value && Boolean(endTime.value));
const isRunning = computed(() => isStarted.value && !isComplete.value);

// METHODS
const resetEquations = () => {
  // TODO: Allow option to select which numbers are being practiced
  equations.value = numbers
    .slice(0, 13)
    .flatMap((a, i, arr) =>
      arr.map((b) => ({ value: [a, b], sort: Math.random() }))
    )
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  completed.value = [];
};

const startRound = () => {
  recognition.start();
  resetEquations();
  startTime.value = Date.now();
  endTime.value = null;
};

const attemptEquation = (solution) => {
  if (Number.isNaN(solution)) return;

  const isCorrect =
    // TODO: Allow option to change operation (currently only allows add)
    solution === operationFns[operations.add](...currentEquation.value);

  // TODO: Allow option to keep going when answered incorrectly
  if (!isCorrect) return;

  completed.value.unshift([...equations.value.shift(), solution, isCorrect]);
};

recognition.onresult = (event) => {
  console.log(event);
  const [{ transcript }] = event.results[event.results.length - 1];
  attemptEquation(Number(transcript));
  if (equations.value.length === 0) {
    endTime.value = Date.now();
    recognition.stop();
    return;
  }
};

recognition.onnomatch = function (event) {
  console.error(event);
};

recognition.onerror = function (event) {
  console.error(event);
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  text-align: center;
  background: #ddd;
  font-family: sans-serif;
}
.card {
  margin: auto;
}
</style>
