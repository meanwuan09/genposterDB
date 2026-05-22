export type Role = 'admin' | 'staff';

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: Role;
};

export type UserSummary = {
  id: number;
  email: string;
  name: string | null;
  role: Role;
};

export type Category = {
  id: number;
  code: string;
  name: string;
  description: string | null;
};

export type PlaceMedia = {
  id: number;
  mediaFileId: number;
  sortOrder: number;
  isPrimary: boolean;
  imageUrl: string | null;
  originalName: string | null;
  width: number | null;
  height: number | null;
};

export type PlaceListItem = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  priceText: string | null;
  serviceType: string | null;
  mealType: string | null;
  partnerRelation: string | null;
  partnerPriority: number;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdByUserId: number | null;
  updatedByUserId: number | null;
  createdBy: UserSummary | null;
  updatedBy: UserSummary | null;
  primaryImage: PlaceMedia | null;
};

export type PlaceDetail = PlaceListItem & {
  model: string | null;
  style: string | null;
  bestTime: string | null;
  direction: string | null;
  highlights: string | null;
  note: string | null;
  areaText: string | null;
  ward: string | null;
  priceMin: number | null;
  priceMax: number | null;
  isFree: boolean;
  currency: string | null;
  openingHours: string | null;
  phone: string | null;
  media: PlaceMedia[];
  tags: Array<{ id: number; name: string; code: string; groupName: string | null }>;
};

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
