export type PropertyOption = {
  id: string;
  title: string;
  city?: string | null;
  priceUsd?: number | null;
};

export type Props = {
  advisorId?: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  max?: number; // default 3
};

export type ApiResponse = {
  items: PropertyOption[];
  nextCursor: string | null;
};
