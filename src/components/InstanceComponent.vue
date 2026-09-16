<script setup lang="ts">
import type { Property } from "../models/Property";
import IconClose from "./icons/IconClose.vue";
import IconPencil from "./icons/IconPencil.vue";

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "resupply"): void;
  (e: "edit"): void;
}>();
const { detail } = defineProps<{
  detail: Property;
}>();
</script>
<template>
  <div class="card instance">
    <div class="card-title">
      <div class="flex flex-row gap-2 items-center">
        <span>{{ detail.name }}</span>
        <span class="italic">{{ `( ${detail.seedType?.name} )` }}</span>
      </div>
      <div class="flex flex-row items-center gap-2">
        <button class="edit-btn" @click="emit('edit')">
          <IconPencil class="w-6 text-primary-lighter" />
        </button>
        <button class="remove-btn" @click="emit('remove')">
          <IconClose class="w-6 text-rose-300" />
        </button>
      </div>
    </div>
    <div class="content-wrapper">
      <div
        class="flex flex-col gap-1"
        v-for="(loadingBay, index) in detail.loadingBay"
      >
        <span>{{ `Loading Bay ${index + 1}` }}</span>
        <div class="flex flex-wrap items-center gap-1 px-1">
          <span
            class="selected-item px-1.5 py-1"
            v-for="i in loadingBay.length > 2 ? 2 : loadingBay.length"
          >
            {{ loadingBay[i - 1].name }}
          </span>
          <span v-if="loadingBay.length > 2">{{
            `+${loadingBay.length - 2}`
          }}</span>
        </div>
      </div>
    </div>
    <button @click="emit('resupply')" class="resupply-btn">Resupply</button>
  </div>
</template>
