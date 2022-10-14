import React, { useState } from "react";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "@@/plugin-dva/exports";
import { ConnectState } from "@/models/connect";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from "./index.less";
import { Menu } from "antd";
import DeclareList from "./modules/declareListCity";

type PropType = {
  user: object,
  regions: CascaderOptionType[],
  authorizations: any[],
}

function formulaFertilizerManage({ user, regions, authorizations }: PropType) {
  const [selectedTable, setSelectedTable] = useState(["notPublicVillage"]);
  // 由于表格的和筛选条件的一部分是全都展示 所以这里只筛选会变化的部分
  const SEARCH_ENUM = {
    notPublicVillage: [],
    inThePublicVillage: [],
    pendingReview: [],
    notPublic: ["can_public"],
    inThePublic: [],
    notSubmit: ["detail"],
    submited: ["detail"],
    remitted: ["remit_status"],
    rejected: []
  };
  const TABLE_ENUM = {
    notPublicVillage: ["rejected_time", "rejected_reason"],
    inThePublicVillage: ['stop_public_time'],
    pendingReview: ["rejected_time", "rejected_reason"], //镇待审核
    notPublic: ["can_public", "rejected_time", "rejected_reason"],
    inThePublic: ["stop_public_time"],
    notSubmit: [],
    submited: ["submit_time", "public_agent"],
    remitted: ["remit_status", "remit_time"],
    rejected: ["public_agent", "rejected_time", "rejected_reason"]
  };
  const BUTTON_ENUM = {
    notPublicVillage: [],
    inThePublicVillage: [],
    pendingReview: [],
    notPublic: [],
    inThePublic: [],
    notSubmit: [],
    submited: [],
    remitted: [],
    rejected: ["turn_down_village", "turn_down_city", "turn_down_town"]
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
          <Menu.Item key="notPublicVillage">村未公示</Menu.Item>
          <Menu.Item key="inThePublicVillage">村公示中</Menu.Item>
          <Menu.Item key="pendingReview">镇待审核</Menu.Item>
          <Menu.Item key="notPublic">镇未公示</Menu.Item>
          <Menu.Item key="inThePublic">镇公示中</Menu.Item>
          <Menu.Item key="notSubmit">市待递交</Menu.Item>
          <Menu.Item key="submited">市已递交</Menu.Item>
          <Menu.Item key="remitted">打款记录</Menu.Item>
          <Menu.Item key="rejected">财政退回</Menu.Item>
        </Menu>
        <DeclareList
          ACTIVE_TABLE={selectedTable[0]}
          SEARCH_ENUM={SEARCH_ENUM}
          TABLE_ENUM={TABLE_ENUM}
          BUTTON_ENUM={BUTTON_ENUM}
        />
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList
}))(formulaFertilizerManage);
