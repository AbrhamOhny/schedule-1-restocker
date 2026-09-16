<script setup lang="ts">
import type { Property } from "../models/Property";
import { useDataStore } from "../store/Data";
import IconConfused from "./icons/IconConfused.vue";
import InstanceComponent from "./InstanceComponent.vue";

const emit = defineEmits<{
  (e: "addInstance"): void;
  (e: "editInstance", index: number): void;
  (e: "resupply", payload: Property): void;
}>();
const data = useDataStore();
function removeInstance(index: number) {
  data.property.splice(index, 1);
}
async function handleImport() {
  const file = await fileSelector();
  if (!file || file.type !== "application/json") {
    return;
  }
  const content: Property[] = JSON.parse(await file.text()) as Property[];
  data.setProperty(content);
}
function hanldeExport() {
  const filename = `S1R-${new Date().toISOString().slice(0, 10)}.json`;
  const file = JSON.stringify(data.property, null, 2);
  const blob = new Blob([file], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = filename;
  element.click();
  URL.revokeObjectURL(url);
}
function fileSelector(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.accept = ".json";
    input.addEventListener("change", () => {
      resolve(input.files?.[0] ?? null);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  });
}
</script>
<template>
  <div
    :class="`flex ${data.property.length === 0 ? 'flex-col h-full items-center justify-center gap-10' : 'flex-wrap gap-5'}`"
  >
    <div
      v-if="data.property.length === 0"
      class="flex flex-col items-center justify-center gap-3"
    >
      <IconConfused class="w-10" />
      <span>No instance found</span>
    </div>
    <InstanceComponent
      v-else
      v-for="(property, index) in data.property"
      @remove="removeInstance(index)"
      @edit="emit('editInstance', index)"
      @resupply="emit('resupply', property)"
      :key="index"
      :detail="property"
    />
    <div
      :class="`flex flex-col drop-shadow-shadows drop-shadow-lg border border-background-lighter rounded-lg! overflow-clip ${data.property.length !== 0 ? 'fixed bottom-3 right-5' : ''}`"
    >
      <button
        class="py-3 px-5 bg-background-darker hover:bg-background"
        @click="emit('addInstance')"
      >
        Add Instance
      </button>
      <button
        class="py-3 px-5 bg-background-darker hover:bg-background"
        @click="handleImport"
      >
        Import
      </button>
      <button
        class="py-3 px-5 bg-background-darker hover:bg-background"
        v-if="data.property.length !== 0"
        @click="hanldeExport"
      >
        Export
      </button>
    </div>
  </div>
</template>
