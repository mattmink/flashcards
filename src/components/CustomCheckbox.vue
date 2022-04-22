<template>
  <label class="custom-checkbox">
    <input
      type="checkbox"
      :value="value"
      :modelValue="modelValue"
      @input="handleInput"
    />
    <svg viewBox="0 0 60 40" aria-hidden="true" focusable="false">
      <path
        d="M21,2 C13.4580219,4.16027394 1.62349378,18.3117469 3,19 C9.03653312,22.0182666 25.2482171,10.3758914 30,8 C32.9363621,6.53181896 41.321398,1.67860195 39,4 C36.1186011,6.8813989 3.11316157,27.1131616 5,29 C10.3223659,34.3223659 30.6434647,19.7426141 35,18 C41.2281047,15.5087581 46.3445303,13.6554697 46,14 C42.8258073,17.1741927 36.9154967,19.650702 33,22 C30.3136243,23.6118254 17,31.162498 17,34 C17,40.4724865 54,12.4064021 54,17 C54,23.7416728 34,27.2286213 34,37"
        stroke-width="4"
        fill="none"
        stroke-dasharray="270"
        stroke-dashoffset="270"
      ></path>
    </svg>
    <slot></slot>
  </label>
</template>

<script setup>
const props = defineProps({
  value: [String, Number, Object, Date, Symbol],
  modelValue: [Boolean, Array],
});

const emit = defineEmits(["update:modelValue"]);

function handleInput($event) {
  const isChecked = $event.target.checked;

  if (typeof props.modelValue === "boolean") {
    emit('update:modelValue', isChecked);
    return;
  }

  const arrayCopy = [...props.modelValue];

  if (isChecked) {
    arrayCopy.push(props.value);
  } else {
    const index = arrayCopy.indexOf(props.value);
    if (index === -1) return;
    arrayCopy.splice(index, 1);
  }

  emit('update:modelValue', arrayCopy);
}
</script>

<style scoped>
.custom-checkbox {
  position: relative;
  cursor: pointer;
}

.custom-checkbox svg {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 0.125em;
  margin-right: 0.25em;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-radius: 0.2em;
  background: #fff;
}

.custom-checkbox input[type="checkbox"] {
  opacity: 0.00001;
  width: 1em;
  height: 1em;
  position: absolute;
  left: 0.5em;
  top: 0.4em;
  cursor: pointer;
}

.custom-checkbox svg path {
  transition: stroke-dashoffset 0.2s linear;
  stroke: #405cf5;
}

.custom-checkbox input[type="checkbox"]:checked + svg path {
  stroke-dashoffset: 0;
}

.custom-checkbox input[type="checkbox"]:focus + svg {
  outline: 3px dotted #405cf5;
  outline-offset: 5px;
}

.custom-checkbox input[type="checkbox"]:focus:not(:focus-visible) + svg {
  outline: none;
}
</style>
