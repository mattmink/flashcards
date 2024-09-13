import { reactive } from "vue";
import { query } from "../db";
import { fql } from "fauna";
import useAuth from "./auth";

const aliasesByType = reactive({
  number: [],
});

const getAliases = async (type) => {
  if (!aliasesByType[type] || aliasesByType[type].length) return aliasesByType[type];
  try {
    const { data: { data } } = await query(fql`SpeechAlias.all().where(SpeechAlias => SpeechAlias.type == ${type}){ value, alias, type }`);
    aliasesByType[type] = data;
  } catch (error) {
    // fail silently when getting aliases. this is not core functionality.
  }

  return aliasesByType[type];
};

const createAlias = async ({ value, alias, type }) => {
  const aliasType = aliasesByType[type];
  const { user } = useAuth();

  if (
    !aliasType ||
    aliasType.find((speechAlias) => speechAlias.alias === alias)
  ) {
    return;
  }

  aliasType.push({ value, alias, type });
  console.log({ value, alias, type });

  try {
    await query(fql`SpeechAlias.create({
      type: ${type},
      value: ${value},
      alias: ${alias},
      owner: User.byId(${user.value.id})
    })`)
  } catch (error) {}
};

export default function useAliases() {
  return { aliasesByType, getAliases, createAlias };
}