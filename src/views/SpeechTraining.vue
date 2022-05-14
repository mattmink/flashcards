<template>
  <div class="view">
    <div class="page">
      <h1>Train the Speech Recognition</h1>
      <div v-if="isStarted">
        <p>Say the number that appears on the screen.</p>
        <div class="current-number">
          {{ currentNumber }}
        </div>
      </div>
      <div v-else>
        <p>
          Sometimes the program might not hear your correctly. When you say
          "eight", it might hear "wait". This can be frustrating if you actually
          got the answer right.
        </p>
        <p>
          You can help the program to "understand" you better by training. Just
          say the numbers that appear on the screen. Ready?
        </p>
        <button class="button button-large" @click="startTraining">
          Start Speech Training
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import useSpeechRecognition from "../composables/speechRecognition";

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const numbers = [...Array(21)].map((_, i) => i);

const isStarted = ref(false);
const isComplete = ref(false);
const aliases = ref([]);
const trainingList = ref(shuffleArray([...numbers, ...numbers, ...numbers]));

const currentNumber = computed(() => trainingList.value[0]);
const numbersByAlias = computed(() => aliases.value.reduce((aliasMap, { value, alias }) => {
  aliasMap[alias] = value;
  return aliasMap;
}, {}))

const recognition = useSpeechRecognition((result) => {
  if (result === String(currentNumber.value) || numbersByAlias.value[result]) return;

  // TODO: save the alias here
  aliases.value.push({ value: currentNumber.value, alias: result });

  if (trainingList.length === 1) endTraining();

  trainingList.value.shift();
});

const startTraining = () => {
  isStarted.value = true;
  recognition.start();
};

const endTraining = async () => {
  isComplete.value = true;
  recognition.stop();
};
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
}

.button {
  margin-top: 1rem;
}
</style>
