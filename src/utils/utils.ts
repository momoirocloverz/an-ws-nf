import { parse } from "querystring";
import pathRegexp from "path-to-regexp";
import { Route } from "@/models/connect";
import { API_BASE, PUBLIC_KEY } from "@/services/api";
// import CryptoJS from "crypto-js";
import accountInfo from "@/models/user";
import { hexMD5 } from "./md5";
import { JSEncrypt } from "jsencrypt";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split("?")[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string
): T | undefined => {
  const authority = router.find(
    ({ routes, path = "/" }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname))
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 处理 pro-table 组件默认字段与我们接口不一致的数据结构
interface paginationType {
  item_total: number;
  page: number;
  page_count: number;
  page_total: number;
}

interface dataType {
  code: number;
  data: any;
  pagination: paginationType;
}

export const tableDataHandle = (data: dataType) => {
  if (data.code === 0) {
    return {
      data: data.data.data,
      page: data.data.current_page,
      total: data.data.total,
      success: true
    };
  }
  return {
    data: [],
    page: null,
    total: 0,
    success: false
  };
};

interface pageType {
  current: number;
  pageSize: number;
}

export const paginationHandle = (data: pageType) => {
  const user = JSON.parse(localStorage.getItem("userInfo") as string);
  // console.log(user);
  Object.keys(data).forEach((item: any) => {
    if (data[item] === "") {
      delete data[item];
    }
  });
  const _data:any = {
    page: data.current,
    page_size: data.pageSize,
    city_id: user.city_id,
    town_id: user.town_id,
    village_id: user.village_id,
    ...data
  };
  delete _data.pageSize;
  delete _data.current;

  return _data;
};

export const getApiParams = (data: Object, key: string) => {
  let str = "";
  const obj:any = { ...data, ...API_BASE };
  Object.keys(obj)
    .sort()
    .forEach((el, i) => {
      if (i === 0) {
        str += `${el}=${obj[el]}`;
      } else {
        str += `&${el}=${obj[el]}`;
      }
    });
  const signData = hexMD5(str + key);
  obj.sign = signData;

  return obj;
};

// 数组拼接字符串
// @ts-ignore
export const arrToStr = (val: Array<any>) => {
  let _str = "";
  const _len = val.length;

  for (let i = 0; i < _len; i++) {
    if (i === _len - 1) {
      _str += `${val[i]}`;
      return _str;
    }
    _str += `${val[i]},`;
  }
};

// 获取存在本地的 token
export const getLocalToken = () => {
  const _token = localStorage.getItem("WSNF_TOKEN");
  return _token;
};

// 密码加密
export const passwordEncrypt = (val: string) => {
  const pass = hexMD5(val + PUBLIC_KEY);
  return pass;
};

// 去除特殊字符串
export const filterSpecialString = (str: string) => {
  const pattern = /[`~!@#$^&*-_()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
  return str.replace(pattern, "");
};

export const getAccount = () => accountInfo;

/**
 * 下载服务器上文件的方法
 * @param {String} stream 数据流
 * @param {String} name 文件名称
 * @param {String} type 后缀名称
 */
export function fileDownload(stream, name, type = "doc") {
  if (stream && name && type) {
    const blob = new Blob([stream], {
      type: "application/octet-stream"
    });
    // IE10+ 浏览器特殊处理
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, name);
    } else {
      const elink = document.createElement("a");
      elink.href = URL.createObjectURL(blob);
      elink.download = `${name}.${type}`;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    }
  }
}

export function mask(
  source: string,
  options?: {
    symbol?: string;
    tailLength?: number;
    headLength?: number;
    fixedLength?: number;
    // minLength?: number; // TODO
  }
) {
  if (!source) return source;
  const str = source.toString();
  const actualOptions = {
    symbol: options?.symbol ?? "*",
    tailLength: options?.tailLength ?? 4,
    headLength: options?.headLength,
    fixedLength: options?.fixedLength
  };
  // initial mask
  const tail = str.substring(Math.max(str.length - actualOptions.tailLength, 0));
  const initialMaskLen = Math.max(str.length, actualOptions.fixedLength ?? 0);
  let masked = tail.padStart(initialMaskLen, actualOptions.symbol);
  if (actualOptions.fixedLength) {
    masked = masked.slice(Math.max(initialMaskLen - actualOptions.fixedLength, 0));
  }
  // tail take precedence when there's not enough characters
  if (actualOptions.headLength) {
    const head = str.substr(0, actualOptions.headLength);
    // has available space for head && has enough characters for head
    if (masked.length > actualOptions.tailLength && str.length > actualOptions.tailLength) {
      const space = Math.max(
        Math.min(
          masked.length - actualOptions.tailLength,
          head.length,
          str.length - actualOptions.tailLength
        ),
        0
      );
      masked = `${head.slice(0, space)}${masked.slice(space)}`;
    }
  }
  return masked;
}

export function validatePassword(password: string): Promise<any> {
  if (!password || typeof password !== "string" || password.length < 8) {
    return Promise.reject(new Error("密码至少8位, 需要包括大写字母、小写字母、数字、特殊符号以上四种至少三种"));
  }
  if (/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,20}$/.test(password)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("密码需要包括大写字母、小写字母、数字、特殊符号以上四种至少三种"));
}

/**
 *
 * @param accAdd    加
 * @param accSubtr  减
 * @param accMul    乘
 * @param accDiv    chu
 * @returns
 */
export function accAdd(arg1, arg2) {
  let r1;
  let r2;
  let m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

export function accSubtr(arg1, arg2) {
  let r1;
  let r2;
  let m;
  let n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  // 动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
}

export function passwordEncryption(param, publicKey) {
  // param 需要加密的字符串   publicKey 后端给的公钥
  const encryptor = new JSEncrypt(); // 新建JSEncrypt对象
  encryptor.setPublicKey(publicKey); // 设置公钥
  const passwordEncryp = encryptor.encrypt(param); // 对密码进行加密
  return passwordEncryp;
}

// 格式化地区 如果村或者镇的值是0 就删除
export function formatArea(arr, userType = undefined) {
  let temp:any = [];
  if (arr?.length && arr.length === 3) {
    arr.map((item:any) => {
      if (item && item != "0") {
        temp.push(item);
      }
    });
  } else {
    temp = arr;
  }
  return temp;
}
/**
 * 格式化数字
 * @num 数字
 * @point 小数点位数 默认0
 * **/
export function formatNumber(num, point=0) {
  const number = Number(num);
  if(number.toString() === 'NaN' || !num){
    return 0;
  }else{
    let str = '1';
    for(let i=0; i<point;i++){
      str+='0'
    }
    const o = Number(str);
    return Math.round(num * o)/o;
  }
}
