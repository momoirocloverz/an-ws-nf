import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, PUBLIC_KEY } from '@/services/api';
// =============== 村干部 ===============
export function getGovEmployees(params) {
  const data = getApiParams({
    api_name: 'village_cadres_list',
    name: params.name,
    mobile: params.phoneNumber,
    city_id: params.region?.[0] || undefined,
    town_id: params.region?.[1] || undefined,
    village_id: params.region?.[2] || undefined,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createGovEmployee(params) {
  const data = getApiParams({
    api_name: 'add_village_cadres',
    name: params.name,
    mobile: params.phoneNumber,
    job: params.position,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyGovEmployee(params) {
  const data = getApiParams({
    api_name: 'edit_village_cadres',
    id: params.id,
    name: params.name,
    mobile: params.phoneNumber,
    job: params.position,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deleteGovEmployee(id) {
  const data = getApiParams({
    api_name: 'del_village_cadres',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// =============== 党员 ===============
export function getPartyMembers(params) {
  const data = getApiParams({
    api_name: 'party_increase_list',
    name: params.name,
    mobile: params.phoneNumber,
    city_id: params.region?.[0] || undefined,
    town_id: params.region?.[1] || undefined,
    village_id: params.region?.[2] || undefined,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createPartyMember(params) {
  const data = getApiParams({
    api_name: 'add_party_increase',
    name: params.name,
    mobile: params.phoneNumber,
    date: params.registrationDate.startOf('day').format('YYYY-MM-DD'),
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyPartyMember(params) {
  const data = getApiParams({
    api_name: 'edit_party_increase',
    id: params.id,
    name: params.name,
    mobile: params.phoneNumber,
    date: params.registrationDate.startOf('day').format('YYYY-MM-DD'),
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deletePartyMember(id) {
  const data = getApiParams({
    api_name: 'del_party_increase',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =============== 家园 ===============
export function getHometowns(params) {
  const data = getApiParams({
    api_name: 'home_info_list',
    city_id: params.region?.[0] || undefined,
    town_id: params.region?.[1] || undefined,
    village_id: params.region?.[2] || undefined,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createHometown(params) {
  const data = getApiParams({
    api_name: 'add_home_info',
    image: params.poster, // id
    introduce: params.desc,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyHometown(params) {
  const data = getApiParams({
    api_name: 'edit_home_info',
    id: params.id,
    image: params.poster, // id
    introduce: params.desc,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deleteHometown(id) {
  const data = getApiParams({
    api_name: 'del_home_info',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =================================
export function getOverview(params) {
  const data = getApiParams({
    api_name: 'village_appearance_list',
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createOverview(params) {
  const data = getApiParams({
    api_name: 'add_village_appearance',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyOverview(params) {
  const data = getApiParams({
    api_name: 'edit_village_appearance',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deleteOverview(id) {
  const data = getApiParams({
    api_name: 'del_village_appearance',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
// =================================
export function getGruppenfuhrers(params) {
  const data = getApiParams({
    api_name: 'team_leader_grid_overview_list',
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createGruppenfuhrer(params) {
  const data = getApiParams({
    api_name: 'add_team_leader_grid_overview',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyGruppenfuhrer(params) {
  const data = getApiParams({
    api_name: 'edit_team_leader_grid_overview',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deleteGruppenfuhrer(id) {
  const data = getApiParams({
    api_name: 'del_team_leader_grid_overview',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

// =================================
export function getOthers(params) {
  const data = getApiParams({
    api_name: 'village_other_list',
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function createOthers(params) {
  const data = getApiParams({
    api_name: 'add_village_other',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function modifyOthers(params) {
  const data = getApiParams({
    api_name: 'edit_village_other',
    ...params,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export function deleteOthers(id) {
  const data = getApiParams({
    api_name: 'del_village_other',
    id,
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
