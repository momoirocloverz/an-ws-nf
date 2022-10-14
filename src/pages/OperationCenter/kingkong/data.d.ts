export interface TableListItem {
  id: number;
  name: string;
  icon: number;
  icon_image: string;
  jump_type: number;
  jump_value: string;
  is_show: number;
  sort: number;
  created_at: string;
}

export interface FormValueType {
  id: number;
  name: string;
  icon: number;
  icon_image: string;
  jump_type: number;
  jump_value: string;
  is_show: number;
  sort: number;
  created_at: string;
  is_checked: boolean;
}

export interface TableListPagination {
  item_total: number | string,
  page: number | string,
  page_count: number | string,
  page_total: string | number,
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
