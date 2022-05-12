import { ref } from "vue";
import { gql } from "graphql-request";
import { request, setToken } from "../db";

const user = ref(null);

async function getCurrentUser() {
  try {
    const { currentUser } = await request(gql`
      query {
        currentUser {
          name
          _id
        }
      }
    `);
    user.value = currentUser;
  } catch (error) {
    user.value = null;
  }
}

async function login(name, password) {
  if (!name || !password) return;

  try {
    const { loginUser: token } = await request(gql`
      mutation {
        loginUser(input: {
          name: "${name}",
          password: "${password}"
        })
      }
    `);
    setToken(token);
    await getCurrentUser();
  } catch (error) {
    setToken();
    throw new Error(error);
  }
}

async function register(name, password) {
  if (!name || !password) return null;

  const { createUser: userDetails } = await request(gql`
    mutation {
      createUser(input: {
        name: "${name}",
        password: "${password}"
      }) { name }
    }
  `);

  return userDetails;
}

async function logout() {
  await request(
    gql`
      mutation {
        logoutUser
      }
    `
  );
  setToken();
  user.value = null;
}

function withOwner(obj = {}) {
  return {
    ...obj,
    owner: {
      connect: user.value._id,
    },
  };
}

export default function useAuth() {
  return { user, getCurrentUser, register, login, logout, withOwner };
}
