<script setup lang="ts">
import Chevron from "../components/icons/IconChevron.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
type _items = {
  label?: any;
  prop: any;
};
const value = defineModel<any>();
const _value = computed(() => {
  return value.value
    ? items.find((item) => item.prop?.id === value.value.id)
    : undefined;
});
const {
  title,
  items,
  fixed = false,
} = defineProps<{
  title: string;
  items: _items[];
  fixed?: boolean;
}>();
const emit = defineEmits<{
  (e: "change", payload: _items): void;
}>();
const selectOpen = ref(false);
const _comp = ref<HTMLElement | undefined>();
function selectItem(item: _items) {
  value.value = item.prop;
  selectOpen.value = false;
  emit("change", item);
}
function handleClickOutside(event: MouseEvent) {
  if (_comp.value && !_comp.value.contains(event.target as Node)) {
    selectOpen.value = false;
  }
}
onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  console.log(items);
  console.log([_value.value, value.value]);
});
onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div
    :class="`custom-select${fixed ? ' relative' : ''}`"
    ref="_comp"
    :data-open="selectOpen"
  >
    <button @click="selectOpen = !selectOpen">
      {{ _value?.label ?? title }}
      <Chevron class="w-6" />
    </button>
    <div
      :class="`item-container${fixed ? ' absolute left-0 translate-y-1 w-full' : ''}`"
    >
      <button
        :disabled="_value?.prop == item.prop"
        @click="selectItem(item)"
        v-for="item in items"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
