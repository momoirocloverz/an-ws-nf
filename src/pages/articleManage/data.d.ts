export interface TableListItem {
  article_id: number,
  title: string,
  category_title: string,
  category_id: number | Array,
  sub_category_id:number,
  cover_image: string,
  timed_release: any,
  release_status: number,
  is_display: number,
  is_top: number,
  view: number,
  shares: number,
  updated_at: string
}

export interface FormValueType {
  article_id?: number,
  title: string,
  cover_image: string,
  cover_image_id: number,
  category_id: number | Array,
  sub_category_id: number,
  timed_release: any,
  content: string
}
