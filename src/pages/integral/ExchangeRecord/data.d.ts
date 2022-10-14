export interface TableListItem {
  id: number,
  user_name: string,
  family_name: string,
  group_name: string,
  area: string,
  created_at: string,
  product_name: string,
  image_url: Array,
  integral: number,
  quantity: number,
  receive_status: number,
}

export interface FormValueType {
  family_id: number;
  user_id: number;
  integral: number;
  need_count: number;
  over_rage: number;
  product_id: number;
  quantity: number;
  user_name: string;
}
