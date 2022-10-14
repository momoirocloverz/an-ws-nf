import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { hexMD5 } from '../utils/md5';
import { PUBLIC_KEY } from '@/services/api';

export interface LoginParamsType {
  user_name: string;
  password: string;
  mobile?: string;
  captcha?: string;
  key: string;
  sign_password: string;
}

interface UserLoginType {
  user_name: string;
  password: string;
  captcha: string;
  key: string;
  sign_password: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function userLogin(params: UserLoginType) {
  const addApiName = { 
    ...params, 
    api_name: 'login' 
  };
  let password = addApiName.password;
  if (password) {
    addApiName.password = hexMD5(password + PUBLIC_KEY);
  }
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function loginCode(params) {
  const addApiName = {
    api_name: 'login_code',
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function logout() {
  const addApiName = {
    api_name: 'login_out'
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}
