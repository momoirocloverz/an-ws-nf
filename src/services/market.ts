import request from '@/utils/request';
import { ALL_API } from './api';

// 获取导航列表
export async function marketList(params: any): Promise<any> {
  const _params = {
    api_name: 'market_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除导航
export async function deleteMarket(params: any): Promise<any> {
  const _params = {
    api_name: 'market_del',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
