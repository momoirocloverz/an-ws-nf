import request from "@/utils/request";
import { getApiParams } from "@/utils/utils";
import { ALL_API, PUBLIC_KEY } from "@/services/api";
// import moment from "moment";
// import { history } from "umi";

// 农机申报管理--镇级--申报列表
export function townSubsidyMachineDeclare(params) {
  const data = getApiParams(
    {
      api_name: "town_subsidy_machine_declare",
      ...params
    },
    PUBLIC_KEY
  );
  let obj:any = {
    method: "POST",
    data
  };
  if (params.is_export == 1) {
    obj.responseType = "blob";
  }
  return request(ALL_API, obj);
}

// 农机申报管理--镇级--申报列表--统计
export function townSubsidyMachineDeclareStatistics(params) {
  const data = getApiParams(
    {
      api_name: "town_subsidy_machine_declare_statistics",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--镇级--申报驳回列表
export function townSubsidyMachineDeclareReject(params) {
  const data = getApiParams(
    {
      api_name: "town_subsidy_machine_declare_reject",
      ...params
    },
    PUBLIC_KEY
  );
  let obj:any = {
    method: "POST",
    data
  };
  if (params.is_export == 1) {
    obj.responseType = "blob";
  }
  return request(ALL_API, obj);
}

// 农机申报管理--申报获取终端编号列表
export function getTerminalNumberInfo(params) {
  const data = getApiParams(
    {
      api_name: "get_terminal_number_info",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--镇级--申报列表--申报 通过
export function townSubsidyMachineDeclareAdopt(params) {
  const data = getApiParams(
    {
      api_name: "town_subsidy_machine_declare_adopt",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--镇级--申报列表--申报驳回
export function townSubsidyMachineDeclareRejectOperation(params) {
  const data = getApiParams(
    {
      api_name: "town_subsidy_machine_declare_reject_operation",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报列表
export function citySubsidyMachineDeclare(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare",
      ...params
    },
    PUBLIC_KEY
  );
  let obj:any = {
    method: "POST",
    data
  };
  if (params.is_export == 1) {
    obj.responseType = "blob";
  }
  return request(ALL_API, obj);
}

// 农机申报管理--市级--申报列表--统计
export function citySubsidyMachineDeclareStatistics(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_statistics",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报打款列表
export function citySubsidyMachineDeclarePayment(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_payment",
      ...params
    },
    PUBLIC_KEY
  );
  let obj:any = {
    method: "POST",
    data
  };
  if (params.is_export == 1) {
    obj.responseType = "blob";
  }
  return request(ALL_API, obj);
}

// 农机申报管理--市级--申报打款列表
export function citySubsidyMachineDeclarePaymentStatistics(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_payment_statistics",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报公示
export function subsidyMachineDeclarePublicity(params) {
  const data = getApiParams(
    {
      api_name: "subsidy_machine_declare_publicity",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--批量递交财政操作
export function citySubsidyMachineDeclareSubmitOperation(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_submit_operation",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报取消公示/驳回
export function subsidyMachineDeclareCancelPublicity(params) {
  const data = getApiParams(
    {
      api_name: "subsidy_machine_declare_cancel_publicity",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--财政退回列表驳回--追加补贴--驳回到未公示
export function citySubsidyMachineDeclareReturnTown(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_return_town",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--财政退回列表驳回--驳回到待审核状态
export function citySubsidyMachineDeclareReturn(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_return",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报取消公示/驳回
export function citySubsidyMachineDeclareDelete(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_delete",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报取消公示/驳回
export function citySubsidyMachineDeclareReject(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_reject",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机申报管理--市级--申报记录生成word
export function citySubsidyMachineDeclareMakeWord(params) {
  const data = getApiParams(
    {
      api_name: "city_subsidy_machine_declare_make_word",
      ...params
    },
    PUBLIC_KEY
  );
  let obj:any = {
    method: "POST",
    data,
  };
  if (params.is_export == 1) {
    obj.responseType = "blob";
  }
  return request(ALL_API, obj);
}

