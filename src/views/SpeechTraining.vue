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
import { shuffleArray } from "../utils/arrays";

const numbers = [...Array(21)].map((_, i) => i);

const isStarted = ref(false);
const isComplete = ref(false);
const isLoading = ref(false);
const { getAliases, aliasesByType, createAlias } = useAliases();
const trainingList = ref(shuffleArray([...numbers, ...numbers]));

const currentNumber = computed(() => trainingList.value[0]);
const numbersByAlias = computed(() => {
  const aliases = aliasesByType.number;

  if (!aliases) return {};

  return aliases.reduce((aliasMap, { value, alias }) => {
    aliasMap[alias] = value;
    return aliasMap;
  }, {});
});

function numberToWords(num) {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const hundreds = ["", "hundred"];

    if (num === 0) return "zero";
    if (num < 10) return ones[num];
    if (num > 10 && num < 20) return teens[num - 10];
    if (num >= 10 && num < 100) return tens[Math.floor(num / 10)] + (num % 10 > 0 ? "-" + ones[num % 10] : "");
    if (num >= 100 && num < 1000) {
        return ones[Math.floor(num / 100)] + " hundred" + (num % 100 > 0 ? " and " + numberToWords(num % 100) : "");
    }
}

const recognition = useSpeechRecognition((result) => {
  const hasAlias = Boolean(numbersByAlias.value[result]);
  const isCorrect = result === numberToWords(currentNumber.value);

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
