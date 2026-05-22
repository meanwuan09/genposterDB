export type PlaceSort = 'name' | 'updatedAt' | 'createdAt' | 'partnerPriority' | 'categoryId' | 'district' | 'priceMin';
export type SortOrder = 'asc' | 'desc';

export type ListPlacesQuery = {
  page?: string;
  pageSize?: string;
  q?: string;
  categoryId?: string;
  isActive?: string;
  sort?: PlaceSort;
  order?: SortOrder;
};

export type UpdatePlaceInput = Partial<{
  categoryId: number;
  name: string;
  model: string | null;
  serviceType: string | null;
  style: string | null;
  bestTime: string | null;
  direction: string | null;
  highlights: string | null;
  note: string | null;
  address: string | null;
  areaText: string | null;
  ward: string | null;
  district: string | null;
  city: string | null;
  priceText: string | null;
  priceMin: number | null;
  priceMax: number | null;
  isFree: boolean;
  currency: string | null;
  openingHours: string | null;
  phone: string | null;
  mealType: string | null;
  isActive: boolean;
}>;

export type CreatePlaceInput = UpdatePlaceInput & {
  categoryId: number;
  name: string;
};

export type UpdatePartnerInput = Partial<{
  partnerRelation: string | null;
  partnerPriority: number;
}>;

export type AttachPlaceMediaInput = {
  mediaFileId: number;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type BulkDeletePlaceMediaInput = {
  ids: number[];
};
