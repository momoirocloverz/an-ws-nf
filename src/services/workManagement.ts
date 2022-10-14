import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
// =============== 劳务管理 ===============
export function getTempJobs(params) {
  const data = getApiParams({
    api_name: 'labor_list',
    title: params.title,
    type: params.status,
    start_time: params.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function createTempJob(params) {
  const data = getApiParams({
    api_name: 'add_labor',
    title: params.title,
    // image: params.poster,
    start_time: params.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    address: params.address,
    demand: params.requirements,
    frequency: params.checkInType,
    rest_time: params.breakLength || 0,
    // price: params.rate,
    interpret: params.notes,
    user_id: params.supervisor,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyTempJob(params) {
  const data = getApiParams({
    api_name: 'edit_labor',
    id: params.id,
    title: params.title,
    // image: params.poster,
    demand: params.requirements,
    frequency: params.checkInType,
    rest_time: params.breakLength || 0,
    start_time: params.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    end_time: params.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    address: params.address,
    price: params.rate,
    interpret: params.notes,
    user_id: params.supervisor,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function removeTempJob(id) {
  const data = getApiParams({
    api_name: 'del_labor',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function getTempJobDetails(params, asFile: undefined | number = undefined) {
  const data = getApiParams({
    api_name: 'get_labor_user',
    name: params.name,
    date: params.date,
    identity_card: params.idNumber,
    manage_id: params.jobId,
    is_export: asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// =============== 劳务人员管理 ===============
export function getTempWorkers(params, asFile: undefined | number = undefined) {
  const data = getApiParams({
    api_name: 'labor_user_list',
    name: params.name,
    identity_card: params.idNumber,
    profession_id: params.jobType,
    is_export: asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function createTempWorker(params) {
  const data = getApiParams({
    api_name: 'add_labor_user',
    name: params.name,
    phone: params.phoneNumber,
    identity_card: params.idNumber,
    sex: params.gender,
    birthday: params.dob && params.dob.format('YYYY-MM-DD'),
    profession_id: params.jobType,
    address: params.address,
    interpret: params.notes,
    bank_deposit: params.bankName,
    bank_card: params.bankAccount,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyTempWorker(params) {
  const data = getApiParams({
    api_name: 'edit_labor_user',
    id: params.id,
    name: params.name,
    phone: params.phoneNumber,
    identity_card: params.idNumber,
    sex: params.gender,
    birthday: params.dob && params.dob.format('YYYY-MM-DD'),
    profession_id: params.jobType,
    address: params.address,
    interpret: params.notes,
    bank_deposit: params.bankName,
    bank_card: params.bankAccount,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function removeTempWorker(id) {
  const data = getApiParams({
    api_name: 'del_labor_user',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function getSupervisors(region, name = undefined) {
  const data = getApiParams({
    api_name: 'get_allocated_farmer_list',
    farmer: name,
    city_id: region?.[0],
    town_id: region?.[1],
    village_id: region?.[2],
    page_size: Number.MAX_SAFE_INTEGER,
    page: 1,
    allot: 1,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function getClockingDetails(jobId: number, workerId: number, date: string, pageNum = undefined, pageSize = undefined) {
  const data = getApiParams({
    api_name: 'get_labor_user_info',
    user_id: workerId,
    manage_id: jobId,
    date: date,
    page: pageNum,
    page_size: pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =============== 工种管理 ===============
export function getJobTypes(params) {
  const data = getApiParams({
    api_name: 'profession_list',
    profession_name: params.name,
    sex: params.gender,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function createJobType(params) {
  const data = getApiParams({
    api_name: 'add_profession',
    profession_name: params.name,
    profession_info: params.jobDesc,
    standard_info: params.rateDesc,
    sex: params.gender,
    price: params.rate,
    interpret: params.notes,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function modifyJobType(params) {
  const data = getApiParams({
    api_name: 'edit_profession',
    id: params.id,
    profession_name: params.name,
    profession_info: params.jobDesc,
    standard_info: params.rateDesc,
    sex: params.gender,
    price: params.rate,
    interpret: params.notes,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
export function removeJobType(id) {
  const data = getApiParams({
    api_name: 'del_profession',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
