<script setup lang="ts">
import { computed, ref } from "vue";
import { useStaticData } from "../store/StaticData";
import type { Item } from "../models/Item";
const staticData = useStaticData();
const searchText = ref<String | undefined>();
const foundItems = computed(() => {
  return staticData.items.filter((item) =>
    item.name
      .toLocaleLowerCase()
      .includes(searchText.value?.toLocaleLowerCase() ?? ""),
  );
});
const emit = defineEmits<{
  (e: "selectedItem", payload: Item): void;
}>();
</script>
<template>
  <div class="card flex flex-col gap-5 min-w-full lg:min-w-1/3">
    <span>Add Items</span>
    <input v-model="searchText" type="text" placeholder="Find item" />
    <div
      class="flex flex-col h-72 bg-background-darker border rounded-sm border-background-lighter overflow-auto"
    >
      <span class="w-full p-3 text-center" v-if="foundItems.length === 0"
        >No item found</span
      >
      <button
        class="items"
        v-else
        v-for="item in foundItems"
        :key="item.name.toString()"
        @click="emit('selectedItem', item)"
      >
        <div class="flex flex-row items-center gap-1">
          <span>{{ item.name }}</span>
          <span class="text-primary-lighter!">{{ `$${item.cost}` }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
