export interface TableListItem {
  id: number;
  is_done: number;
  year: number;
  owner: string;
  score: number;
  type_name: String;
  family_rank: number;
  family_name: string;
  group_name: string;
  group_rank: number;
  created_at: string;
  up_time: string;
  status: Number;
}

export interface FormValueType {
  id: number;
  owner: string;
  score: number;
  family_name: string;
  family_rank: number;
  group_name: string;
  group_rank: number;
  create_at: string;
}

export interface TableListPagination {
  item_total: number | string;
  page: number | string;
  page_count: number | string;
  page_total: string | number;
}

export interface TableListData {
  error: number;
  data: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
