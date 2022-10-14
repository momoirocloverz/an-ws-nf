import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { hexMD5 } from '../utils/md5';
import { PUBLIC_KEY } from '@/services/api';

export async function secretLogin(data: any): Promise<any> {
  const _params = {
    api_name: 'open_user_token',
    ...data,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

export async function sendSms(data: any): Promise<any> {
  const _params = {
    api_name: 'login_send_sms',
    ...data,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

export async function smsLogin(data: any): Promise<any> {
  const _params = {
    api_name: 'login',
    version: '1.0.0',
    sign: '',
    os: 'h5',
    ...data,
  };
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}

export async function afterCodeLogin(data: any): Promise<any> {
  const _params = {
    api_name: 'login',
    version: '1.0.0',
    sign: '',
    os: 'h5',
    ...data,
  };
  let password = data.password;
  if (password) {
    password = hexMD5(password + PUBLIC_KEY);
    data.password = password;
    _params.password = password;
  }
  return request(ALL_API, {
    method: 'POST',
    data: _params,
  });
}
// 获取公钥
export async function getPublicKey(data: any): Promise<any> {
  const params = {
    api_name: 'get_public_key',
    ...data,
  };
  return request(ALL_API, {
    method: 'POST',
    data: params,
  });
}
