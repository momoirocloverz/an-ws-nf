import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { secretLogin } from '@/services/secretLogin';
import styles from './index.less';
import { connect, history } from 'umi';

const LoginBridgePage = (props) => {
  const { location, login, dispatch, children } = props;
  localStorage.removeItem('WSNF_TOKEN');
  const initAction = async () => {
    if (location.query && location.query.secret) {
      const res = await secretLogin({
        secret: location.query.secret,
      });
      if (res && res.code === 0) {
        localStorage.setItem('userInfo', JSON.stringify(res.data.adminInfo));
        dispatch({
          type: 'login/saveAccountInfo',
          payload: res.data,
        });
        history.push('/index');
        if (!!res.data.tokeInfo.token) {
          localStorage.setItem('WSNF_TOKEN', res.data.tokeInfo.token);
        }
      } else {
        history.push('/user/login');
        message.error(res.msg);
      }
    }
  };
  useEffect(() => {
    initAction();
  }, []);
  return <div>加载中</div>;
};
export default connect(({ login }) => ({
  login,
}))(LoginBridgePage);
