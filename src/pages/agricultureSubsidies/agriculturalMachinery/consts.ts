/* eslint-disable camelcase */
export const seasons = Object.freeze({
  "1": "春季",
  "2": "秋季"
});
export const toolEnum = Object.freeze({
  0: "全部",
  1: "拖拉机",
  2: "插秧机",
  3: "稻麦收割机",
  4: "植保机",
  5: "穴直播",
  6: "装载机",
  7: "水稻插秧机",
  8: "秧苗移栽机",
  9: "自走式喷杆喷雾机",
  10: "旋耕播种机",
  11: "育秧盘",
  12: "植保无人驾驶航空器",
  13: "热风炉",
  14: "打（压）捆机",
  15: "履带式拖拉机",
  16: "谷物烘干机",
  17: "轮式拖拉机",
  18: "农业用北斗终端及辅助驾驶系统",
  19: "增氧机",
  20: "开沟机",
  21: "微耕机",
  22: "首台套机械",
  23: "自动平衡装置",
  24: "水稻侧深施肥装置",
  25: "北斗系统",
  26: "施肥机",
  27: "旋耕机",
  28: "水稻直播机",
  29: "田园管理机",
  30: "秧盘播种成套设备",
  31: "秸秆粉碎还田机",
  32: "筑埂机",
  33: "自走履带式谷物联合收割机",
  34: "无人机驾驶系统",
  35: "育秧中心",
  36: "育秧流水线"
});
export const ownershipTypes = Object.freeze({
  1: "个人",
  2: "合作社/公司"
});
export const eligibility = Object.freeze({
  1: "满足50亩",
  2: "不满50亩"
});

export const submissionStatus = Object.freeze({
  1: "已递交",
  2: "待递交"
});

export const paymentStatus = Object.freeze({
  0: "已递交",
  1: "失败",
  2: "成功"
});

// Authorization strings
export const USER_TYPES = Object.freeze({
  VILLAGE_OFFICIAL: "SUBSIDY_VIEW_VILLAGE_OFFICIAL",
  TOWN_OFFICIAL: "SUBSIDY_VIEW_TOWN_OFFICIAL",
  CITY_OFFICIAL: "SUBSIDY_VIEW_CITY_OFFICIAL"
});

export const inspectionStatus = Object.freeze({
  0: "未复核",
  1: "已复核"
});

export const recordStatuses = Object.freeze({
  1: "待递交",
  2: "已递交",
  3: "被驳回"
});

export const RECORD_ACTIONS = Object.freeze({
  VIEW_ENTITY: 1,
  MODIFY: 2,
  REJECT: 3,
  DELETE: 4,
  REQUEST_MODIFICATION: 5,
  APPROVE: 6,
  RETRACT: 7,
  TOGGLE_INSPECTED: 8,
  SKIP_THE_PUBLIC: 9,
  EDIT: 10

});

export const CLAIM_FORM_ACTION = Object.freeze({
  CREATE: "create",
  MODIFY: "modify"
});


export const isModificationRequested = Object.freeze({
  0: "未申请",
  1: "申请修改"
});


// 农机购置补贴状态：1 已补贴  2 未补贴  3 已提交
export const subsidyType = Object.freeze({
  1: "已补贴",
  2: "未补贴",
  3: "已提交"
});
