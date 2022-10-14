import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 土地流转列表
export async function landCirculationList(params: any): Promise<any> {
  const data = getApiParams({
    api_name: 'land_circulation_list',
    subsidy_object: params.subsidy_object,
    identity: params.identity,
    mobile: params.mobile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 土地流转删除
export async function deleteLandCirculation(params: any): Promise<any> {
  const addApiName = {
    api_name: 'del_land_circulation',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 土地流转新增
export async function addLandCirculation(params: any): Promise<any> {
  const addApiName = {
    api_name: 'add_land_circulation',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 土地流转编辑
export async function editLandCirculation(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_land_circulation',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


// 土地流转详情列表
// export async function landCirculationDetail(params, asFile: undefined | number = undefined) {
//   const addApiName = {
//     api_name: 'land_circulation_info_list',
//     land_circulation_id: params.land_circulation_id,
//     page: params.pageNum,
//     page_size: params.pageSize,
//     is_export: asFile,
//   };
//   const data = getApiParams(addApiName, PUBLIC_KEY);
//   return request(ALL_API, {
//     method: 'POST',
//     data,
//   });
// }
export function landCirculationDetail(params, asFile: undefined | number = undefined) {
  const data = getApiParams({
    api_name: 'land_circulation_info_list',
    land_circulation_id: params.land_circulation_id,
    page: params.pageNum,
    page_size: params.pageSize,
    is_export: asFile,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 土地流转详情增加
export async function addLandCirculationDetail(params: any): Promise<any> {
  console.log(params, 'params')
  const addApiName = {
    api_name: 'add_land_circulation_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 土地流转详情编辑
export async function editLandCirculationDetail(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_land_circulation_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 土地流转详情删除
export async function delLandCirculationDetail(params: any): Promise<any> {
  const addApiName = {
    api_name: 'del_land_circulation_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
