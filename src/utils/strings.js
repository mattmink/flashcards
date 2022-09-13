const emptyStringValues = new Set([null, undefined, '']);
export const isEmpty = value => emptyStringValues.has(value);