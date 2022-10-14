import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 积分商品
export async function integralGoodsList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_product_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'create_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function canExchangeGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'can_exchange_product',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
