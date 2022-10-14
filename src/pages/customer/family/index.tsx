import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { ConnectState } from '@/models/connect';
import Family from './components/family';
import Group from './components/group';
import Village from './components/village';
import styles from './index.less';

const { TabPane } = Tabs;

interface RoleIndexProps {
  chooseGroupList: any;
  accountInfo: any;
}

const Index: React.FC<RoleIndexProps> = props => {
  const [tabKey, setTabKey] = useState('1');
  const { chooseGroupList, accountInfo } = props;

  const tabChange = (e: string) => {
    setTabKey(e);
  }

  useEffect(() => {
  }, []);

  const tablistOne = [
    {
      key: '1',
      tab: '家庭'
    },
    {
      key: '2',
      tab: '分组'
    }
  ]

  const tablistTwo = [
    {
      key: '1',
      tab: '家庭'
    },
    {
      key: '2',
      tab: '分组'
    },
    {
      key: '3',
      tab: '行政村'
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
      tabList={accountInfo.role_type !== 3 ? tablistTwo : tablistOne}
      onTabChange={tabChange}
    >
      {
        tabKey === '1' ? <Family groupList={chooseGroupList} /> : tabKey === '2' ? <Group /> : <Village />
      }

    </PageHeaderWrapper>
  );
};

// export default Index;
export default connect(({ info, user }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  accountInfo: user.accountInfo,
}))(Index);
