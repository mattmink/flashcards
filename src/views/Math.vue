<template>
  <div>
    <h1>Math &ndash; Addition</h1>
    <div v-if="isRunning">
      <MathCard
        :a="currentEquation[0]"
        :b="currentEquation[1]"
        :answer="answer"
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
      <FcButton class="button" @click="startRound">Start!</FcButton>
    </div>
    <div v-else-if="isCompleted">
      <h2>You did it!</h2>
      <p>
        You completed {{ completed.length }} cards in
        <strong>{{ totalTimeFormatted }}</strong
        >.
      </p>
      <div class="end-buttons">
        <FcButton class="button" @click="startRound">Try again</FcButton>
        <FcButton class="button" @click="startTime = null">
          Pick new numbers
        </FcButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { operations } from "../constants";
import CustomCheckbox from "../components/CustomCheckbox.vue";
import useSpeechRecognition from "../composables/speechRecognition";
import MathCard from "../components/flash-cards/MathCard.vue";
import FcButton from "../components/FcButton.vue";

const zeroThroughTwelve = [...Array(13)].map((_, i) => i);
const oneThroughTwelve = zeroThroughTwelve.slice(1);

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
const answer = ref(null);

// COMPUTED DATA
const currentEquation = computed(() => equations.value[0]);

const isStarted = computed(() => Boolean(startTime.value));
const isCompleted = computed(() => isStarted.value && Boolean(totalTime.value));
const isRunning = computed(() => isStarted.value && !isCompleted.value);

const totalTimeFormatted = computed(
  () => `${Math.round(totalTime.value / 100) / 10} seconds`
);

const correctSolution = computed(() =>
  // TODO: Allow option to change operation (currently only allows add)
  !currentEquation.value
    ? null
    : operationFns[operations.add](...currentEquation.value)
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
  const isCorrect = !Number.isNaN(numeric) && numeric === correctSolution.value;

  // TODO: Allow option to keep going when answered incorrectly
  if (!isCorrect) {
    console.log(`Solution: ${correctSolution.value}\nI heard: "${solution}"`);
    return;
  }

  answer.value = "";
  completed.value.unshift([...equations.value.shift(), numeric, isCorrect]);
};

const recognition = useSpeechRecognition(
  // onResult
  (response) => {
    if (response === "help") {
      answer.value = correctSolution.value;
      return;
    }

    attemptEquation(response);

    if (equations.value.length === 0) {
      endRound();
      return;
    }
  },
  // onError
  () => {
    startTime.value = null;
    totalTime.value = null;
  }
);
</script>
