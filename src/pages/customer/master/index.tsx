import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import Manager from './Manager';
import Approval from './Approval';
import styles from './index.less';


const Index: React.FC<{}> = props => {
  const [tabKey, setTabKey] =useState('1');

  const tabChange = (e: string) => {
    setTabKey(e);
  }

  const tablist = [
    {
      key: '1',
      tab: '专家管理'
    },
    {
      key: '2',
      tab: '专家审批'
    }
  ]

  return (
    <PageHeaderWrapper
      // tabProps={{
      //   size: 'large',
      //   tabBarGutter: 60,
      //   className: styles.tabs
      // }}
      // tabActiveKey={tabKey}
      // tabList={tablist}
      // onTabChange={tabChange}
    >
      {
        <Manager />
        // tabKey === '1' ? <Manager /> : <Approval />
      }

    </PageHeaderWrapper>
  );
};

export default Index;
