import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

export async function classList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_train_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addClass(params: any): Promise<any> {
  const addApiName = {
    api_name: 'train_add',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editClass(params: any): Promise<any> {
  const addApiName = {
    api_name: 'train_edit',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function classIsTop(params: any): Promise<any> {
  const addApiName = {
    api_name: 'set_train_top',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function classIsShow(params: any): Promise<any> {
  const addApiName = {
    api_name: 'set_train_display',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletClassItem(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_train_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function getTypeData(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_all_train_category_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 获取视频凭证
export async function getAliYunJudge(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_video_auth_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 获取视频详情
export async function getVideoInfo(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_video_play_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 类目
export async function categoryList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_train_category_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletCategoryItem(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_train_category_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addCategoryItem(params: any): Promise<any> {
  const addApiName = {
    api_name: 'create_train_category_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editCategoryItem(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_train_category_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}



