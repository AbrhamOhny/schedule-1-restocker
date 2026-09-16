<script setup lang="ts">
import type { Component } from "vue";
import IconChevron from "./icons/IconChevron.vue";

const emit = defineEmits<{
  (e: "goBack", payload: number): void;
}>();

const { content } = defineProps<{
  prevContent: any;
  content: Component;
  contentProps?: Record<string, unknown>;
}>();
</script>
<template>
  <div class="flex flex-col p-5 min-h-dvh w-full">
    <div class="flex shrink w-full pb-5" v-if="prevContent !== undefined">
      <button
        @click="emit('goBack', prevContent)"
        class="flex flex-row items-center gap-2"
      >
        <IconChevron class="w-8 rotate-90" /> Back
      </button>
    </div>
    <component :is="content" v-bind="contentProps" />
  </div>
</template>
