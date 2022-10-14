export interface TableListItem {
  product_id: number,
  product_name: string,
  integral: string,
  quantity: string,
  description: string,
  process: string,
  prompt: string,
  area: string,
  exchange: string,
  is_show: number,
  created_at: string,
}

export interface FormValueType {
  product_name: string,
  integral: number,
  quantity: string,
  description: string,
  process: string,
  prompt: string,
  image_ids: string,
  image_url: any,
  product_id: number
}

export interface OnShelvesProps {
  accountInfo: any
}

export interface SoldOutProps {
  accountInfo: any
}

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
  family_limit: number,
  
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
