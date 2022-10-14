import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader } from 'antd';
import Moment from 'moment';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { TableListItem } from './data.d';
import {
  integralGoodsList,
  addIntegralGoods,
  deletIntegralGoods,
  editIntegralGoods,
  editIsShowStatus
} from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import accountInfo from '@/models/user';
import OnShelf from './components/OnShelf';
import SoldOut from './components/SoldOut';
import Record from './components/Record';

const Index: React.FC<any> = () => {
  const [tabKey, setTabKey] = useState('1');

  const navList = [
    {
      key: '1',
      tab: '在线商品'
    },
    {
      key: '2',
      tab: '下架商品'
    },
    {
      key: '3',
      tab: '兑换记录'
    }
  ]
  
  const tabChange = (e) => {
    setTabKey(e);
  }

  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs
      }}
      tabActiveKey={tabKey}
      tabList={navList}
      onTabChange={tabChange}
    >
      {tabKey === '1' ? <OnShelf /> : tabKey === '2' ? <SoldOut /> : <Record />}
    </PageHeaderWrapper>
  );
};

export default Index;
