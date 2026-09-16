import { defineStore } from "pinia";
import { ref } from "vue";
import type { Property } from "../models/Property";

export const useDataStore = defineStore("data", () => {
  const property = ref<Property[]>([]);
  function setProperty(newProperties: Property[]) {
    property.value = newProperties;
  }
  function addProperty(newProperty: Property) {
    property.value.push(newProperty);
  }
  return { property, setProperty, addProperty };
});
