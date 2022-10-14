import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import LandList from '@/components/machineManagement/LandList';
import Machines from '@/components/machineManagement/Machines';
import styles from './index.less';

function MachineManagement() {
  const [selectedTable, setSelectedTable] = useState(['machines']);

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
          <Menu.Item key="machines">农机管理</Menu.Item>
          <Menu.Item key="list">耕地上报统计</Menu.Item>
        </Menu>
        { selectedTable[0] === 'machines' && (<Machines />) }
        { selectedTable[0] === 'list' && (<LandList />) }
      </div>
    </PageHeaderWrapper>
  );
}

export default MachineManagement;
