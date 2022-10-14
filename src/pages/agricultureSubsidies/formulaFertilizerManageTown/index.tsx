import React, { useEffect, useState } from "react";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "@@/plugin-dva/exports";
import { ConnectState } from "@/models/connect";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from "./index.less";
import { Menu } from "antd";
import DeclareListTown from './modules/formulaFertilizerManagementTownList'

type PropType = {
  user: object,
  regions: CascaderOptionType[],
  authorizations: any[],
}

function formulaFertilizerManage({ user, regions, authorizations }: PropType) {
  const [selectedTable, setSelectedTable] = useState(['notPublicVillage']);
  // 由于表格的和筛选条件的一部分是全都展示 所以这里只筛选会变化的部分
  const SEARCH_ENUM = {
    notPublicVillage: [], // 村未公示
    inThePublicVillage: [], // 村公示中
    pendingReview: [], // 镇待审核
    hadReview: [], // 镇已审核
    notPublic: ['can_public'],
    inThePublic: [],
    publiced: ['submit_status'],
    remitted: ['remit_status'],
    rejected: [''],
  };
  const TABLE_ENUM = {
    notPublicVillage: ['rejected_time', 'rejected_reason'], // 村未公示
    inThePublicVillage: ['stop_public_time'], // 村公示中
    pendingReview: ['rejected_time', 'rejected_reason','is_city_reject'], // 镇待审核
    hadReview: ['submit_status'], // 镇已审核
    notPublic: ['can_public', 'rejected_time', 'rejected_reason'],
    inThePublic: ['stop_public_time'],
    publiced: ['submit_status'],
    remitted: ['remit_status', 'remit_time'],
    rejected: ['rejected_time', 'rejected_reason'],
  };
  const BUTTON_ENUM = {
    notPublicVillage: ['detail'], // 村未公示
    inThePublicVillage: ['detail'], // 村公示中
    pendingReview: ['batch_review','detail','town_pass','town_reject'], // 镇待审核
    hadReview: ['detail','submit_status'], // 镇已审核
    notPublic: ['detail', 'edit', 'reject', 'skip_public'],
    inThePublic: ['detail', 'stop_public'],
    publiced: ['detail'],
    remitted: ['detail'],
    rejected: ['detail'],
  };
  useEffect(()=>{
    console.log(regions)
  },[regions])
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
          <Menu.Item key="notPublicVillage">村未公示</Menu.Item>
          <Menu.Item key="inThePublicVillage">村公示中</Menu.Item>
          <Menu.Item key="pendingReview">镇待审核</Menu.Item>
          <Menu.Item key="hadReview">镇已审核</Menu.Item>
          <Menu.Item key="notPublic">镇未公示</Menu.Item>
          <Menu.Item key="inThePublic">镇公示中</Menu.Item>
          <Menu.Item key="publiced">镇已公示</Menu.Item>
          <Menu.Item key="remitted">打款记录</Menu.Item>
          <Menu.Item key="rejected">镇驳回/取消记录</Menu.Item>
        </Menu>
        <DeclareListTown
          ACTIVE_TABLE={selectedTable[0]}
          SEARCH_ENUM={SEARCH_ENUM}
          TABLE_ENUM={TABLE_ENUM}
          BUTTON_ENUM={BUTTON_ENUM}
          regions={regions}
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
