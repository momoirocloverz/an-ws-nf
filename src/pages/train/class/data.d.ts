export interface TableListItem {
  train_id: number,
  title: string,
  category_title: string,
  category_id: number,
  cover_image_url: string,
  created_at: string,
  release_staus: number,
  is_display: number,
  is_top: number,
  views: number,
  shares: number,
  created_at: string,
}

export interface FormValueType {
  title: string;
  cover_image_id: number;
  video_id: string;
  timed_release: number;
  category_id: number;
  video_play_url: string;
  cover_image_url: string;
  train_id: number;
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
