import { Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, ConnectProps, Link } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import {
  BellOutlined
} from '@ant-design/icons';
import styles from './index.less';
import _ from 'lodash';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  accountInfo: any;
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, accountInfo } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {
        (accountInfo.role_type === 2 || accountInfo.role_type === 1) ? (
          <Link className={styles.message} to="/message">
            <span className={styles.messageIcon}>
              <BellOutlined style={{fontSize: '20px'}} />
              {
                (!_.isEmpty(accountInfo) && accountInfo.unread_num > 0) ? (
                  <span className={styles.messageNum}>
                    {accountInfo.unread_num}
                  </span>
                ) : null
              }
            </span>
            <span>消息中心</span>
          </Link>
        ) : null
      }
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  accountInfo: user.accountInfo,
}))(GlobalHeaderRight);
