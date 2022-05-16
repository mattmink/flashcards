<template>
  <div class="view">
    <div class="page">
      <h1>Train the Speech Recognition</h1>
      <div v-if="isStarted">
        <p>Say the number that appears on the screen.</p>
        <FlashCard class="current-number">
          {{ currentNumber }}
        </FlashCard>
      </div>
      <div v-else>
        <p>
          Sometimes the program might not hear your correctly. When you say
          "eight", it might hear "wait". This can be frustrating if you actually
          got the answer right.
        </p>
        <p>
          You can help the program to "understand" you better by training it.
          Just say the numbers that appear on the screen. Ready?
        </p>
        <FcButton size="large" :loading="isLoading" @click="startTraining">
          Start Speech Training
        </FcButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import useAliases from "../composables/aliases";
import useSpeechRecognition from "../composables/speechRecognition";
import FcButton from "../components/FcButton.vue";
import FlashCard from "../components/flash-cards/FlashCard.vue";

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
const isLoading = ref(false);
const { getAliases, aliasesByType, createAlias } = useAliases();
const trainingList = ref(shuffleArray([...numbers, ...numbers, ...numbers]));

const currentNumber = computed(() => trainingList.value[0]);
const numbersByAlias = computed(() => {
  const aliases = aliasesByType.number;

  if (!aliases) return {};

  return aliases.reduce((aliasMap, { value, alias }) => {
    aliasMap[alias] = value;
    return aliasMap;
  }, {});
});

const recognition = useSpeechRecognition((result) => {
  const hasAlias = Boolean(numbersByAlias.value[result]);
  const isCorrect = result === String(currentNumber.value);

  if (!hasAlias && !isCorrect) {
    createAlias({
      value: String(currentNumber.value),
      alias: result,
      type: "number",
    });
  }

  if (trainingList.length === 1) endTraining();

  trainingList.value.shift();
});

const startTraining = async () => {
  isLoading.value = true;
  await getAliases("number");
  isStarted.value = true;
  recognition.start();
  isLoading.value = false;
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

.current-number {
  margin-top: 1rem;
  font-size: 10vmin;
}
</style>
