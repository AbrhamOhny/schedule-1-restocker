import type { Item, RatioItem } from "./Item";

export type FixedLengthArray<
  T,
  L extends number,
  A extends unknown[] = [],
> = A["length"] extends L ? A : FixedLengthArray<T, L, [...A, T]>;
export type VanSlot = FixedLengthArray<Item | undefined, 16>;
export type Wave = VanSlot[];

export type Resupply = {
  _seed: number | undefined;
  _strain: number | undefined;
  _maxSlotPerItem: number;
  _waves: Wave[] | undefined;
  _waveIndex: number | undefined;
  _dealer: number | undefined;
  _pack: number | undefined;
  _packType: RatioItem | undefined;
  _calcMethod: "seed" | "dealer" | "pack" | undefined;
};
