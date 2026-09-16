<script setup lang="ts">
import { type Component } from "vue";
const show = defineModel<boolean>("show", { default: false });
const { content, contentProps } = defineProps<{
  content?: Component;
  contentProps?: Record<string, unknown>;
}>();
function toggleShow() {
  show.value = !show.value;
}
</script>
<template>
  <div
    @click.self="toggleShow"
    class="modal"
    :style="{
      opacity: show ? 100 : 0,
      pointerEvents: show ? 'auto' : 'none',
    }"
  >
    <component :is="content" v-bind="contentProps"></component>
  </div>
</template>
