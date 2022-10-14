import request from '@/utils/request';
import moment from "moment";
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
// =============== 资讯公告 ===============
export function getAnnouncements(params) {
  const data = getApiParams({
    api_name: 'information_announcement_list',
    title: params.title,
    cate_id: params.category,
    start_time: params.dateRange?.[0] && moment(params.dateRange[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.dateRange?.[1] && moment(params.dateRange[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createAnnouncement(params) {
  const data = getApiParams({
    api_name: 'add_information_announcement',
    title: params.title,
    cate_id: params.category,
    image: params.poster,
    content: params.content,
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    pdf_id: params.pdf_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyAnnouncement(params) {
  const data = getApiParams({
    api_name: 'edit_information_announcement',
    id: params.id,
    title: params.title,
    cate_id: params.category,
    image: params.poster,
    content: params.content,
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    pdf_id: params.pdf_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteAnnouncement(id) {
  const data = getApiParams({
    api_name: 'del_information_announcement',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
