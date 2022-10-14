import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import TempJobs from '@/components/workManagement/TempJobs';
import TempWorkers from '@/components/workManagement/TempWorkers';
import JobTypes from '@/components/workManagement/JobTypes';
import styles from './index.less';

function WorkManagement() {
  const [selectedTable, setSelectedTable] = useState(['jobs']);

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
          <Menu.Item key="jobs">劳务管理</Menu.Item>
          <Menu.Item key="workers">劳务人员管理</Menu.Item>
          <Menu.Item key="jobTypes">工种管理</Menu.Item>
        </Menu>
        { selectedTable[0] === 'jobs' && (<TempJobs />) }
        { selectedTable[0] === 'workers' && (<TempWorkers />) }
        { selectedTable[0] === 'jobTypes' && (<JobTypes />) }
      </div>
    </PageHeaderWrapper>
  );
}

export default WorkManagement;
