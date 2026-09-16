<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import AddInstance from "./components/AddInstance.vue";
import ModalComponent from "./components/ModalComponent.vue";
import NavigatorComponent from "./components/NavigatorComponent.vue";
import AllInstances from "./components/AllInstances.vue";
import type { Content } from "./models/Content";
import type { Property } from "./models/Property";
import ResupplyComponent from "./components/ResupplyComponent.vue";

const contents: Content[] = [
  {
    main: AllInstances,
    props: {
      onAddInstance: () => {
        prevContentIndex.value = 0;
        currentContentIndex.value = 1;
      },
      onResupply: (p: Property) => {
        selectedToResupply.value = p;
        currentContentIndex.value = 2;
        prevContentIndex.value = 0;
      },
      onEditInstance: (propertyIndex: number) => {
        selectedToEdit.value = propertyIndex;
        prevContentIndex.value = 0;
        currentContentIndex.value = 1;
      },
    },
  },
  {
    main: AddInstance,
    props: {
      onAddItem: showModal,
      onHideModal: hideModal,
      onSavedData: goBack,
      get propertyIndex() {
        return selectedToEdit.value;
      },
    },
  },
  {
    main: ResupplyComponent,
    props: {
      get detail() {
        return selectedToResupply.value;
      },
    },
  },
];

const selectedToEdit = ref<number | undefined>(undefined);
const selectedToResupply = ref<Property | undefined>();
const prevContentIndex = ref<number | undefined>();
const currentContentIndex = ref<number>(0);
const currentContent = computed(() => contents[currentContentIndex.value].main);
const currentContentProps = computed(
  () => contents[currentContentIndex.value].props || undefined,
);
const isModalOpened = ref(false);
const modalContent = ref<Component | undefined>();
const modalProps = ref<Record<string, unknown> | undefined>();

function showModal(content: Component, props: Record<string, unknown> = {}) {
  modalProps.value = props;
  modalContent.value = content;
  isModalOpened.value = true;
}
function hideModal() {
  modalProps.value = undefined;
  modalContent.value = undefined;
  isModalOpened.value = false;
}
function goBack(prevIndex: number = 0) {
  console.log(`going back to ${prevIndex}`);
  prevContentIndex.value = undefined;
  currentContentIndex.value = prevIndex;
  selectedToEdit.value = undefined;
}
</script>

<template>
  <NavigatorComponent
    @goBack="goBack"
    :prevContent="prevContentIndex"
    :content="currentContent"
    :contentProps="currentContentProps"
  />
  <ModalComponent
    v-model:show="isModalOpened"
    :content="modalContent"
    :contentProps="modalProps"
  />
</template>
