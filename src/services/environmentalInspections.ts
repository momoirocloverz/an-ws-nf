import request from '@/utils/request';
import moment from 'moment';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
// =============== 全域秀美检查 ===============
export function getEnvironmentalInspections(params) {
  const data = getApiParams({
    api_name: 'universe_inspection_list',
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    main_id: params.item?.[0],
    problem_cate_id: params.item?.[1],
    start_time: params.inspectedAt?.[0] && moment(params.inspectedAt[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.inspectedAt?.[1] && moment(params.inspectedAt[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteInspectionRecord(id) {
  const data = getApiParams({
    api_name: 'del_universe_inspection',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


export function getPrimaryInspectionCategories(params) {
  const data = getApiParams({
    api_name: 'universe_inspection_main_cate_list',
    main_item: params.name,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function getInspectionItems(params) {
  const data = getApiParams({
    api_name: 'universe_inspection_cate_list',
    main_item: params.name,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createInspectionItem(params) {
  const data = getApiParams({
    api_name: 'add_universe_inspection_cate',
    problem_cate: params.name,
    just_negative: params.type,
    type: params.primaryCategoryAction,
    main_info: params.primaryCategoryIdentifier,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyInspectionItem(params) {
  const data = getApiParams({
    api_name: 'edit_universe_inspection_cate',
    id: params.id,
    problem_cate: params.name,
    just_negative: params.type,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyPrimaryInspectionItem(params) {
  const data = getApiParams({
    api_name: 'edit_universe_inspection_main_cate',
    id: params.id,
    main_item: params.name,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function deleteInspectionItem(id) {
  const data = getApiParams({
    api_name: 'del_universe_inspection_cate',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// export function deletePrimaryInspectionItem(id) {
//   const data = getApiParams({
//     api_name: 'del_universe_inspection_cate',
//     id,
//   }, PUBLIC_KEY);
//   return request(ALL_API, {
//     method: 'POST',
//     data,
//   });
// }
