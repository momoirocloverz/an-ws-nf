import React, { useState } from "react";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from "antd";
import AreaStats from './index'
import MainStats from './mainStats'

export default function PreIndex() {
  const [selectedTable, setSelectedTable] = useState(["1"]);
  return (
    <PageHeaderWrapper>
      <Menu
        mode="horizontal"
        selectedKeys={selectedTable}
        onSelect={({ selectedKeys }) => {
          setSelectedTable(selectedKeys);
        }}
      >
        <Menu.Item key="1">按地区统计</Menu.Item>
        <Menu.Item key="2">按主体统计</Menu.Item>
      </Menu>
      {selectedTable[0] === '1' && <AreaStats/>}
      {selectedTable[0] === '2' && <MainStats/>}
    </PageHeaderWrapper>
  )
}
