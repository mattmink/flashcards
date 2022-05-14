import { createRouter, createWebHashHistory } from "vue-router";
import Math from "./views/Math.vue";
import SpeechTraining from "./views/SpeechTraining.vue";

const routes = [
  { path: "/", component: Math },
  { path: "/speech-training", component: SpeechTraining },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
