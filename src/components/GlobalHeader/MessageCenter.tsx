import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React, { Component } from 'react';
import { history, ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';

class AvatarDropdown extends Component {

  render(): React.ReactNode {
    return (
      
    )
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
