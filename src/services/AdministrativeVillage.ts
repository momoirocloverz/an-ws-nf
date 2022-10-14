import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 行政村管理
export async function villageList(params: any): Promise<any> {
  const addApiName = { ...params, api_name: 'village_list' };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function townList(params: any = {}): Promise<any> {
  const addApiName = { ...params, api_name: 'get_area_list' };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addVillage(params: any = {}): Promise<any> {
  const addApiName = { ...params, api_name: 'create_village' };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deleteVillage(params: any = {}): Promise<any> {
  const addApiName = { ...params, api_name: 'delete_village' };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


