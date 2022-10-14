//支付类型
export enum PAY_TYPE {
  PAYMENT_TYPE_RESERVE = 1,//定金支付
  PAYMENT_TYPE_AMOUNT = 2,//全款支付
}

//付款状态
export enum CONFIRM_TYPE {
  UN_CONFIRM = 1,//未确认
  CONFIRMED_RESERVE = 12,//已确认定金
  CONFIRMED_REMAIN = 22,//已确认尾款
  CONFIRMED_AMOUNT = 32,//已确认全款
  CANCEL = 3,//已取消
}

//生效状态
export enum EFFECT_TYPE {
  PAYMENT_INVALID = 0,//未生效
  PAYMENT_VALID = 1,//已生效
}
