import { gql } from "graphql-request";
import { reactive } from "vue";
import { makeGQLObject, mutation, query } from "../db";
import useAuth from "./auth";

const { withOwner } = useAuth();
const aliasesByType = reactive({
  number: [],
});

const getAliases = async (type) => {
  if (!aliasesByType[type]) return undefined;

  try {
    const {
      speechAliasesByType: { data },
    } = await query(
      gql`speechAliasesByType(type:"${type}") { data { value, alias, type }}`
    );
    aliasesByType[type] = data;
  } catch (error) {
    // fail silently when getting aliases. this is not core functionality.
  }

  return aliasesByType[type];
};

const createAlias = async ({ value, alias, type }) => {
  const aliasType = aliasesByType[type];

  if (
    !aliasType ||
    aliasType.find((speechAlias) => speechAlias.alias === alias)
  ) {
    return;
  }

  aliasType.push({ value, alias, type });

  try {
    const newAlias = makeGQLObject(withOwner({ value, alias, type }));
    await mutation(
      gql`createSpeechAlias(data:${newAlias}) { value, alias, type }`
    );
  } catch (error) {}
};

export default function useAliases() {
  return { aliasesByType, getAliases, createAlias };
}