import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, IMG_UPLOAD_URL } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 金刚区管理
export async function kingkongList(params: any): Promise<any> {
  const addApiName = { ...params, api_name: 'get_home_page_list' };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addKingkong(params: any): Promise<any> {
  const addApiName = {
    api_name: 'add_home_page',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editKingkong(params: any): Promise<any> {
  const addApiName = {
    api_name: 'update_home_page',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletKingkong(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_home_page',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function showKingkong(params: any): Promise<any> {
  const addApiName = {
    api_name: 'show_home_page',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
