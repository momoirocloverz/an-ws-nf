import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

// 配方肥申报列表(1 未公示 2公示中 3 公示完成	) 镇级
export async function townFormulaFertilizerList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_town_subsidy_formula_fertilizer_declare_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表( 打款记录 ) 镇级
export async function townFormulaFertilizerRemitList(params: any): Promise<any> {
  const _params = {
    api_name: 'town_subsidy_formula_fertilizer_declare_payment_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表( 驳回/取消申报 -- 列表) 镇级
export async function townFormulaFertilizerRejectList(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_reject_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报列表( 驳回/取消申报 -- 单条) 镇级
export async function townFormulaFertilizerRejectSingle(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_cancel_reject_publicity_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


// 配方肥申报统计(1 未公示 2公示中 3 公示完成	) 镇级
export async function townFormulaFertilizerTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'town_subsidy_formula_fertilizer_declare_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报统计( 打款记录 ) 镇级
export async function townFormulaFertilizerRemitTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'town_subsidy_formula_fertilizer_declare_payment_record_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 镇级编辑配方肥 肥量
export async function editFormulaFertilizerDeclare(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_subsidy_formula_fertilizer_declare',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 镇级配方肥 市级累加补贴
export async function formulaFertilizerSkipPublicity(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_skip_publicity_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 镇级配方肥 停止公示
export async function formulaFertilizerStopPublicity(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_stop_publicity_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


// 配方肥申报导出 (1 未公示 2公示中 3 公示完成) 镇级
export async function townFormulaFertilizerListExport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_town_subsidy_formula_fertilizer_declare',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}


// 配方肥申报导出 (打款记录) 镇级
export async function townFormulaFertilizerRemitListExport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_town_subsidy_formula_fertilizer_declare_payment_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报导出 (驳回列表) 镇级
export async function townFormulaFertilizerRejectListExport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_town_subsidy_formula_fertilizer_declare_reject_record_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报导出 开始公示 镇级
export async function townFormulaFertilizerListStartPublicity(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_publicity_operation',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--镇级--审核操作--待审核/已审核
export async function subsidyFormulaFertilizerDeclareExamine(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_examine',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--村级--列表
export async function subsidyFormulaDeclareVillage(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_declare_village',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--村级--申报统计
export async function subsidyFormulaDeclareVillageTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_declare_village_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 配方肥申报--村级--申报--导出
export async function exportSubsidyFormulaDeclareVillage(params: any): Promise<any> {
  const _params = {
    api_name: 'export_subsidy_formula_declare_village',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--镇级--申报--导出--待审核/已审核
export async function exportSubsidyFormulaFertilizerDeclare(params: any): Promise<any> {
  const _params = {
    api_name: 'export_subsidy_formula_fertilizer_declare',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--镇级--申报列表--待审核/已审核
export async function getSubsidyFormulaFertilizerDeclareList(params: any): Promise<any> {
  const _params = {
    api_name: 'get_subsidy_formula_fertilizer_declare_list',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 配方肥申报--镇级--申报统计--待审核/已审核
export async function subsidyFormulaFertilizerDeclareListTotal(params: any): Promise<any> {
  const _params = {
    api_name: 'subsidy_formula_fertilizer_declare_list_total',
    ...params,
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
