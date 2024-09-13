import { computed, ref } from "vue";
import { clearAuth, query, setAuth } from "../db";
import { fql } from "fauna";

const user = ref(JSON.parse(localStorage.getItem('user')) || null);

async function login(u) {
  if (!u) return;
  const { data: { secret } } = await query(fql`loginUser(${u.id})`)
  setAuth(secret);
  localStorage.setItem('user', JSON.stringify(u));
  user.value = u;
}

async function logout() {
  clearAuth();
  localStorage.removeItem('user');
  user.value = null;
}

export default function useAuth() {
  return { user: computed(() => user.value), login, logout };
}
