import React, { useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Modal } from 'antd';
import 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { ConnectState } from '@/models/connect';
import DashBoard from './dashboard/index.jsx';
// import styles from './Index.less';
import Cookies from 'js-cookie';
import { ROLE_IDS } from "@/pages/agricultureSubsidies/consts";
const { confirm } = Modal;

function Index({ user }) {
  useEffect(() => {
    if ([ROLE_IDS.VILLAGE_OFFICIAL, ROLE_IDS.TOWN_OFFICIAL, ROLE_IDS.CITY_OFFICIAL].indexOf(user.role_id) > -1) {
      history.replace('/agriculture-subsidies/farmland-map');
    }
    let openPasswordSafe = Number(Cookies.get('openPasswordSafe')) ?? '';
    console.log(openPasswordSafe, Object.keys(user).length, !user.is_complex_password, user, 'login_info');
    if(openPasswordSafe && Object.keys(user).length && !user.is_complex_password) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: '您的密码安全等级过低，请前往修改！',
        cancelText: '下次',
        okText: '前往修改',
        onOk() {
          Cookies.remove("openPasswordSafe");
          history.push('/settings/passwordInfo');
        },
        onCancel() {
          Cookies.remove("openPasswordSafe");
        },
      });
    }

  }, [user]);

  return (
    <PageHeaderWrapper>
      <DashBoard />
    </PageHeaderWrapper>
  );
}

export default connect(({ user }: ConnectState) => ({
  user: user.accountInfo,
}))(Index);
