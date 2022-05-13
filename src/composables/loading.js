import { ref, watch } from "vue";

const isLoading = ref(false);
const loadingMessage = ref("");

const setLoading = (message) => {
  loadingMessage.value = message;
  isLoading.value = true;
};

const clearLoading = () => {
  loadingMessage.value = "";
  isLoading.value = false;
};

watch(isLoading, (isLoading) => {
  if (!isLoading) {
    loadingMessage.value = "";
  }
});

export default function useLoading() {
  return { isLoading, setLoading, clearLoading };
}
