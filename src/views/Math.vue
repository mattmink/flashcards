<template>
  <h1>Math &ndash; Addition</h1>
  <div v-if="isRunning">
    <FlashCard
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
import { operations } from "../constants";
import FlashCard from "../components/FlashCard.vue";
import CustomCheckbox from "../components/CustomCheckbox.vue";

const zeroThroughTwelve = [...Array(13)].map((_, i) => i);
const oneThroughTwelve = zeroThroughTwelve.slice(1);

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

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
