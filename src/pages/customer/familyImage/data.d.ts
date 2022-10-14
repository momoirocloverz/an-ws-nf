export interface TableList {
  id: number;
  group_id: number;
  title: string;
  doorplate: string;
  owner_name: string;
  photos: string;
  real_name: string;
  item_name: string;
  created_at: number;
  image: Array;
  image_count: number;
  direction: string;
  integral: number;
}

export interface FormValues {
  operator: string;
  created_at: string;
  log_image: Array;
}
