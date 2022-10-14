export interface TableListItem {
  banner_id: number;
  banner_type: number;
  title: string;
  image_url: string;
  jump_value: string;
  timed_release: string;
  created_at: string;
  admin_name: string;
}

export interface FormValueType {
  title: string;
  image_url: string;
  timed_release: string;
  jump_value: string;
  jump_type: number;
  image_id: number;
  banner_id?: number;
  banner_type?: number;
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
