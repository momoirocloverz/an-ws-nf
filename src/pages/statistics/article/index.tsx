import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { ConnectState } from '@/models/connect';
// import Family from './components/family';
// import Group from './components/group';
// import Village from './components/village';
import Issue from './issue';
import Click from './click';
import styles from './style.less';

interface RoleIndexProps {
  chooseGroupList: any;
  accountInfo: any;
}

const Index: React.FC<RoleIndexProps> = props => {
  const [tabKey, setTabKey] = useState('1');

  const tabChange = (e: string) => {
    setTabKey(e);
  }

  useEffect(() => {
  }, []);

  const tabList = [
    {
      key: '1',
      tab: '发布趋势统计'
    },
    {
      key: '2',
      tab: '文章点击统计'
    }
  ]

  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs
      }}
      tabActiveKey={tabKey}
      tabList={tabList}
      onTabChange={tabChange}
    >
      {
        tabKey === '1' ? <Issue /> : <Click />
      }

    </PageHeaderWrapper>
  );
};

// export default Index;
export default connect(({ info, user }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  accountInfo: user.accountInfo,
}))(Index);
