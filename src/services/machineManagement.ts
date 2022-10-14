import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
import moment from "moment";

export function getMachines(params) {
  const data = getApiParams({
    api_name: 'farm_machinery_list',
    group_name: params.group,
    machine_type: params.type,
    owner_phone: params.phoneNumber,
    owner_name: params.name,
    terminal_code: params.number,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function exportMachines(params) {
  const data = getApiParams({
    api_name: 'export_farm_machinery',
    group_name: params.group,
    machine_type: params.type,
    owner_phone: params.phoneNumber,
    owner_name: params.name,
    terminal_code: params.number,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function getLandList(params) {
  const data = getApiParams({
    api_name: 'reported_record_list',
    name: params.name,
    mobile: params.phoneNumber,
    start_at: params.date?.[0] && moment(params.date?.[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_at: params.date?.[1] && moment(params.date?.[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function exportLandList(params) {
  const data = getApiParams({
    api_name: 'export_reported_record',
    name: params.name,
    mobile: params.phoneNumber,
    start_at: params.date?.[0] && moment(params.date?.[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_at: params.date?.[1] && moment(params.date?.[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function removeLandEntry(id) {
  const data = getApiParams({
    api_name: 'delete_reported_record',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
