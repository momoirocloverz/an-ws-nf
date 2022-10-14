import React, { useMemo, useState } from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from "./index.less";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import { Menu } from "antd";
import List from "./components/list";


type PropType = {
  user: any,
  regions: CascaderOptionType[],
  authorizations: any[],
}
type ViewType = {
  view: JSX.Element;
  permissions: string[]
}

function home({ user, regions, authorizations }: PropType) {

  const [selectedTable, setSelectedTable] = useState(["1"]);
  const roleList = {
    "1": ["city", "town"], // 超管
    "2": ["city"], // 市 局
    "20": ["city"], // 市 局
    "4": ["town"], // 县 镇
    "21": ["town"] // 县 镇
  };
  const availableTables = useMemo(() => {
    const views: ViewType[] = [
      {
        view: <Menu.Item key="1">镇未审核</Menu.Item>,
        permissions: ["town"]
      },
      {
        view: <Menu.Item key="2">镇已审核</Menu.Item>,
        permissions: ["town"]
      },
      {
        view: <Menu.Item key="3">镇驳回记录</Menu.Item>,
        permissions: ["town"]
      },
      {
        view: <Menu.Item key="4">市未公示</Menu.Item>,
        permissions: ["city"]
      },
      {
        view: <Menu.Item key="5">市公示中</Menu.Item>,
        permissions: ["city"]
      },
      {
        view: <Menu.Item key="6">市已公示</Menu.Item>,
        permissions: ["city"]
      },
      {
        view: <Menu.Item key="7">市已递交</Menu.Item>,
        permissions: ["city"]
      },
      {
        view: <Menu.Item key="8">打款记录</Menu.Item>,
        permissions: ["city"]
      },
      {
        view: <Menu.Item key="9">财政退回</Menu.Item>,
        permissions: ["city"]
      }
    ];

    // @ts-ignore
    const availableViews: JSX.Element[] = views.map((e) => {
      let flag = false;
      user.role_id && roleList[user.role_id].map(item => {
        if (e.permissions.includes(item)) {
          flag = true;
        }
      });
      if (flag) {
        return e.view;
      }
    }).filter((val) => {
      return Object.prototype.toString.call(val) === "[object Object]";
    });
    // @ts-ignore
    availableViews[0] && setSelectedTable([availableViews[0].key]);
    return availableViews;
  }, [user]);

  return (
    <PageHeaderWrapper>
      <div className={styles.pageContent}>
        <Menu
          mode="horizontal"
          selectedKeys={selectedTable}
          onSelect={({ selectedKeys }) => {
            setSelectedTable(selectedKeys);
          }}
        >
          {availableTables}
        </Menu>

        <div>
          <List
            selectedKey={selectedTable[0]}
            regions={regions}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList
}))(home);
