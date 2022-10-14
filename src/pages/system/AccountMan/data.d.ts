export interface TableListItem {
  admin_id: number,
  user_name: string;
  real_name: string;
  avatar_id: string | number;
  mobile: string;
  role_id: string | number;
  city_id: string | number;
  town_id: string | number;
  village_id: number | number;
  last_ip: string;
  status: boolean | number;
  last_time: string;
  created_at?: string;
  updated_at?: string;
  avatar_url:? string;
  role_name?: string;
  area_name?: string;
  role_type?: string | number;
  wechat: string;
}
