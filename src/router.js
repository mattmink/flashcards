import { createRouter, createWebHashHistory } from "vue-router";
import Math from "./views/Math.vue";

const routes = [
  { path: "/", component: Math },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
