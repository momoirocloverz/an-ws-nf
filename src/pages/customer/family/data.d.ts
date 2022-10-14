export interface TableListItem {
  group_id: number | string;
  title: string;
  leader: string;
  area: string;
  created_at: string;
  city_name: string;
  town_name: string;
  town_id: number;
  village_name: string;
  village_id: number;
  created_at: string;
}

export interface FamilyTableListItem {
  group_id?: number | string;
  title?: string;
  leader?: string;
  area?: string;
  created_at?: string;
  family_id?: number | string;
  admin_id?: number | string;
  city_id?: number | string;
  town_id?: number | string;
  village_id?: number | string;
  owner_name?: string;
  integral?: number;
  is_delete?: number;
  updated_at?: string;
  mobile?: number;
  doorplate?:string;
  grid?:string;
}

export interface FormValueType {
  town_id: number;
  town_name: string;
  village_name: string;
}