import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, Divider, Card, Modal } from 'antd';
import Assigned from './components/assigned';
import Unassigned from './components/unassigned';
import styles from './index.less';

const { TabPane } = Tabs;

const Index: React.FC<{}> = props => {
  const [tabKey, setTabKey] = useState('1');

  const tabChange = (e: string) => {
    setTabKey(e);
  }

  const tablist = [
    {
      key: '1',
      tab: '已关联农户'
    },
    {
      key: '2',
      tab: '未关联农户'
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
        tabKey === '1' ? <Assigned /> : <Unassigned />
      }
    </PageHeaderWrapper>
  );
};

export default Index;
