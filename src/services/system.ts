import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

export async function allMenuList(): Promise<any> {
  return request('/api/allMenu/list', {
    method: 'POST',
    data: null,
  });
}

// 获取按钮权限标识
export async function getButtonPermission(params: any): Promise<any> {
  const _params = {
    api_name: 'get_auth_button',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 设置菜单排序2020-
export async function setNavSort(params: any): Promise<any> {
  const _params = {
    api_name: 'set_menu_sort',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取导航列表
export async function getNavList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_menu_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

export async function getMenuAuthList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_menu_info_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 创建导航
export async function createNav(params: any): Promise<any> {
  const _params = {
    api_name: 'create_menu_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除导航
export async function deleteMenu(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_menu_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取导航编辑详情
export async function getMenuDetail(params: any): Promise<any> {
  const _params = {
    api_name: 'get_menu_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 编辑导航
export async function eidtMenu(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_menu_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取角色分页列表
export async function getRolePageList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_role_page_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 创建角色
export async function createRole(params: any): Promise<any> {
  const _params = {
    api_name: 'create_role_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 编辑角色
export async function editRole(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_role_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除角色
export async function deleteRole(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_role_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 设置角色的权限
export async function setRoleMemu(params: any): Promise<any> {
  const _params = {
    api_name: 'set_role_auth_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 账号列表
export async function getAccountList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_account_info_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 创建账号
export async function createAccount(params: any): Promise<any> {
  const _params = {
    api_name: 'create_account_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 编辑账号
export async function editAccount(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_account_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除账号
export async function deleteAccount(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_account_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 账号角色列表
export async function getAccountRoleList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_role_info_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取区域列表
export async function getAreaList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_area_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

export async function getRoleAreaList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_role_area',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 重置账号密码
export async function resetAccountPass(params: any): Promise<any> {
  const _params = {
    api_name: 'set_account_password',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 账号禁用
export async function setAccountStatus(params: any): Promise<any> {
  const _params = {
    api_name: 'set_account_state',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 修改密码
export async function changePassWord(params: any): Promise<any> {
  console.log(params, 'params')
  const _params = {
    api_name: 'modify_account_password',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 权限
export async function deleteAuthority(params: {auth_id: number}): Promise<any> {
  const addApiName = {
    api_name: 'delete_auth_button_info',
    ...params,
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addAuthority(params: any): Promise<any> {
  const _params = {
    api_name: 'create_auth_button_info',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editAuthority(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_auth_button_info',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function getAuthorityList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_auth_button_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 绑定权限
export async function setAuth(params: any): Promise<any> {
  const _params = {
    api_name: 'create_auth_menu_info',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 解绑浙政钉
export async function unbindAccount(params: any): Promise<any> {
  const _params = {
    api_name: 'unbind_account',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}