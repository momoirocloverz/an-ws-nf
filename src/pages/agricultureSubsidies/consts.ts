/* eslint-disable camelcase */
export const seasons = Object.freeze({
  '1': '春季',
  '2': '秋季',
  '3': '冬季',
});

export const ownershipTypes = Object.freeze({
  1: '个人',
  2: '合作社/公司',
});
export const eligibility = Object.freeze({
  1: '满足50亩',
  2: '不满50亩',
});

export const submissionStatus = Object.freeze({
  1: '已递交',
  2: '待递交',
});

export const paymentStatus = Object.freeze({
  0: '已递交',
  1: '退回',
  2: '成功',
});
// const adminType = Object.freeze({
//   1: '市管理员',
//   2: '镇管理员',
//   3: '村管理员',
// });
//
// const landStatus = Object.freeze({
//   1: '未领取',
//   2: '未公示',
//   3: '公示中',
//   4: '公示完成',
//   5: '街道审核通过未提交财政',
//   6: '街道审核通过已提交财政',
// });

// Authorization strings
export const USER_TYPES = Object.freeze({
  VILLAGE_OFFICIAL: 'SUBSIDY_VIEW_VILLAGE_OFFICIAL',
  TOWN_OFFICIAL: 'SUBSIDY_VIEW_TOWN_OFFICIAL',
  CITY_OFFICIAL: 'SUBSIDY_VIEW_CITY_OFFICIAL',
});

export const inspectionStatus = Object.freeze({
  0: '未复核',
  1: '已复核',
});

export const recordStatuses = Object.freeze({
  1: '待递交',
  2: '已递交',
  3: '被驳回',
});
// export const CLAIM_RECORD_TABLES : any = Object.freeze([
//   'INVALID',
//   // 村级
//   'PENDING_VALIDATION',
//   'POSTED',
//   'SUBMITTED',
//   'REJECTED',
//   'TRANSACTION_HISTORY',
//   // 镇级
//   'PENDING_APPROVAL',
//   'APPROVED',
//   // 市级
//   'PENDING_VIEW_ONLY',
//   'PENDING_APPROVAL_VIEW_ONLY',
//   'APPROVED_VIEW_ONLY',
// ].reduce((prev, curr, idx) => {
//   // eslint-disable-next-line no-param-reassign
//   prev[curr] = idx.toString();
//   return prev;
// }, {}));
export const CLAIM_RECORD_TABLES = Object.freeze({
  INVALID: '-1',
  // 村级
  PENDING_VALIDATION: '1',
  POSTED: '2',
  SUBMITTED: '3',
  REJECTED: '4',
  TRANSACTION_HISTORY: '5',
  // 镇级
  PENDING_VALIDATION_VIEW_ONLY: '1-1',
  TOWN_ANNOUNCEMENT: '13',
  PENDING_APPROVAL: '6',
  APPROVED: '7',
  FINANCIAL_BACK: '11',
  // 市级
  PENDING_VIEW_ONLY: '8',
  PENDING_APPROVAL_VIEW_ONLY: '9',
  APPROVED_VIEW_ONLY: '10',
  FINANCIAL_BACK_CITY: '12'
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
  EDIT: 10,

});

export const CLAIM_FORM_ACTION = Object.freeze({
  CREATE: 'create',
  MODIFY: 'modify',
});
// Base ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize','contractor',
//   'createdAt','phoneNumber','regionString','category','ownershipType','crops',
//   'contractedArea','year','season','amount', 'documents', 'actions'],
export const TABLE_COLUMNS = Object.freeze({
  // 村级
  [CLAIM_RECORD_TABLES.PENDING_VALIDATION]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'status', 'reasonForRejection', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.POSTED]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'postingClosingDate', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.SUBMITTED]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'status', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.REJECTED]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'dateOfRejection', 'reasonForRejection', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.TRANSACTION_HISTORY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type','paymentStatus',
    'contractedArea', 'year', 'season', 'amount',  'documents', 'actions'],
  // 镇级
  [CLAIM_RECORD_TABLES.PENDING_VALIDATION_VIEW_ONLY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'status', 'reasonForRejection', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.TOWN_ANNOUNCEMENT]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'postingClosingDate','createdAt','documents', 'actions'],
  [CLAIM_RECORD_TABLES.PENDING_APPROVAL]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'modRequestStatus', 'dateRequested',
    'reasonForModification', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.APPROVED]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor', 'payment_time',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'isEligible', 'paymentProcessor', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.FINANCIAL_BACK]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor', 'household_type',
  'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'financeReturnTime', 'financeReturnReason',
  'contractedArea', 'year', 'season', 'amount', 'isEligible', 'paymentProcessor', 'documents', 'actions'],
  // 市级
  [CLAIM_RECORD_TABLES.PENDING_VIEW_ONLY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type',
    'contractedArea', 'year', 'season', 'amount', 'postingClosingDate', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.PENDING_APPROVAL_VIEW_ONLY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type', 'postingClosingDate',
    'contractedArea', 'year', 'season', 'amount', 'modRequestStatus', 'dateRequested', 'reasonForModification', 'documents', 'actions'],
  [CLAIM_RECORD_TABLES.APPROVED_VIEW_ONLY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor',
    'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'household_type', 'payment_time',
    'contractedArea', 'year', 'season', 'amount', 'inspected',  'documents', 'actions'],
  [CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY]: ['region', 'id', 'cumulativeSize', 'cumulativeMetricSize', 'contractor', 'household_type',
  'createdAt', 'phoneNumber', 'regionString', 'category', 'ownershipType', 'crops', 'financeReturnTime', 'financeReturnReason',
  'contractedArea', 'year', 'season', 'amount', 'isEligible', 'paymentProcessor', 'documents', 'actions']
});
export const AVAILABLE_ACTIONS = Object.freeze({
  // 村级
  [CLAIM_RECORD_TABLES.PENDING_VALIDATION]: [RECORD_ACTIONS.VIEW_ENTITY, RECORD_ACTIONS.SKIP_THE_PUBLIC, RECORD_ACTIONS.MODIFY, RECORD_ACTIONS.REJECT, RECORD_ACTIONS.DELETE, RECORD_ACTIONS.EDIT],
  [CLAIM_RECORD_TABLES.POSTED]: [RECORD_ACTIONS.VIEW_ENTITY, RECORD_ACTIONS.RETRACT],
  [CLAIM_RECORD_TABLES.SUBMITTED]: [RECORD_ACTIONS.VIEW_ENTITY, RECORD_ACTIONS.REQUEST_MODIFICATION],
  [CLAIM_RECORD_TABLES.REJECTED]: [RECORD_ACTIONS.VIEW_ENTITY],
  [CLAIM_RECORD_TABLES.TRANSACTION_HISTORY]: [RECORD_ACTIONS.VIEW_ENTITY],
  // 镇级
  [CLAIM_RECORD_TABLES.PENDING_VALIDATION_VIEW_ONLY]: [RECORD_ACTIONS.VIEW_ENTITY], // 镇未公示
  [CLAIM_RECORD_TABLES.TOWN_ANNOUNCEMENT]: [RECORD_ACTIONS.VIEW_ENTITY], // 镇公式中
  [CLAIM_RECORD_TABLES.PENDING_APPROVAL]: [RECORD_ACTIONS.VIEW_ENTITY, RECORD_ACTIONS.REJECT, RECORD_ACTIONS.TOGGLE_INSPECTED],
  [CLAIM_RECORD_TABLES.APPROVED]: [RECORD_ACTIONS.VIEW_ENTITY],
  [CLAIM_RECORD_TABLES.FINANCIAL_BACK]: [RECORD_ACTIONS.REJECT, RECORD_ACTIONS.VIEW_ENTITY],
  // 市级
  [CLAIM_RECORD_TABLES.PENDING_VIEW_ONLY]: [RECORD_ACTIONS.VIEW_ENTITY],
  [CLAIM_RECORD_TABLES.PENDING_APPROVAL_VIEW_ONLY]: [RECORD_ACTIONS.VIEW_ENTITY],
  [CLAIM_RECORD_TABLES.APPROVED_VIEW_ONLY]: [RECORD_ACTIONS.VIEW_ENTITY],
  [CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY]: [RECORD_ACTIONS.VIEW_ENTITY]
});

export function hasAction(tableType, action) {
  return AVAILABLE_ACTIONS[tableType].includes(action);
}

export const isModificationRequested = Object.freeze({
  0: '未申请',
  1: '申请修改',
});

export const ROLE_IDS = REACT_APP_ENV === 'dev' ? Object.freeze({
  CITY_OFFICIAL: [6, 17,20], // 20  农机 市
  TOWN_OFFICIAL: [7, 18, 21], // 21 农机 镇
  VILLAGE_OFFICIAL: [8, 19],
}) : Object.freeze({
  CITY_OFFICIAL: [10, 17, 20],
  TOWN_OFFICIAL: [11, 18, 21],
  VILLAGE_OFFICIAL: [12, 19],
});

export const farmTypeOptions = Object.freeze([
  { value: '1', label: '规模户' },
  { value: '2', label: '散户' }
]);
export const farmCategory = Object.freeze([
  { value: '1', label: '种粮补贴' },
  { value: '2', label: '配方肥补贴' },
  { value: '3', label: '农机补贴' },
]);

// 农机购置补贴状态：1 已补贴  2 未补贴  3 已提交
export const subsidyType = Object.freeze({
  1: '已补贴',
  2: '未补贴',
  3: '已提交'
})

export const examineSubmit = Object.freeze({
  1: '镇级通过审核已递交',
  2: '镇级通过审核未递交'
})
