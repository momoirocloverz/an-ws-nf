import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { ConnectState } from '@/models/connect';
import IntegralTypelist from './components/IntegralTypeList';
import FamilyIntegral from './components/FamilyIntegral';
import YearBreakDown from './components/YearBreakDown';

// import Group from './components/group';
// import Village from './components/village';
import styles from './index.less';

const { TabPane } = Tabs;

interface RoleIndexProps {
  accountInfo: any;
}

const Index: React.FC<RoleIndexProps> = (props) => {
  const [tabKey, setTabKey] = useState('1');
  const { accountInfo, userAuthButton } = props;
  // console.log(userAuthButton);

  const tabChange = (e: string) => {
    setTabKey(e);
  };

  useEffect(() => {}, []);

  const tablistOne = [
    {
      key: '1',
      tab: '家庭积分列表',
    },
    // {
    //   key: '2',
    //   tab: '打分项列表'
    // }
  ];

  const tablistTwo = [
    {
      key: '1',
      tab: '家庭积分列表',
    },
  ];

  if (userAuthButton && userAuthButton.length != 0) {
    userAuthButton.map((item) => {
      if (
        item.path == window.location.pathname &&
        item.permission.includes('SETTLEMENT_OVER_YEAR')
      ) {
        tablistOne.push({
          key: '2',
          tab: '历年积分结算',
        });
        tablistTwo.push({
          key: '2',
          tab: '历年积分结算',
        });
      }
    });
  }

  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs,
      }}
      tabActiveKey={tabKey}
      tabList={accountInfo.role_type === 3 ? tablistTwo : tablistOne}
      onTabChange={tabChange}
    >
      {/* tabKey === '2' ? <IntegralTypelist /> : */}
      {tabKey === '1' ? <FamilyIntegral /> : <YearBreakDown />}
    </PageHeaderWrapper>
  );
};

// export default Index;
export default connect(({ user }: ConnectState) => ({
  accountInfo: user.accountInfo,
  userAuthButton: user.userAuthButton,
}))(Index);
