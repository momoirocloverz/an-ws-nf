import React, { useState, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// 打分项管理
import ItemManage from './components/ItemizedManagement';
// 打分项统计
import StatisticsItem from './components/StatisticsItem';
// 打分项征集
import CollectionItem from './components/CollectionItem/';
// 打分项审批
import ApprovalScore from './components/ApprovalScore';
// 征集记录
// import CollectionRecord from './components/CollectionRecord';
import styles from './index.less';
import GradeItemTable from "@/pages/integral/scoring/components/ItemizedManagement/GradeItemTable";



const TableList: React.FC<any> = (props) => {
  const [tabKey, setTabKey] = useState('1');
  const { accountInfo } = props;
  useEffect(() => { }, [props.userAuthButton]);
  // const tabList = accountInfo.role_type == 1 ? [ {key: '1', tab: '积分菜单'}, {key: '2', tab: '打分项统计'}, {key: '3', tab: '打分项收集'} ] : ''
  let tabList:any = []
  switch(accountInfo.role_type) {
    case 1:
      tabList = [
        {
          key: '1',
          tab: '积分菜单'
        },
        {
          key: '2',
          tab: '打分项统计'
        },
        {
          key: '3',
          tab: '打分项收集'
        }
      ]
      break;

    case 2:
      tabList = [
        {
          key: '1',
          tab: '积分菜单'
        },
        {
          key: '3',
          tab: '打分项收集'
        }
      ]
      break;

    case 3:
      tabList = [
        {
          key: '1',
          tab: '积分菜单'
        },
        {
          key: '2',
          tab: '征集记录'
        }
      ]
      break;

    case 4:
      tabList = [
        {
          key: '1',
          tab: '积分菜单'
        },
        {
          key: '2',
          tab: '打分项统计'
        },
        {
          key: '3',
          tab: '打分项审批'
        }
      ]
      break;
  }
  // const tabList = (accountInfo.role_type == 1||accountInfo.role_type == 2) ? [
  //   {
  //     key: '1',
  //     tab: '积分菜单'
  //   },
  //   {
  //     key: '2',
  //     tab: '打分项统计'
  //   },
  //   {
  //     key: '3',
  //     tab: '打分项收集'
  //   }
  // ] :
  //   accountInfo.role_type == 4 ?
  //     [
  //       {
  //         key: '1',
  //         tab: '积分菜单'
  //       },
  //       {
  //         key: '2',
  //         tab: '打分项统计'
  //       },
  //       {
  //         key: '3',
  //         tab: '打分项审批'
  //       }
  //     ] : [
  //       {
  //         key: '1',
  //         tab: '积分菜单'
  //       },
  //       {
  //         key: '2',
  //         tab: '征集记录'
  //       }
  //     ];
  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs
      }}
      tabActiveKey={tabKey}
      tabList={tabList}
      onTabChange={(e) => setTabKey(e)}>
      {/* 市级角色 */}
      {
        (accountInfo.role_type == 1 || accountInfo.role_type == 2) ?
          (tabKey == '1' ? <GradeItemTable /> : tabKey == '2' ? <StatisticsItem /> : <CollectionItem />) :
          // 镇级
          (accountInfo.role_type == 4) ?
            (tabKey == '1' ? <GradeItemTable /> : tabKey == '2' ? <StatisticsItem /> : <ApprovalScore />) :
            (tabKey == '1' ? <GradeItemTable /> : <CollectionItem />)
      }
    </PageHeaderWrapper>
  );
};

// export default TableList;
export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(TableList);
