import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 善治贷款列表
export async function loanList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'loan_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 善治贷款新增授信人
export async function addLoan(params: any): Promise<any> {
    const addApiName = {
      api_name: 'add_loan',
      ...params
    };
    const data = getApiParams(addApiName, PUBLIC_KEY);
    return request(ALL_API, {
      method: 'POST',
      data,
    });
}
// 编辑授信人
export async function editLoan(params: any): Promise<any> {
    const addApiName = {
      api_name: 'edit_loan',
      ...params
    };
    const data = getApiParams(addApiName, PUBLIC_KEY);
    return request(ALL_API, {
      method: 'POST',
      data,
    });
}
// 删除授信人
export async function deleteLoan(params: any): Promise<any> {
    const addApiName = {
      api_name: 'delete_loan',
      ...params
    };
    const data = getApiParams(addApiName, PUBLIC_KEY);
    return request(ALL_API, {
      method: 'POST',
      data,
    });
}

// 贷款数据统计
export async function loanStat(params: any): Promise<any> {
  const addApiName = {
    api_name: 'loan_stat',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}