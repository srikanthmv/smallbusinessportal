export interface ItemSearchFilterModel {
  category: string;
  categories: string[];
  size: string;
  sizes: string[];
  saleTag: string;
  saleTags: string[];
  color: string;
  colors: string[];
  name: string;
  status: number;
  fromIndex?: number;
  limit?: number;
}
