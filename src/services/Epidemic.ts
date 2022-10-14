import request from '@/utils/request';
import { ALL_API } from './api';

// 新建
export async function addPrevention(params: any): Promise<any> {
  const _params = {
    api_name: 'add_prevention',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
//  编辑
export async function editPrevention(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_prevention',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 列表查询
export async function preventionList(params: any): Promise<any> {
  const _params = {
    api_name: 'prevention_list',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

//  列表预览
export async function preventionInfo(params: any): Promise<any> {
  const _params = {
    api_name: 'prevention_info',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 删除列表数据
export async function deletePrevention(params: any): Promise<any> {
  const _params = {
    api_name: 'delete_prevention',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 置顶
export async function topPrevention(params: any): Promise<any> {
  const _params = {
    api_name: 'top_prevention',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 添加上传视频
export async function addVideo(params: any): Promise<any> {
  const _params = {
    api_name: 'add_video',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

