import request from '@/utils/request';
import { ALL_API } from './api';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

// export async function queryMenuList(): Promise<any> {
//   return request('/api/menu/list', {
//     method: 'POST',
//     data: {},
//   });
// }

// 获取账号信息
export async function getAccountInfo(params:any): Promise<any> {
  const _params = {
    api_name: 'get_account_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 编辑个人资料
export async function upLoadUserInfo(params:any): Promise<any> {
  const _params = {
    api_name: 'modify_account_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取登录用户的菜单
export async function queryMenuList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_auth_menu_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取用户的权限按钮
export async function getUserButtonAuth(params: any): Promise<any> {
  const _params = {
    api_name: 'get_auth_page_menu',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}