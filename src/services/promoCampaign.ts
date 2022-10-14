import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
import moment from 'moment';
// =============== 诗画文成 ===============
export function getPromoArticles(params) {
  const data = getApiParams({
    api_name: 'poetry_list',
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

export function createPromoArticle(params) {
  const data = getApiParams({
    api_name: 'add_poetry',
    title: params.title,
    cate_id: params.category,
    image: params.poster,
    content: params.content,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyPromoArticle(params) {
  const data = getApiParams({
    api_name: 'edit_poetry',
    id: params.id,
    title: params.title,
    cate_id: params.category,
    image: params.poster,
    content: params.content,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deletePromoArticle(id) {
  const data = getApiParams({
    api_name: 'del_poetry',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =============== 名片管理 ===============
export function getPromoPosters(params) {
  const data = getApiParams({
    api_name: 'playturn_list',
    title: params.title,
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
export function createPromoPoster(params) {
  const data = getApiParams({
    api_name: 'add_playturn',
    title: params.title,
    vice_title: params.subtitle,
    small_image: params.croppedPoster,
    image: params.poster,
    content: params.content,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyPromoPoster(params) {
  const data = getApiParams({
    api_name: 'edit_playturn',
    id: params.id,
    title: params.title,
    vice_title: params.subtitle,
    small_image: params.croppedPoster,
    image: params.poster,
    content: params.content,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deletePromoPoster(id) {
  const data = getApiParams({
    api_name: 'del_playturn',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function getPromoVideos(params) {
  const data = getApiParams({
    api_name: 'impression_list',
    title: params.title,
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
export function createPromoVideo(params) {
  const data = getApiParams({
    api_name: 'add_impression',
    title: params.title,
    video_img: params.poster,
    video_url: params.video,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyPromoVideo(params) {
  const data = getApiParams({
    api_name: 'edit_impression',
    id: params.id,
    title: params.title,
    video_img: params.poster,
    video_url: params.video,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deletePromoVideo(id) {
  const data = getApiParams({
    api_name: 'del_impression',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
