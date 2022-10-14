import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Release from './components/Release';
import Reservation from './components/Reservation';
import Lease from './components/Lease';

const Index: React.FC<any> = () => {
  const [tabKey, setTabKey] = useState('1');

  const navList = [
    {
      key: '1',
      tab: '村宴厅管理'
    },
    {
      key: '2',
      tab: '租赁宴厅管理'
    },
    {
      key: '3',
      tab: '预定详情'
    }
  ]
  
  const tabChange = (e) => {
    setTabKey(e);
  }

  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs
      }}
      tabActiveKey={tabKey}
      tabList={navList}
      onTabChange={tabChange}
    >
      {tabKey === '1' ? <Release /> : tabKey === '2' ? <Lease /> : <Reservation />}
    </PageHeaderWrapper>
  );
};

export default Index;
