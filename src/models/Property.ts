import type { Item, RatioItem } from "./Item";
import type { Resupply } from "./Resupply";

export class LoadingBay extends Array<Item[]> {
  constructor(...items: Item[][]) {
    super();
    this.push(...items);
    Object.setPrototypeOf(this, LoadingBay.prototype);
  }

  public allItems(): Item[] {
    return this.flat();
  }

  public isFulfilled(): boolean {
    return this.allItems().every((item: Item) => item.requiredQuantity === 0);
  }

  public setRequiredItem(requiredQuantity: number): void {
    this.forEach((bay: Item[]) => {
      bay.forEach((item: Item) => {
        item.requiredQuantity = requiredQuantity;
      });
    });
  }
}

export type Property = {
  id: number;
  name: string;
  loadingBaysLen: number;
  seedType?: RatioItem | undefined;
  loadingBay?: LoadingBay;
  activeResupply?: Resupply;
};
