import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

// 配方肥申报列表(1 未公示 2 公示中 3待递交 4已递交 5 财政退回) 市级
export async function cityFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_city_subsidy_formula_fertilizer_declare_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表(打款记录) 市级
export async function cityFormulaFertilizerListRemit(params: any): Promise<any> {
  const _params = {
    api_name: 'city_subsidy_formula_fertilizer_declare_payment_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表统计(1 未公示 2 公示中 3待递交 4已递交 5 财政退回) 市级
export async function cityFormulaFertilizetListTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'city_subsidy_formula_fertilizer_declare_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


// 配方肥申报列表统计(打款记录) 市级
export async function cityFormulaFertilizerListRemitTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'city_subsidy_formula_fertilizer_declare_payment_record_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表统计(1 未公示 2 公示中 3待递交 4已递交 5 财政退回) 市级
export async function cityFormulaFertilizerListExport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_city_subsidy_formula_fertilizer_declare',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表统计(打款记录) 市级
export async function cityFormulaFertilizerListRemitExport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_city_subsidy_formula_fertilizer_declare_payment_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表 待递交列表 驳回
export async function cityFormulaFertilizerListReject(params: any): Promise<any> {
  const _params = {
    api_name: 'city_subsidy_formula_fertilizer_declare_reject_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表 待递交列表 提交
export async function cityFormulaFertilizerListSubmit(params: any): Promise<any> {
  const _params = {
    api_name: 'city_subsidy_formula_fertilizer_declare_submit_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

