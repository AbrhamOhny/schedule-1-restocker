export type Item = {
  id: number;
  name: string | string;
  quantity?: number;
  maxQuantity: number;
  requiredQuantity?: number;
  cost: number;
  category: string;
};
export type RatioItem = {
  id: number;
  name: string;
  ratio: number;
};
