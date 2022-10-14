import request from '@/utils/request';
import { ALL_API } from './api';

// 首页农户积分提问供需消息统计
export async function getIndexStatistics(params: any): Promise<any> {
  const _params = {
    api_name: 'index_statistics',
    ...params,
    city_id: params.city_id || undefined,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 活跃农户，积分趋势，供需趋势，问答趋势 折线图2020
export async function getIndexZigzag(params: any): Promise<any> {
  const _params = {
    api_name: 'index_zigzag',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 积分排行数据
export async function integralList(params: any): Promise<any> {
  const _params = {
    api_name: 'index_integral_rank',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 福利兑换统计列表
export async function exchangeList(params: any): Promise<any> {
  const _params = {
    api_name: 'product_stat',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 某个村兑换商品统计图
export async function exchangeChart(params: any): Promise<any> {
  const _params = {
    api_name: 'product_chart',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 打分项统计列表
export async function integralTypeList(params: any): Promise<any> {
  const _params = {
    api_name: 'integral_item_stat',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 某个村打分项统计图
export async function integralchart(params: any): Promise<any> {
  const _params = {
    api_name: 'integral_item_chart',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 文章点击统计列表
export async function articleClick(params: any): Promise<any> {
  const _params = {
    api_name: 'article_view',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 文章发布统计
export async function articleIssue(params: any): Promise<any> {
  const _params = {
    api_name: 'publish_stat',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 村事共商
export async function getVoteList(params: any): Promise<any> {
  const _params = {
    api_name: 'vote_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 参与人分类列表
export async function votePartakeList(params: any): Promise<any> {
  const _params = {
    api_name: 'vote_partake_list',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 删除参与人分类列表
export async function delVotePartake(params: any): Promise<any> {
  const _params = {
    api_name: 'del_vote_partake',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 添加参与人分类列表
export async function addVotePartake(params: any): Promise<any> {
  const _params = {
    api_name: 'add_vote_partake',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 添加参与人分类列表
export async function editVotePartake(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_vote_partake',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

// 获取有家庭的用户信息
export async function getHaveFamilyUsersInfo(params: any): Promise<any> {
  const _params = {
    api_name: 'get_have_family_users_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 添加民主投票
export async function addVote(params: any): Promise<any> {
  const _params = {
    api_name: 'add_vote',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 获取投票详情
export async function getVoteInfo(params: any): Promise<any> {
  const _params = {
    api_name: 'get_vote_info',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 编辑民主投票
export async function editVote(params: any): Promise<any> {
  const _params = {
    api_name: 'edit_vote',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 删除民主投票
export async function delVote(params: any): Promise<any> {
  const _params = {
    api_name: 'del_vote',
    ...params,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
