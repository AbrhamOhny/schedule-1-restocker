<script setup lang="ts">
import { onBeforeMount, ref, type Component } from "vue";
import { useStaticData } from "../store/StaticData";
import CustomSelect from "./CustomSelect.vue";
import { type Property, LoadingBay } from "../models/Property";
import AddItem from "./AddItem.vue";
import type { Item, RatioItem } from "../models/Item";
import IconClose from "./icons/IconClose.vue";
import { useDataStore } from "../store/Data";

const emit = defineEmits<{
  (e: "addItem", payload: Component, listeners?: Record<string, unknown>): void;
  (e: "hideModal"): void;
  (e: "savedData"): void;
}>();
const { propertyIndex = undefined } = defineProps<{
  propertyIndex: number | undefined;
}>();
const staticData = useStaticData();
const selectedProperty = ref<Property | undefined>(undefined);
const selectedSeed = ref<RatioItem | undefined>(undefined);
const loadingBays = ref<Array<Array<Item>>>([[]]);
function handleAdditem(bayIndex: number) {
  emit("addItem", AddItem, {
    onSelectedItem: (item: Item) => {
      emit("hideModal");
      if (!loadingBays.value) loadingBays.value = [];
      if (!loadingBays.value[bayIndex]) loadingBays.value[bayIndex] = [];
      loadingBays.value[bayIndex].push(item);
    },
  });
}
function removeItem(bayIndex: number, index: number) {
  loadingBays.value[bayIndex].splice(index, 1);
}
function saveData() {
  if (selectedProperty.value === undefined) return;
  const data = useDataStore();
  const toBeStored: Property = selectedProperty.value;
  toBeStored.seedType = selectedSeed.value;
  toBeStored.loadingBay = new LoadingBay(...loadingBays.value);
  toBeStored.activeResupply = {
    _seed: undefined,
    _strain: undefined,
    _maxSlotPerItem: 8,
    _waves: [],
    _waveIndex: undefined,
    _dealer: undefined,
    _pack: undefined,
    _packType: undefined,
    _calcMethod: undefined,
  };
  if (propertyIndex == undefined) {
    data.property.push(toBeStored);
  } else {
    data.property[propertyIndex!] = toBeStored;
  }
  emit("savedData");
}
onBeforeMount(() => {
  if (propertyIndex !== undefined) {
    let data = useDataStore();
    console.log(data.property[propertyIndex]);
    selectedProperty.value = data.property[propertyIndex];
    selectedSeed.value = data.property[propertyIndex].seedType;
    loadingBays.value = data.property[propertyIndex].loadingBay!;
  }
});
</script>
<template>
  <div class="card w-full min-h-0 flex flex-col gap-5">
    <span>Add Instance</span>
    <CustomSelect
      title="Select property"
      v-model="selectedProperty"
      :items="
        staticData.properties.map((val: Property) => {
          return { label: val.name, prop: val };
        })
      "
    />
    <CustomSelect
      title="Select seed"
      v-model="selectedSeed"
      :items="
        staticData.seedTypes.map((val) => {
          return {
            label: val.name,
            prop: val,
          };
        })
      "
    />
    <span v-if="selectedProperty === undefined"
      >Please select property first</span
    >
    <div
      v-else
      class="flex flex-col gap-3"
      v-for="n in selectedProperty.loadingBaysLen"
      :key="n.toString()"
    >
      <span>Loading Bay {{ n }}</span>
      <div class="flex flex-wrap gap-3 px-3">
        <div
          class="selected-item has-[button:hover]:border-rose-300! has-[button:hover]:bg-rose-950 has-[button:hover]:text-rose-300"
          v-if="loadingBays != undefined && loadingBays[n - 1]?.length > 0"
          v-for="(item, index) in loadingBays![n - 1]"
          :key="`item-${n}-${index}`"
        >
          <div class="flex flex-row items-center py-1 gap-2 px-2">
            <span>
              {{ item.name }}
            </span>
            <span class="text-primary-lighter!">
              {{ `$${item.cost}` }}
            </span>
          </div>
          <button
            class="border-l flex flex-row items-center border-background-lighter px-2 hover:border-rose-300"
            @click="removeItem(n - 1, index)"
          >
            <IconClose class="w-6 text-rose-300!" />
          </button>
        </div>
        <button @click="handleAdditem(n - 1)" class="item-add-btn">
          + add item
        </button>
      </div>
    </div>
    <button
      @click="saveData"
      :disabled="
        selectedProperty === undefined ||
        selectedSeed === undefined ||
        loadingBays[0]?.length === 0
      "
      class="btn"
    >
      Save
    </button>
  </div>
</template>
