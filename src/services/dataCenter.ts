import request from '@/utils/request';
import { ALL_API } from './api';

// 三务公开市级
export async function ThreeThingsOpen(params: any): Promise<any> {
  const _params = {
    api_name: 'article_open',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 文章点击排名
export async function articleSort(params: any): Promise<any> {
  const _params = {
    api_name: 'article_list',
    ...params
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 打分项统计
export async function integralStat(params: any): Promise<any> {
  const _params = {
    api_name: 'integral_stat',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 志愿者活动统计
export async function activityStat(params: any): Promise<any> {
  const _params = {
    api_name: 'activity_stat',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 股份积分统计
export async function stockStat(params: any): Promise<any> {
  const _params = {
    api_name: 'stock_stat',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 福利兑换饼图
export async function productStat(params: any): Promise<any> {
  const _params = {
    api_name: 'product_stat',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 福利兑换列表
export async function productStatList(params: any): Promise<any> {
  const _params = {
    api_name: 'product_stat_list',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

//平湖志愿活动排行表格
export async function activityStatList(params: any): Promise<any> {
  const _params = {
    api_name: 'activity_stat_list',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 股金分红统计
export async function stockStatList(params: any): Promise<any> {
  const _params = {
    api_name: 'stock_stat_list',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 各村家庭积分对比排名
export async function stockSumList(params: any): Promise<any> {
  const _params = {
    api_name: 'stock_sum_list',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 村级志愿者浏览量活动统计
export async function activityViewsRank(params: any): Promise<any> {
  const _params = {
    api_name: 'activity_views_rank',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}
// 村级志愿者参与人数统计
export async function activityUserRank(params: any): Promise<any> {
  const _params = {
    api_name: 'activity_user_rank',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 打分次数前十排名
export async function integralList(params: any): Promise<any> {
  const _params = {
    api_name: 'integral_list',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 导出报表
export async function exportReport(params: any): Promise<any> {
  const _params = {
    api_name: 'export_word',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params
  })
}

// 导出增长数据
export async function exportStatistics(params: any): Promise<any> {
  const _params = {
    api_name: 'export_statistics',
    ...params
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  })
}
