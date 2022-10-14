export interface TableListItem {
  id: number;
  name: string;
  up_time: string;
  create_at: string;
}

export interface FormValueType {
  name: string;
  name: string;
  up_time: string;
  create_at: string;
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
