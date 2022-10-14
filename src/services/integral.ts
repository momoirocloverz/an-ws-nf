import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API } from './api';
import { PUBLIC_KEY } from '@/services/api';

// 善治分细则
export async function integralRuleList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'rule_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addIntegralRule(params: any): Promise<any> {
  const addApiName = {
    api_name: 'add_culture_role_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editIntegralRule(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_rule',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletIntegralRule(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_culture_role_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 家庭积分
export async function getRecord(params: any): Promise<any> {
  const addApiName = {
    api_name: 'integral_family_record',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export async function getGroupSearch(): Promise<any> {
  const addApiName = {
    api_name: 'choose_group_list'
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export async function getFamilyDefaultValue(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'get_family_integral',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export async function auditRecord(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'audit_integral_record',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// 下拉打分项
export async function getScoreList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'choose_integral_item_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function upLoadIntegral(params: any): Promise<any> {
  const addApiName = {
    api_name: 'batch_update_integral',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function upLoadItemIntegral(params: any): Promise<any> {
  const addApiName = {
    api_name: 'update_integral',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 打分记录-编辑
export async function updateIntegralRecord(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_integral_record',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deleteIntegralRecord(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_integral_record',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function integralFamilyList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_integral_item_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function integralScoreList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_integral_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addIntegralScore(params: any): Promise<any> {
  const addApiName = {
    api_name: 'create_integral_item',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletIntegralScore(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_integral_item',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 积分商品
export async function integralGoodsList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_product_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'create_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'edit_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deletIntegralGoods(params: any): Promise<any> {
  const addApiName = {
    api_name: 'delete_product_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function editIsShowStatus(params: any): Promise<any> {
  const addApiName = {
    api_name: 'update_out',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 商品兑换记录
export async function exchangeList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'exchange_record_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function receiveExchange(params: any): Promise<any> {
  const addApiName = {
    api_name: 'set_checkin_product',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 股权
export async function shareBonusList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'get_stock_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function houseCodeList(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'choose_doorplate_list',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function deleteBonus(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'delete_stock_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function addBonus(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'add_stock_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function updataBonus(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'edit_stock_info',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 导入股金分红表格数据
export async function importStockData(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'import_stock_data',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 导出股金分红表格数据
export async function exportStockData(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'export_stock_template',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 打分项操作记录
export async function getIntegralFamilyLog(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'integral_family_record_log',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 积分兑换范围列表
export async function getRecordRange(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'exchange_between',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY)
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 创建范围
export async function createBetween(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'create_between',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY)
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 更新范围
export async function updateBetween(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'update_between',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY)
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 删除兑换区间记录
export async function deleteRange(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'delete_between',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY)
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 更新兑换区间展示状态
export async function exchangeRangeShow(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: 'update_show',
    ...params
  }
  const data = getApiParams(addApiName, PUBLIC_KEY)
  return request(ALL_API, {
    method: 'POST',
    data,
  })
}

// 添加积分兑换记录
export async function createExchangeRecord(params: any): Promise<any> {
  const addApiName = {
    api_name: 'create_exchange_record',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 打分项巡查员查看权限变更接口
export async function integralChange(params: any): Promise<any> {
  const addApiName = {
    api_name: 'allot_integral_item',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 查看打分项相关家庭列表
export async function integralDetail(params: any): Promise<any> {
  const addApiName = {
    api_name: 'integral_item_detail',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 历年积分结算列表
export async function breakDownList(params: any): Promise<any> {
  const addApiName = {
    api_name: 'year_integral',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// 获取善治宝历年结算和返回积分
export async function settleIntegral(params:any):Promise<any> {
    const addApiName={
      api_name:'settle_integral',
      ...params
    };
    const data=getApiParams(addApiName,PUBLIC_KEY);
    return request(ALL_API,{
      method:'POST',
      data
    })
}

export async function removePrimaryGradingGroup(code): Promise<any> {
  const addApiName = {
    api_name: 'delete_code',
    p_code: code
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function modifyPrimaryGradingGroup(code, newName): Promise<any> {
  const addApiName = {
    api_name: 'edit_code',
    p_code: code,
    p_name: newName,
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function modifyGradeItem(params): Promise<any> {
  const addApiName = {
    api_name: 'edit_apply',
    item_id: params.itemId,
    inspect: params.active,
    use_p_type: params.valueType,
    use_point: params.value,
    use_comment: params.manual,
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  console.log(data)
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
