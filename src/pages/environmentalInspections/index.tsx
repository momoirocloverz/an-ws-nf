import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import Inspections from '@/components/environmentalInspections/Inspections';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Items from '@/components/environmentalInspections/Items';
import styles from '../workManagement/index.less';

function EnvironmentalInspections({ regionTree, user }) {
  const [selectedTable, setSelectedTable] = useState<string[]>(['inspections']);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (user && regionTree.length > 0) {
      setInitialized(true);
    }
  }, [user, regionTree]);

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
          <Menu.Item key="inspections">检查列表</Menu.Item>
          <Menu.Item key="items">问题类型配置</Menu.Item>
        </Menu>
        { initialized && selectedTable[0] === 'inspections' && (<Inspections regionTree={regionTree} user={user} />) }
        { initialized && selectedTable[0] === 'items' && (<Items />) }
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  regionTree: info.areaList,
}))(EnvironmentalInspections);
