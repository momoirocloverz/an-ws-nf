import request from '@/utils/request';
import { ALL_API } from './api';

// 市民列表
export async function getCitizenList(params: any): Promise<any> {
  const _params = {
    api_name: 'citizen_list',
    ...params,
    is_export: params.asFile,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 修改市民信息
export async function editCitizenList(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_citizen_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}


// 市民类型列表
export async function getCitizenTypeList(params: any): Promise<any> {
  const _params = {
    api_name: 'citizen_type_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 新建市民类型列表
export async function addCitizenTypeList(params: any): Promise<any> {
  const _params = {
    api_name: 'add_citizen_type',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 编辑市民类型列表
export async function editCitizenTypeList(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_citizen_type',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 删除市民类型列表
export async function deleteCitizenTypeList(params: any): Promise<any> {
  const _params = {
    api_name: 'del_citizen_type',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
