import { GraphQLClient } from "graphql-request";
import { getCookie, setCookie } from "./utils/cookies";

const url =
  import.meta.env.VITE_FAUNA_URL || "https://graphql.us.fauna.com/graphql";
const graphQLClient = new GraphQLClient(url);
const guestKey = import.meta.env.VITE_FAUNA_GUEST_KEY;
const FAUNA_TOKEN_COOKIE = "faunaTokenFlashCards";

// TODO: Handle token expiration (TTL)
// TODO: Investigate more secure approach for persisting session than cookies
export function setToken(token = guestKey) {
  graphQLClient.setHeaders({
    authorization: `Bearer ${token}`,
  });
  setCookie(FAUNA_TOKEN_COOKIE, token);
}

setToken(getCookie(FAUNA_TOKEN_COOKIE));

function isValidQueryPart(queryPart) {
  return queryPart !== undefined && typeof queryPart !== "function";
}

export function makeGQLObject(queryPart) {
  if (!isValidQueryPart(queryPart)) {
    return "";
  }

  if (
    queryPart === null ||
    typeof queryPart === "number" ||
    typeof queryPart === "boolean"
  ) {
    return queryPart;
  }

  if (Array.isArray(queryPart)) {
    return `[${queryPart.map(makeGQLObject).join(",")}]`;
  }

  if (typeof queryPart === "object" && queryPart !== null) {
    return `{${Object.keys(queryPart)
      .filter((key) => isValidQueryPart(queryPart[key]))
      .map((key) => `${key}:${makeGQLObject(queryPart[key])}`)
      .join(",")}}`;
  }

  return `"${queryPart}"`;
}

export const request = (query) => graphQLClient.request(query);

export const query = (query) => request(`query { ${query} }`);

export const mutation = (query) => request(`mutation { ${query} }`);
