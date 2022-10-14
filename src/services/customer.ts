import request from "@/utils/request";
import { ALL_API } from "./api";
import { getApiParams } from "@/utils/utils";
import { PUBLIC_KEY } from "@/services/api";

// 已关联农户
export async function getAllocatedFarmerList(params: any): Promise<any> {
  const _params = {
    api_name: "get_allocated_farmer_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// export async function getAreaChange(params: any): Promise<any> {
//   const _params = {
//     api_name: 'get_family_info_list',
//     ...params,
//   };
//   const data = getApiParams(_params, PUBLIC_KEY);
//   return request(ALL_API, {
//     method: 'POST',
//     data,
//   });
// }
// 获取村下面的小组数据
export async function getGroupChange(params: any): Promise<any> {
  const _params = {
    api_name: "family_group",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取小组下面家庭门牌号
export async function getDoorplateChange(params: any): Promise<any> {
  const _params = {
    api_name: "group_doorplate",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 未分配农户
export async function getUndistributedFarmerList(params: any): Promise<any> {
  const _params = {
    api_name: "get_undistributed_farmer_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 禁用农户账号
export async function setDisableFarmer(params: any): Promise<any> {
  const _params = {
    api_name: "disable_farmer_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 回复农户账号
export async function setEnableFarmer(params: any): Promise<any> {
  const _params = {
    api_name: "normal_farmer_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 选择家庭
export async function getFamilyList(params: any): Promise<any> {
  const _params = {
    api_name: "choose_family_list",

    ...params
  };
  /**
   * @params 兼容代码
   * **/
  if (!_params.city_id) {
    _params.city_id = "1";
    _params.town_id = "1";
    _params.village_id = "1";
  }
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑农户家庭
export async function setPhoto(params: any): Promise<any> {
  const _params = {
    api_name: "photo_permission",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑农户家庭
export async function setIsEnvInspector(params: any): Promise<any> {
  const _params = {
    api_name: "inspect_permission",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 家宴权限
export async function setFamilyParty(params: any): Promise<any> {
  const _params = {
    api_name: "inspect_family_lease",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editFarmerFamily(params: any): Promise<any> {
  const _params = {
    api_name: "edit_farmer",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 更新农户归属地
export async function resetFarmerPlace(params: any): Promise<any> {
  const _params = {
    api_name: "update_farmer_possession",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editOnlyFarmerFamily(params: any): Promise<any> {
  const _params = {
    api_name: "only_edit_farmer_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editAreaFamily(params: any): Promise<any> {
  const _params = {
    api_name: "edit_farmer_area_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取家庭列表
export async function getFamilyGroupList(params: any): Promise<any> {
  const _params = {
    api_name: "get_family_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 新增家庭
export async function addFamilyGroup(params: any): Promise<any> {
  const _params = {
    api_name: "add_family_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除家庭
export async function deleteFamilyGroup(params: any): Promise<any> {
  const _params = {
    api_name: "delete_family_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑家庭
export async function editFamilyGroup(params: any): Promise<any> {
  const _params = {
    api_name: "edit_family_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取家庭信息
export async function getFamilyGroupInfo(params: any): Promise<any> {
  const _params = {
    api_name: "get_family_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取分组列表
export async function getGroupList(params: any): Promise<any> {
  const _params = {
    api_name: "get_group_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 新增分组
export async function addGroup(params: any): Promise<any> {
  const _params = {
    api_name: "add_group_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除分组
export async function deleteGroup(params: any): Promise<any> {
  const _params = {
    api_name: "delete_group_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取分组信息
export async function getGroupInfo(params: any): Promise<any> {
  const _params = {
    api_name: "get_group_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑分组
export async function editGroup(params: any): Promise<any> {
  const _params = {
    api_name: "edit_group_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 分组下选择
export async function getChooseGroupList(params: any): Promise<any> {
  const _params = {
    api_name: "choose_group_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 专家管理
export async function getMasterManList(params: any): Promise<any> {
  const _params = {
    api_name: "get_expert_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除专家
export async function deleteManagerItem(params: any): Promise<any> {
  const _params = {
    api_name: "delete_expert_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 新增专家
export async function addMaster(params: any): Promise<any> {
  const _params = {
    api_name: "add_expert_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑专家
export async function editMaster(params: any): Promise<any> {
  const _params = {
    api_name: "edit_expert_info",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 专家类型选择
export async function chooseMasterTypeList(params: any): Promise<any> {
  const _params = {
    api_name: "expert_type_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 专家审批列表
export async function getMasterApproveList(params: any): Promise<any> {
  const _params = {
    api_name: "get_expert_approve_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 审核操作
export async function setAudit(params: any): Promise<any> {
  const _params = {
    api_name: "set_expert_audit",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取所有区域信息
export async function getAreaList(params: any): Promise<any> {
  const _params = {
    api_name: "get_area_list",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取设置的切换村权限
export async function getVillageAuth(params: any): Promise<any> {
  const _params = {
    api_name: "get_village_auth",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 设置农户切换村权限
export async function setVillageAuth(params: any): Promise<any> {
  const _params = {
    api_name: "set_village_auth",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农户详情
export async function getFarmerDetail(params: any): Promise<any> {
  const _params = {
    api_name: "farmer_detail",
    ...params
  };
  const data = getApiParams(_params, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}
