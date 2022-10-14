export interface TableListItem {
  question_id: number;
  expert_type_id: string;
  content: string;
  expert_name: string;
  first_image: string;
  created_at: string;
  views: string;
  shares: string;
  answers: string;
  location: any;
}

export interface TableDetailItem {
  answer_time: string;
  answer_person: string;
  accept_person: string;
  answer_content: string;
}