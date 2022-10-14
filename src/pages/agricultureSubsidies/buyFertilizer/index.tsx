import React, { useState } from 'react';
import { Menu } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RealName from './modules/realname';
import Condition from './modules/condition';

function Index() {
  const [selectedTable, setSelectedTable] = useState(['realname']);

  return (
    <PageHeaderWrapper>
      <Menu
        mode="horizontal"
        selectedKeys={selectedTable}
        onSelect={({ selectedKeys }) => {
          setSelectedTable(selectedKeys);
        }}
      >
        <Menu.Item key="realname">实名制购肥管理</Menu.Item>
        <Menu.Item key="condition">条件配置管理</Menu.Item>
      </Menu>
      {selectedTable[0] === 'realname' && <RealName key="realname" />}
      {selectedTable[0] === 'condition' && <Condition key="condition" />}
    </PageHeaderWrapper>
  );
}

export default Index;
