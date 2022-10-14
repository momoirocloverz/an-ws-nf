const DEV_KEY = 'XwGoxUFXpBcE31oD5GxdNBuEuDuVpyQB'; // 开发及预发环境公钥
const PROD_KEY = 'eLf11Zbepdlai7EBfjvSXBZ2fqNy3DXr'; // 生产环境公钥
const env = REACT_APP_ENV || 'dev';

// apiadmini
const ALL_API = '/farmapi/gateway';
const IMG_UPLOAD_API_NAME = 'upload_image_info';
const VIDEO_UPLOAD_API = 'upload_video_info';

import { getApiParams } from '@/utils/utils';

export const API_BASE = {
  version: '1.0.0',
  os: 'h5',
};

export {
  ALL_API,
  IMG_UPLOAD_API_NAME,
  VIDEO_UPLOAD_API
};
export const PUBLIC_KEY = (env.toString() === 'dev' || env.toString() === 'pre') ?  DEV_KEY : PROD_KEY;

// 图片上传链接
export const IMG_UPLOAD_URL =  () => {
  let _str = '';
  let _sign =  getApiParams({
    api_name: IMG_UPLOAD_API_NAME,
    ...API_BASE,
  }, PUBLIC_KEY);
  Object.keys(_sign).sort().forEach((el, i) => {
    if (i === 0) {
      _str += `${el}=${_sign[el]}`;
    } else {
      _str += `&${el}=${_sign[el]}`;
    }
  });
  return `${ALL_API}?${_str}`;
}

export const VIDEO_UPLOAD_URL = async () => {
  let _str = '';
  let _sign = await getApiParams({
    api_name: VIDEO_UPLOAD_API,
    ...API_BASE,
  }, PUBLIC_KEY);
  Object.keys(_sign).sort().forEach((el, i) => {
    if (i === 0) {
      _str += `${el}=${_sign[el]}`;
    } else {
      _str += `&${el}=${_sign[el]}`;
    }
  });
  return `${ALL_API}?${_str}`;
}

