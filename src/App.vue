<template>
  <h1>Flash Cards</h1>
  <div v-if="isRunning">
    <Card
      :a="currentEquation[0]"
      :b="currentEquation[1]"
      :operation="operations.add"
    />
  </div>
  <div v-else-if="!isStarted">
    <h2>What do you want to master?</h2>
    <div class="working-on">
      <div v-for="number in oneThroughTwelve" :key="number">
        <CustomCheckbox :value="number" v-model="workingOn">{{
          number
        }}</CustomCheckbox>
      </div>
    </div>
    <button class="button" @click="startRound">Start!</button>
  </div>
  <div v-else-if="isCompleted">
    <h2>You did it!</h2>
    <p>
      You completed {{ completed.length }} cards in
      <strong>{{ totalTimeFormatted }}</strong
      >.
    </p>
    <div class="end-buttons">
      <button class="button" @click="startRound">Try again</button>
      <button class="button" @click="startTime = null">Pick new numbers</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Card from "./components/Card.vue";
import CustomCheckbox from "./components/CustomCheckbox.vue";

const numbers = [...Array(145)].map((_, i) => i);
const zeroThroughTwelve = numbers.slice(0, 13);
const oneThroughTwelve = zeroThroughTwelve.slice(1);

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
const totalTime = ref(null);
const workingOn = ref([]);

// COMPUTED DATA
const currentEquation = computed(() => equations.value[0]);

const isStarted = computed(() => Boolean(startTime.value));
const isCompleted = computed(() => isStarted.value && Boolean(totalTime.value));
const isRunning = computed(() => isStarted.value && !isCompleted.value);

const totalTimeFormatted = computed(
  () => `${Math.round(totalTime.value / 100) / 10} seconds`
);

// METHODS
const resetEquations = () => {
  const equationBaseNumbers = workingOn.value.length
    ? workingOn.value
    : oneThroughTwelve;

  equations.value = equationBaseNumbers
    .flatMap((a) =>
      zeroThroughTwelve.map((b) => ({ value: [a, b], sort: Math.random() }))
    )
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  completed.value = [];
};

const startRound = () => {
  recognition.start();
  resetEquations();
  startTime.value = Date.now();
  totalTime.value = null;
};

const endRound = async () => {
  recognition.stop();
  totalTime.value = Date.now() - startTime.value;
};

const attemptEquation = (solution) => {
  const numeric = Number(solution);

  // TODO: Allow option to change operation (currently only allows add)
  const correctSolution = operationFns[operations.add](
    ...currentEquation.value
  );
  const isCorrect = !Number.isNaN(numeric) && numeric === correctSolution;

  // TODO: Allow option to keep going when answered incorrectly
  if (!isCorrect) {
    console.log(`Solution: ${correctSolution}\nI heard: "${solution}"`);
    return;
  }

  completed.value.unshift([...equations.value.shift(), numeric, isCorrect]);
};

recognition.onresult = (event) => {
  const [{ transcript }] = event.results[event.resultIndex];

  attemptEquation(transcript.trim());

  if (equations.value.length === 0) {
    endRound();
    return;
  }
};

recognition.onerror = function (event) {
  startTime.value = null;
  totalTime.value = null;
  console.error(event);
};
</script>

<style>
* {
  box-sizing: border-box;
}

body,
html {
  height: 100%;
  font-size: 24px;
  font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue",
    Ubuntu, sans-serif;
  line-height: 1.6;
  padding: 0;
  margin: 0;
}

body {
  text-align: center;
  background: #ddd;
  background-image: radial-gradient(circle at 50% 20%, #eef2f3, #8e9eab);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

h1 {
  margin-top: 0;
}

.card {
  margin: auto;
}

.working-on {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 320px;
  margin: 0 auto 1rem;
  gap: 0.75rem;
  text-align: left;
}

.button {
  appearance: button;
  backface-visibility: hidden;
  background-color: #405cf5;
  border-radius: 6px;
  border-width: 0;
  box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset,
    rgba(50, 50, 93, 0.1) 0 2px 5px 0, rgba(0, 0, 0, 0.07) 0 1px 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 100%;
  height: 44px;
  line-height: 1.15;
  margin: 12px 0 0;
  outline: none;
  overflow: hidden;
  padding: 0 25px;
  position: relative;
  text-align: center;
  text-transform: none;
  transform: translateZ(0);
  transition: all 0.2s, box-shadow 0.08s ease-in;
  user-select: none;
  touch-action: manipulation;
}

@media (hover: hover) {
  .button:hover {
    background-color: #5971f7;
  }
}

.button:disabled {
  cursor: default;
}

.button:focus {
  box-shadow: rgba(50, 50, 93, 0.1) 0 0 0 1px inset,
    rgba(50, 50, 93, 0.2) 0 6px 15px 0, rgba(0, 0, 0, 0.1) 0 2px 2px 0,
    rgba(50, 151, 211, 0.3) 0 0 0 4px;
}

.end-buttons .button {
  margin: 0 0.5rem;
}
</style>
