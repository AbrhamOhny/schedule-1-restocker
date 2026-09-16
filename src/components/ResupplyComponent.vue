<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import type { Property } from "../models/Property";
import type { RatioItem } from "../models/Item";
import type { Wave } from "../models/Resupply";
import CustomSelect from "./CustomSelect.vue";
import { useStaticData } from "../store/StaticData";
import generateWaves from "../scripts/WaveGenerate";
type InputGroup = {
  seed: Ref<number | undefined>;
  strain: Ref<number | undefined>;
  maxSlotPerItem: Ref<number>;
  dealer: Ref<number | undefined>;
  pack: Ref<number | undefined>;
  packType: Ref<RatioItem | undefined>;
};
const { detail } = defineProps<{
  detail: Property;
}>();
const staticData = useStaticData();
const {
  _seed,
  _strain,
  _maxSlotPerItem,
  _waves,
  _waveIndex,
  _dealer,
  _pack,
  _packType,
  _calcMethod,
} = detail.activeResupply || {
  _seed: undefined,
  _strain: undefined,
  _maxSlotPerItem: 8,
  _waves: undefined,
  _waveIndex: 0,
  _dealer: undefined,
  _pack: undefined,
  _packType: undefined,
  _calcMethod: undefined,
};
const calcMethod = ref<"seed" | "dealer" | "pack">(_calcMethod || "seed");
const requiredSeed = computed((): number => {
  switch (calcMethod.value) {
    case "seed":
      return _inputs.seed.value!;
    case "dealer":
      return (
        (_inputs.dealer.value! *
          _inputs.pack.value! *
          _inputs.packType.value?.ratio!) /
        (_inputs.strain.value! / detail.seedType?.ratio!)
      );
    case "pack":
      return (
        (_inputs.pack.value! * _inputs.packType.value?.ratio!) /
        (_inputs.strain.value! / detail.seedType?.ratio!)
      );
    default:
      return _inputs.seed.value!;
  }
});
const _inputs: InputGroup = {
  seed: ref<number | undefined>(_seed),
  strain: ref<number | undefined>(_strain),
  maxSlotPerItem: ref<number>(_maxSlotPerItem),
  dealer: ref<number | undefined>(_dealer),
  pack: ref<number | undefined>(_pack),
  packType: ref<RatioItem | undefined>(_packType),
};
const requiredInputs = computed((): (keyof InputGroup)[] => {
  const defaultRequirements: (keyof InputGroup)[] = [
    "strain",
    "maxSlotPerItem",
  ];
  switch (calcMethod.value) {
    case "seed":
      return [...defaultRequirements, "seed"];
    case "dealer":
      return [...defaultRequirements, "dealer", "pack", "packType"];
    case "pack":
      return [...defaultRequirements, "pack", "packType"];
    default:
      return [...defaultRequirements, "seed"];
  }
});
const waves = ref<Wave[]>(_waves || []);
const activeWaveIndex = ref(_waveIndex || 0);
const showWaves = ref(_waves?.length! > 0 || false);
const isGenerating = ref(false);
const isError = ref(false);
const errMsg = ref("");
const isValid = computed(() => {
  const keys = (Object.keys(_inputs) as (keyof InputGroup)[]).filter((key) =>
    requiredInputs.value.includes(key),
  );
  return keys.every((key) => _inputs[key].value !== undefined);
});

async function onGenerate() {
  const requiredQuanitity = requiredSeed.value * _inputs.strain.value!;
  isError.value = false;
  showWaves.value = true;
  isGenerating.value = true;
  generateWaves(requiredQuanitity, detail)
    .then((wave: Wave[]) => {
      isGenerating.value = false;
      waves.value = wave;
      saveParameters();
    })
    .catch((e: Error) => {
      isGenerating.value = false;
      isError.value = true;
      errMsg.value = e.message;
      console.error(e);
    });
}

function saveParameters() {
  detail.activeResupply = {
    _seed: _inputs.seed.value,
    _strain: _inputs.strain.value,
    _maxSlotPerItem: _inputs.maxSlotPerItem.value,
    _waves: waves.value,
    _waveIndex: activeWaveIndex.value,
    _dealer: _inputs.dealer.value,
    _pack: _inputs.pack.value,
    _packType: _inputs.packType.value,
    _calcMethod: calcMethod.value,
  };
}

function filterNumeric(e: Event) {
  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, "");
}

function changeIndex(i: number) {
  const sum = activeWaveIndex.value + i;
  activeWaveIndex.value =
    sum < waves.value.length && sum > -1 ? sum : activeWaveIndex.value;
  detail.activeResupply!._waveIndex = activeWaveIndex.value;
}
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-5">
    <div class="card h-fit flex flex-2/4 flex-col gap-5">
      <div class="flex flex-row gap-2 items-center">
        <span>{{ detail.name }}</span>
        <span class="italic">{{ `( ${detail.seedType?.name} )` }}</span>
      </div>
      <div class="flex flex-row gap-2">
        <button
          class="btn one-click px-4 py-1!"
          @click="calcMethod = 'seed'"
          :data-active="calcMethod === 'seed'"
        >
          Seed
        </button>
        <button
          class="btn one-click px-4 py-1!"
          @click="calcMethod = 'pack'"
          :data-active="calcMethod === 'pack'"
        >
          Packs
        </button>
        <button
          class="btn one-click px-4 py-1!"
          @click="calcMethod = 'dealer'"
          :data-active="calcMethod === 'dealer'"
        >
          Dealer
        </button>
      </div>
      <div class="flex flex-col gap-2" v-if="calcMethod === 'seed'">
        <label class="flex flex-1/2">Seed plant</label>
        <input
          type="number"
          class="flex flex-2/2 no-spinner"
          v-model.number="_inputs.seed.value"
          @input="filterNumeric"
          placeholder="Total plants you wish to plant"
        />
      </div>
      <div
        v-else-if="calcMethod === 'dealer'"
        class="flex flex-col flex-1 gap-2"
      >
        <label class="flex flex-1/2">Total dealers</label>
        <input
          type="number"
          class="flex flex-2/2 no-spinner"
          v-model.number="_inputs.dealer.value"
          @input="filterNumeric"
          placeholder="Total dealer you need to distribute"
        />
      </div>
      <div
        v-if="calcMethod === 'dealer' || calcMethod === 'pack'"
        class="flex flex-row gap-2 items-end"
      >
        <div class="flex flex-col flex-3/3 gap-2">
          <label class="flex flex-1/2"
            >Packs needed{{
              calcMethod === "dealer" ? " per dealer" : ""
            }}</label
          >
          <input
            type="number"
            class="flex flex-2/2 no-spinner"
            v-model.number="_inputs.pack.value"
            @input="filterNumeric"
            :placeholder="`Total pack needed${calcMethod === 'dealer' ? ' for dealers' : ''}`"
          />
        </div>
        <div class="flex flex-col flex-2/3 gap-2">
          <span>Pack Type</span>
          <CustomSelect
            title="Select type"
            v-model="_inputs.packType.value"
            :fixed="true"
            :items="
              staticData.packagingTypes.map((val: RatioItem) => {
                return {
                  label: val.name,
                  prop: val,
                };
              })
            "
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="flex flex-1/2">Strain per seed</label>
        <input
          type="number"
          class="flex flex-2/2 no-spinner"
          v-model.number="_inputs.strain.value"
          @input="filterNumeric"
          placeholder="1 coca seed, produces [12] leaves"
        />
      </div>
      <div v-if="isValid" class="flex flex-col gap-1">
        <span>Estimated seeds: {{ Math.ceil(requiredSeed) }}</span>
        <span>Estimated strains:</span>
        <div class="flex flex-col gap-1">
          <span>- Produced: {{ requiredSeed * _inputs.strain.value! }}</span>
          <span
            >- Processed:
            {{
              (requiredSeed * _inputs.strain.value!) / detail.seedType?.ratio!
            }}</span
          >
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="flex flex-1/2">Max slot per items</label>
        <input
          type="number"
          class="flex flex-2/2 no-spinner"
          max="16"
          v-model.number="_inputs.maxSlotPerItem.value"
          @input="filterNumeric"
        />
      </div>
      <button :disabled="!isValid" @click="onGenerate" class="btn">
        Generate resupply waves
      </button>
    </div>
    <div class="card flex flex-col gap-5 flex-4/4 h-fit" v-if="showWaves">
      <span v-if="isGenerating">Generating waves...</span>
      <span v-else-if="!isGenerating && isError">{{ errMsg }}</span>
      <div v-else-if="!isGenerating && !isError" class="flex flex-col gap-5">
        <div class="flex flex-row items-center gap-10">
          <button @click="changeIndex(-1)" class="btn flex-1">Previous</button>

          <span>{{ `Wave ${activeWaveIndex + 1} / ${waves?.length}` }}</span>
          <button @click="changeIndex(1)" class="btn flex-1">Next</button>
        </div>
        <div
          v-for="(bay, index) in waves![activeWaveIndex]"
          class="flex flex-col gap-2"
        >
          <span>Loading Bay {{ index + 1 }}</span>
          <template
            v-for="(item, slot) in bay.filter((item) => item !== undefined)"
            :key="slot"
          >
            <div
              v-if="item"
              class="selected-item justify-start! text-normal! border-normal! gap-2 px-2 py-1"
            >
              <span>{{ item.name }}</span>
              <span class="text-primary-lighter">{{
                `${item.quantity}x`
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
