import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

// 获取打分项管理列表
export async function getItemList(params: any): Promise<any> {
  const _params = {
    api_name: 'item_list',
    ...params,
  };
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 添加打分项列表
export async function addItemList(params: any): Promise<any> {
  const _params = {
    api_name: 'add_item',
    ...params
  };
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 编辑打分项列表
export async function editItemList(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_item',
    ...params
  };
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 主编码下拉列表
export async function getMainCodeList(): Promise<any> {
  const _params = {
    api_name: 'code_list'
  };
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 删除列表中的数据
export async function deleteItemManageList(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_item',
    ...params
  };
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}

// 申请使用
export async function applyUse(params: any): Promise<any> {
  const _params = {
    api_name: 'apply_item',
    ...params
  }
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}

// 撤销使用
export async function cancelUse(params: any): Promise<any> {
  const _params = {
    api_name: 'cancel_item',
    ...params
  }
  const data = await getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}

// 编辑巡查员
export async function editApply(params: any): Promise<any> {
  const _param = {
    api_name: 'edit_apply',
    ...params
  }
  const data = await getApiParams(_param, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}

// 应用村
export async function getVillageItem(params: any): Promise<any> {
  const _param = {
    api_name: 'village_item',
    ...params
  }
  const data = await getApiParams(_param, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}

// 应用村的移除
export async function cancelVillageItem(params: any): Promise<any> {
  const _param = {
    api_name: 'cancel_village_item',
    ...params
  }
  const data = await getApiParams(_param, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data
  })
}