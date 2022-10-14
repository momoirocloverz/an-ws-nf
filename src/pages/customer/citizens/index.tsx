import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { Menu } from 'antd';
import styles from './index.less';

import List from './components/list';
import Config from './components/config';


function Citizens() {
  const [selectedTable, setSelectedTable] = useState(['list']);

  return (
    <PageHeaderWrapper>
      <div className={styles.page}>
        <Menu
          mode="horizontal"
          selectedKeys={selectedTable}
          onSelect={({ selectedKeys }) => {
            setSelectedTable(selectedKeys);
          }}
        >
          <Menu.Item key="list">市民列表</Menu.Item>
          <Menu.Item key="config">市民类型配置</Menu.Item>
        </Menu>
        { selectedTable[0] === 'list' && (<List />) }
        { selectedTable[0] === 'config' && (<Config />) }
      </div>
    </PageHeaderWrapper>
  );
};

export default Citizens;
