import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Tabs, Button, message, Divider, Card, Modal } from 'antd';
import { roleType } from '@/models/system';
import { ConnectState } from '@/models/connect';
// import Family from './components/family';
// import Group from './components/group';
// import Village from './components/village';
import Class from './components/class'
import Category from './components/category'
import styles from './index.less';

const { TabPane } = Tabs;

const Index: React.FC<{}> = props => {
  const [tabKey, setTabKey] = useState('1');

  const tabChange = (e: string) => {
    setTabKey(e);
  }

  useEffect(() => {
    
  }, []);

  const tablist = [
    {
      key: '1',
      tab: '课程管理'
    },
    {
      key: '2',
      tab: '类目管理'
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
      tabList={tablist}
      onTabChange={tabChange}
    >
      {
        tabKey === '1' ? <Class /> : <Category />
      }

    </PageHeaderWrapper>
  );
};

// export default Index;
export default connect(({ info }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
}))(Index);
