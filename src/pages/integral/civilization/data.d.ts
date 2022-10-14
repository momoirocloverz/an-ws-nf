export interface TableListItem {
  id: number;
  title: string;
  content: string,
  city_town: string,
  admin_name: string,
  create_at: string,
  strip_tag_content: string
}

export interface FormValueType {
  id?: number;
  title: string;
  content: string
}