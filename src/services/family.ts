import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 获取家庭成员
export async function getFamilyMemberList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_member',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
