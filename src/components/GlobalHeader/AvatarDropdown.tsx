import { LogoutOutlined, SettingOutlined, UserOutlined, CaretDownOutlined, } from '@ant-design/icons';
import { Avatar, Menu, Spin, notification } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { history, ConnectProps, connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  menu?: boolean;
  accountInfo?: any;
  dispatch: Dispatch;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      // localStorage.clear();
      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }
      notification.success({
        description: '退出成功!',
        message: '',
      });
      return;
    }

    history.push(`/settings/${key}`);
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/queryAccountInfo'
    });
    dispatch({
      type: 'info/queryFamilyList'
    })
    dispatch({
      type: 'info/queryAreaList'
    })
    dispatch({
      type: 'info/queryChooseGroupList'
    })
    dispatch({
      type: 'login/pubKey'
    })
  }

  render(): React.ReactNode {
    const {
      accountInfo,
      menu,
    } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        <Menu.Item key="personalInfo">
          <UserOutlined />
          编辑资料
        </Menu.Item>
        <Menu.Item key="passwordInfo">
          <SettingOutlined />
          修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return accountInfo ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={accountInfo.avatar_url} alt="avatar" />
          <span className={styles.name}>{accountInfo.user_name}</span>
          <span className={styles.box}><CaretDownOutlined /></span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList
}))(AvatarDropdown);
