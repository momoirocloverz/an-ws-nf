import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
// =============== 党员先锋指数 ===============
export function getMemberEvaluationReports(params) {
  const data = getApiParams({
    api_name: 'building_list',
    name: params.name,
    start_time: params.dateRange?.[0] && params.dateRange?.[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.dateRange?.[1] && params.dateRange?.[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createEvaluationReport(params) {
  const data = getApiParams({
    api_name: 'add_building',
    year: params.year && params.year.year(),
    division: params.timespan,
    name: params.name,
    score: params.score,
    grade: params.grade,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyEvaluationReport(params) {
  const data = getApiParams({
    api_name: 'edit_building',
    id: params.id,
    year: params.year && params.year.year(),
    division: params.timespan,
    name: params.name,
    score: params.score,
    grade: params.grade,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteEvaluationReport(id) {
  const data = getApiParams({
    api_name: 'del_building',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 一件驳回
export function townFinanceRejectDeclaresAll(params) {
  const data = getApiParams({
    api_name: 'town_finance_reject_declares_all',
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 一件驳回
export function townFinanceRejectDeclaresAllTown(params) {
  const data = getApiParams({
    api_name: 'town_finance_reject_declares_all_town',
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 跳过全部公示
export function startPublicityToTownAll(village_id) {
  const data = getApiParams({
    api_name: 'start_publicity_to_town_all',
    village_id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function importEvaluationReports(id) {
  const data = getApiParams({
    api_name: 'import_building_construction',
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =============== 周年 ===============
export function getAnniversaryEvents(params) {
  const data = getApiParams({
    api_name: 'party_affairs_list',
    start_time: params.createdAt?.[0] && params.createdAt?.[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.createdAt?.[1] && params.createdAt?.[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    type: 1,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function createAnniversaryEvent(params) {
  const data = getApiParams({
    api_name: 'add_party_affairs',
    date: params.date && params.date.format('YYYY-MM-DD'),
    content: params.content,
    type: 1,
    title: '事件',
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyAnniversaryEvent(params) {
  const data = getApiParams({
    api_name: 'edit_party_affairs',
    id: params.id,
    date: params.date && params.date.format('YYYY-MM-DD'),
    content: params.content,
    type: 1,
    title: '事件',
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteAnniversaryEvent(id) {
  const data = getApiParams({
    api_name: 'del_party_affairs',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}



export function getBannerVideo() {
  const data = getApiParams({
    api_name: 'party_affairs_list',
    type: 0,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function createBannerVideo(params) {
  const data = getApiParams({
    api_name: 'add_party_affairs',
    title: params.title,
    video_url: params.video,
    video_img: params.poster,
    date: '2000-01-01',
    content: '視頻',
    type: '0',
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyBannerVideo(params) {
  const data = getApiParams({
    api_name: 'edit_party_affairs',
    id: params.id,
    title: params.title,
    video_url: params.video,
    video_img: params.poster,
    date: '2000-01-01',
    content: '視頻',
    type: '0',
    // title: '事件',
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteBannerVideo(id) {
  const data = getApiParams({
    api_name: 'del_party_affairs',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
