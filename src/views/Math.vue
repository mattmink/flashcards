<template>
  <div>
    <h1>
      Math<span v-if="selectedOperation"> &ndash; {{ operationTitle }}</span>
    </h1>
    <div v-if="isRunning">
      <MathCard :a="currentEquation[0]" :b="currentEquation[1]" :answer="answer" :operation="selectedOperation">
        <!-- <div v-if="answer || answer === 0" class="help-button-container"> -->
        <div class="help-button-container">
          <FcButton v-if="answer || answer === 0" size="small" class="help-button" @click="continueRound"
            >continue</FcButton
          >
          <FcButton v-else secondary size="small" class="help-button" @click="showHelp">help!</FcButton>
        </div>
      </MathCard>
      <div class="timeout-overlay" v-if="isTimeout">
        <div>
          <h2>Still there? Need help?</h2>
          <p>Just checking. No rush. You can take your time and keep thinking if you'd like.</p>
          <div>
            <FcButton @click="hideTimeoutOverlay(false)">I'm still thinking</FcButton>
            <FcButton secondary @click="hideTimeoutOverlay(true)">Yes! Please help!</FcButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!isStarted">
      <h2>What do you want to master?</h2>
      <div v-if="!selectedOperation">
        <FcButton v-for="(_, operation) in availableOperations" class="button" @click="selectedOperation = operation"
          >{{ operationTitles[operation] }}<br /><span
            class="operation-button-character"
            v-html="operatorChars[operation]"
        /></FcButton>
      </div>
      <div v-else>
        <h3>
          {{ operationTitle }}
          <a href="#" @click.prevent="selectedOperation = null" class="remove-operation-link">↩️ undo</a>
        </h3>
        <div class="working-on">
          <div v-for="number in oneThroughTwelve" :key="number">
            <CustomCheckbox :value="number" v-model="workingOn">{{ number }}</CustomCheckbox>
          </div>
        </div>
        <FcButton class="button" @click="startRound">Start!</FcButton>
      </div>
    </div>
    <div v-else-if="isCompleted">
      <h2>You did it!</h2>
      <p>
        You completed {{ completed.length }} cards in <strong>{{ totalTimeFormatted }}</strong
        >.
      </p>
      <div>
        <FcButton class="button" @click="startRound">Try again</FcButton>
        <FcButton class="button" @click="startTime = null"> Pick new numbers </FcButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { operations, operatorChars } from "../constants";
import CustomCheckbox from "../components/CustomCheckbox.vue";
import useSpeechRecognition from "../composables/speechRecognition";
import MathCard from "../components/flash-cards/MathCard.vue";
import FcButton from "../components/FcButton.vue";
import useAliases from "../composables/aliases";
import { shuffleArray } from "../utils/arrays";

const { getAliases, aliasesByType } = useAliases();

const helpTimeoutMS = 30000;
const zeroThroughTwelve = [...Array(13)].map((_, i) => i);
const oneThroughTwelve = zeroThroughTwelve.slice(1);

const operationFns = {
  [operations.add]: (a, b) => a + b,
  [operations.subtract]: (a, b) => a - b,
  [operations.multiply]: (a, b) => a * b,
  [operations.divide]: (a, b) => a / b,
};
const operationTitles = {
  [operations.add]: "Addition",
  [operations.subtract]: "Subtraction",
  [operations.multiply]: "Multiplication",
  [operations.divide]: "Division",
};

// TODO: This is temporary. I need to add more logic to the resetEquations function for subtraction and division
const availableOperations = Object.fromEntries(
  Object.entries(operations).filter(([operation]) => operation === operations.add || operation === operations.multiply)
);

let helpTimeout;

// REACTIVE DATA
const equations = ref([]);
const completed = ref([]);
const startTime = ref(null);
const totalTime = ref(null);
const workingOn = ref([]);
const answer = ref(null);
const selectedOperation = ref(null);
const isTimeout = ref(false);

// COMPUTED DATA
const currentEquation = computed(() => equations.value[0]);
const operationFn = computed(() => {
  if (!selectedOperation.value) {
    return () => {};
  }
  return operationFns[selectedOperation.value];
});
const operationTitle = computed(() => operationTitles[selectedOperation.value] || "");

const isStarted = computed(() => Boolean(startTime.value));
const isCompleted = computed(() => isStarted.value && Boolean(totalTime.value));
const isRunning = computed(() => isStarted.value && !isCompleted.value);

const totalTimeFormatted = computed(() => `${Math.round(totalTime.value / 100) / 10} seconds`);

const correctSolution = computed(() => (!currentEquation.value ? null : operationFn.value(...currentEquation.value)));

const numbersByAlias = computed(() => {
  const aliases = aliasesByType.number;

  if (!aliases) return {};

  return aliases.reduce((aliasMap, { value, alias }) => {
    aliasMap[alias] = value;
    return aliasMap;
  }, {});
});

// METHODS
const resetEquations = () => {
  const equationBaseNumbers = workingOn.value.length ? workingOn.value : oneThroughTwelve;

  equations.value = shuffleArray(equationBaseNumbers.flatMap((a) => zeroThroughTwelve.map((b) => [a, b])));
  completed.value = [];
};

const startHelptimer = () => {
  clearTimeout(helpTimeout);
  helpTimeout = setTimeout(showTimeoutOverlay, helpTimeoutMS);
};

const startRound = () => {
  recognition.start();
  resetEquations();
  startTime.value = Date.now();
  totalTime.value = null;
  startHelptimer();
};

const endRound = async () => {
  totalTime.value = Date.now() - startTime.value;
  recognition.stop();
};

const showHelp = () => {
  answer.value = correctSolution.value;
  if (recognition) {
    recognition.stop();
  }
};

const showTimeoutOverlay = () => {
  isTimeout.value = true;
  clearTimeout(helpTimeout);
  if (recognition) {
    recognition.stop();
  }
};

const hideTimeoutOverlay = (shouldShowHelp = true) => {
  isTimeout.value = false;
  if (shouldShowHelp) {
    showHelp();
  } else {
    recognition.start();
    startHelptimer();
  }
};

const attemptEquation = (solution) => {
  const numeric = Number(solution);
  const isNumberAlias = numbersByAlias.value[solution] === String(correctSolution.value);
  const isCorrect = numeric === correctSolution.value || isNumberAlias;

  // TODO: Allow option to keep going when answered incorrectly
  if (!isCorrect) {
    console.log(`Solution: ${correctSolution.value}\nI heard: "${solution}"`);
    return;
  }

  startHelptimer();
  answer.value = "";
  completed.value.unshift([...equations.value.shift(), numeric, isCorrect]);
};

const recognition = useSpeechRecognition(
  // onResult
  (response) => {
    if (response === "help") {
      showHelp();
      return;
    }

    attemptEquation(response);

    if (equations.value.length === 0) {
      endRound();
      return;
    }
  },
  // onError
  (error) => {
    showTimeoutOverlay();
  },
  // onEnd,
  () => {
    if (isRunning.value && !answer.value && answer.value !== 0) {
      showTimeoutOverlay();
    }
  }
);

const continueRound = () => {
  answer.value = "";
  if (equations.value.length > 1) {
    const equation = equations.value.shift();
    equations.value.splice(Math.floor(Math.random() * equations.value.length + 1), 0, equation);
  }

  recognition.start();
  startHelptimer();
};

onMounted(() => {
  getAliases("number");
});
</script>

<style scoped>
.working-on {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 320px;
  margin: 0.5rem auto 1rem;
  gap: 0.75rem;
  text-align: left;
}

.button {
  margin: 1rem;
}

.operation-button-character {
  font-size: 2rem;
}

.remove-operation-link {
  font-size: 0.75rem;
  text-decoration: none;
  margin-left: 0.5rem;
}

.help-button-container {
  position: absolute;
  bottom: 0;
  left: calc(100% + 0.5rem);
  font-size: 14px;
  text-align: left;
}

.help-button {
  margin: 0.5rem 0 0;
}

.timeout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0 0 0 / 95%);
  color: #fff;
  text-shadow: 0 1px 3px rgb(0 0 0 / 90%);
}
</style>
