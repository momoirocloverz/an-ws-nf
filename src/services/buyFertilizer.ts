import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

// 实名制购肥列表
export async function formulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_subsidy_formula_fertilizer_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥列表新增
export async function addFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'add_subsidy_formula_fertilizer',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥列表编辑
export async function editFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_subsidy_formula_fertilizer',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥列表删除
export async function deleteFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'del_subsidy_formula_fertilizer',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥申报
export async function applyFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'apply_subsidy_formula_fertilizer',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥统计
export async function formulaFertilizerListTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥导出
export async function exportFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'export_subsidy_formula_fertilizer',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥列表
export async function conditionList(param: any): Promise<any> {
  const params = {
    api_name: 'get_subsidy_formula_fertilizer_condition_list',
    ...param,
  };
  const data = getApiParams(params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 实名制购肥列表新增
export async function addCondition(params: any): Promise<any> {
  const newParams = {
    api_name: 'add_subsidy_formula_condition_fertilizer',
    ...params,
  };
  const data = getApiParams(newParams, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 实名制购肥列表编辑
export async function editCondition(params: any): Promise<any> {
  const newParams = {
    api_name: 'edit_subsidy_formula_condition_fertilizer',
    ...params,
  };
  const data = getApiParams(newParams, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
