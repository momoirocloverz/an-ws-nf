import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
import moment from 'moment';
// =============== 找问题/寻温暖管理 ===============
export function getComplains(params, asFile = undefined) {
  const data = getApiParams({
    api_name: 'warm_problem_list',
    problem: params.desc,
    start_time: params.dateRange?.[0] && moment(params.dateRange[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.dateRange?.[1] && moment(params.dateRange[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    is_export: asFile,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function confirm(id) {
  const data = getApiParams({
    api_name: 'is_warm_problem',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function reply(id, response) {
  const data = getApiParams({
    api_name: 'warm_problem_reply',
    id,
    reply_text: response,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
