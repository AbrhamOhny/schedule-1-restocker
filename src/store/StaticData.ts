import { defineStore } from "pinia";
import type { Item, RatioItem } from "../models/Item";
import type { Property } from "../models/Property";

type StaticData = {
  properties: Property[];
  seedTypes: RatioItem[];
  packagingTypes: RatioItem[];
  items: Item[];
};

export const useStaticData = defineStore("StaticData", {
  state: (): StaticData => {
    return {
      properties: [
        {
          id: 0,
          name: "Sweatshop",
          loadingBaysLen: 1,
        },
        {
          id: 1,
          name: "Stash and Dash",
          loadingBaysLen: 1,
        },
        {
          id: 2,
          name: "Bungalow",
          loadingBaysLen: 1,
        },
        {
          id: 3,
          name: "Barn",
          loadingBaysLen: 2,
        },
        {
          id: 4,
          name: "Dock Warehouse",
          loadingBaysLen: 2,
        },
        {
          id: 5,
          name: "Hyland Manor",
          loadingBaysLen: 3,
        },
      ],
      seedTypes: [
        { id: 0, name: "Marijuana", ratio: 1 },
        { id: 1, name: "Meth", ratio: 1 },
        { id: 2, name: "Shroom", ratio: 1 },
        { id: 3, name: "Coca", ratio: 2 },
      ],
      packagingTypes: [
        { id: 0, name: "Plastic Bag", ratio: 1 },
        { id: 1, name: "Jar", ratio: 5 },
        { id: 2, name: "Brick", ratio: 20 },
      ],
      items: [
        {
          id: 0,
          name: "Mushroom Substrate",
          cost: 60,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 1,
          name: "Coca",
          cost: 80,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 2,
          name: "OG Kush",
          cost: 30,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 3,
          name: "Sour Diesel",
          cost: 35,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 4,
          name: "Green Crack",
          cost: 40,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 5,
          name: "Granddaddy Purple",
          cost: 45,
          category: "plants:seed",
          maxQuantity: 10,
        },
        {
          id: 6,
          name: "Cuke",
          cost: 2,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 7,
          name: "Banana",
          cost: 2,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 8,
          name: "Paracetamol",
          cost: 3,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 9,
          name: "Donut",
          cost: 3,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 10,
          name: "Viagor",
          cost: 4,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 11,
          name: "Mouth Wash",
          cost: 4,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 12,
          name: "Flu Medicine",
          cost: 5,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 13,
          name: "Gasoline",
          cost: 5,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 14,
          name: "Energy Drink",
          cost: 6,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 15,
          name: "Motor Oil",
          cost: 6,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 16,
          name: "Mega Bean",
          cost: 7,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 17,
          name: "Chili",
          cost: 7,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 18,
          name: "Battery",
          cost: 8,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 19,
          name: "Iodine",
          cost: 8,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 20,
          name: "Addy",
          cost: 9,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
        {
          id: 21,
          name: "Horse Semen",
          cost: 9,
          category: "ingredients:mix",
          maxQuantity: 20,
        },
      ],
    };
  },
});
