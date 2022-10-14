import React from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from "./index.less";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import List from './components/list'


type PropType = {
  user: object,
  regions: CascaderOptionType[],
  authorizations: any[],
}

function home({ user, regions, authorizations }: PropType) {
  return (
    <PageHeaderWrapper>
      <div className={styles.pageContent}>
          <List/>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList
}))(home);
