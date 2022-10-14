import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';


// 产权交易埋点列表
export async function contractList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'contract_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 删除埋点
export async function deleteContract(params: any): Promise<any> {
  const addApiName = {
    api_name: 'contract_delete',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 新增编辑埋点
export async function makeContract(params: any): Promise<any> {
  const addApiName = {
    api_name: 'contract_make',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 添加家宴
export async function familyFeastAdd(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_add',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 修改家宴
export async function familyFeastEdit(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_edit',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 删除家宴
export async function familyFeastDel(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_del',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 家宴列表
export async function familyFeastList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_list',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 家宴预定列表
export async function familyFeastReserveList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_reserve_list',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 家宴预定审核
export async function familyFeastReserveCheck(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_reserve_check',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 宴厅租赁列表
export async function familyFeastLeaseList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'family_feast_lease_list',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 租赁宴厅增加
export async function addFamilyLease(params: any): Promise<any> {
  const addApiName = {
    api_name: 'add_family_lease_lease',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 租赁宴厅修改
export async function editFamilyLease(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_family_lease_lease',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 租赁宴厅删除
export async function delFamilyLease(params: any): Promise<any> {
  const addApiName = {
    api_name: 'del_family_lease_lease',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 证明模板列表
export async function proveVillageList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'prove_village_list',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 村级证明-上传附件
export async function editProveVillage(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_prove_village',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}