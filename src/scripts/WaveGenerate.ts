import type { Item } from "../models/Item";
import type { Property } from "../models/Property";
import type { VanSlot, Wave } from "../models/Resupply";

export default async function generateWaves(
  requiredQuantity: number,
  property: Property,
  maxSlotPerItem: number = 8,
) {
  const leavesRatio: number = property.seedType?.ratio || 1;
  requiredQuantity = requiredQuantity / leavesRatio;
  const maxSlot = 16;

  property.loadingBay?.setRequiredItem(requiredQuantity);

  const generatedWaves: Wave[] = [];
  let itemIndexCursor: number[] = new Array(property.loadingBaysLen).fill(0);
  while (!property.loadingBay?.isFulfilled()) {
    const wave: Wave = Array.from(
      { length: property.loadingBaysLen },
      () => Array.from({ length: 16 }, () => undefined) as VanSlot,
    );
    property.loadingBay?.forEach((bay: Item[], bayIndex: number) => {
      let vanSlotCursor = 0;
      itemIndexCursor[bayIndex] =
        itemIndexCursor[bayIndex] >= bay.length ? 0 : itemIndexCursor[bayIndex];
      bay.forEach((item: Item, index: number) => {
        if (
          item.requiredQuantity === 0 ||
          vanSlotCursor === maxSlot ||
          index !== itemIndexCursor[bayIndex]
        ) {
          if (
            index === itemIndexCursor[bayIndex] &&
            item.requiredQuantity === 0
          ) {
            itemIndexCursor[bayIndex] += 1;
          }
          return;
        }
        let requiredSlot = Math.ceil(item.requiredQuantity! / item.maxQuantity);
        requiredSlot =
          requiredSlot > maxSlotPerItem ? maxSlotPerItem : requiredSlot;
        for (let _ = 0; _ < requiredSlot; _++) {
          if (vanSlotCursor === maxSlot) break;
          const addQuantity =
            item.requiredQuantity! > item.maxQuantity
              ? item.maxQuantity
              : item.requiredQuantity;
          wave[bayIndex][vanSlotCursor] = {
            ...item,
            ["quantity"]: addQuantity,
          };
          item.requiredQuantity! -= addQuantity!;
          vanSlotCursor += 1;
        }
        itemIndexCursor[bayIndex] +=
          itemIndexCursor[bayIndex] === bay.length ? 0 : 1;
      });
    });
    const combinedWave: Wave = wave.map((vanSlot) => {
      const map = new Map<string | number, Item>();

      vanSlot.forEach((item) => {
        if (!item) return;

        const existing = map.get(item.id);

        if (existing) {
          existing.quantity! += item.quantity!;
        } else {
          map.set(item.id, {
            ...item,
            quantity: item.quantity,
          });
        }
      });

      return Array.from(
        { length: 16 },
        (_, index) => Array.from(map.values())[index],
      ) as VanSlot;
    });
    generatedWaves.push(combinedWave);
  }
  return generatedWaves;
}
