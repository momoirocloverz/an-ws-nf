import request from '@/utils/request';
import { ALL_API } from './api';

// 家庭照片列表
export async function getFamilyPicList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_family_pic_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 编辑家庭照片
export async function editFamilyImage(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_family_pic',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除家庭照片
export async function deleteFamilyImage(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_family_pic',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 查看家庭照片记录
export async function getFamilyImage(params: any): Promise<any> {
  const _params = {
    api_name: 'get_family_pic',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
