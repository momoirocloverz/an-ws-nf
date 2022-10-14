import React, { useState } from "react";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "@@/plugin-dva/exports";
import { ConnectState } from "@/models/connect";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from "./index.less";
import { Menu } from "antd";
import DeclareList from './modules/declareListVillage'

type PropType = {
  user: object,
  regions: CascaderOptionType[],
  authorizations: any[],
}

function formulaFertilizerManage({ user, regions, authorizations }: PropType) {
  const [selectedTable, setSelectedTable] = useState(['notPublic']);
  // 由于表格的和筛选条件的一部分是全都展示 所以这里只筛选会变化的部分
  const SEARCH_ENUM = {
    notPublic: [],
    inThePublic: [],
    publiced: [],
    remitted: [],
    rejected: [''],
  };
  const TABLE_ENUM = {
    notPublic: [ 'rejected_time', 'rejected_reason'],
    inThePublic: ['stop_public_time'],
    publiced: ['approval_status'],
    remitted: ['remit_status', 'remit_time'],
    rejected: ['cancel_time'],
  };
  const BUTTON_ENUM = {
    notPublic: ['detail', 'edit', 'reject', 'skip_public','delete'],
    inThePublic: ['detail', 'stop_public'],
    publiced: ['detail'],
    remitted: ['detail'],
    rejected: ['detail'],
  };

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
          <Menu.Item key="notPublic">村未公示</Menu.Item>
          <Menu.Item key="inThePublic">村公示中</Menu.Item>
          <Menu.Item key="publiced">村已公示</Menu.Item>
          <Menu.Item key="remitted">打款记录</Menu.Item>
          <Menu.Item key="rejected">取消记录</Menu.Item>
        </Menu>
        <DeclareList
          ACTIVE_TABLE={selectedTable[0]}
          SEARCH_ENUM={SEARCH_ENUM}
          TABLE_ENUM={TABLE_ENUM}
          BUTTON_ENUM={BUTTON_ENUM}
          regions={regions}
          user={user}
        />
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList,
}))(formulaFertilizerManage);
