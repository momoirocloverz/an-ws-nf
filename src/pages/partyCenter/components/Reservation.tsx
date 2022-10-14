import {PlusOutlined, ExclamationCircleOutlined,} from '@ant-design/icons';
import {Button, Modal, message, Switch, Cascader} from 'antd';
import Moment from 'moment';
import React, {useState, useRef} from 'react';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import {PAY_TYPE, CONFIRM_TYPE} from "@/pages/partyCenter/components/status";

import {
  familyFeastReserveList,
  familyFeastReserveCheck
} from '@/services/serve';
import {tableDataHandle, paginationHandle} from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {connect, Dispatch} from 'umi';
import {ConnectState} from '@/models/connect';
import styles from '../index.less';
import InnerTable from './InnerTable';


/**
 * @param pay_type 支付类型
 * @param status 付款状态->reserve_status
 * */
const _getReserveStatus = (pay_type: Number, status: Number): String => {
  if (status === CONFIRM_TYPE.CANCEL) {
    return '已取消'
  }
  if (status === CONFIRM_TYPE.UN_CONFIRM) {
    //未确认
    switch (pay_type) {
      case PAY_TYPE.PAYMENT_TYPE_RESERVE:
        return '待确认定金'
      case PAY_TYPE.PAYMENT_TYPE_AMOUNT:
        return '待确认全款'
    }
  }
  if (status === CONFIRM_TYPE.CONFIRMED_RESERVE) {
    return '待确认尾款'
  }
  if (status === CONFIRM_TYPE.CONFIRMED_REMAIN || status === CONFIRM_TYPE.CONFIRMED_AMOUNT) {
    return '已确认全款'
  }
  return ''
}

const Reservation: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const {accountInfo, areaList} = props
  const columns: ProColumns<any>[] = [
    {
      title: '预订人',
      dataIndex: 'real_name',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      width: 120,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists = (areaList.length > 0 && accountInfo.role_type === 4) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      },
    },
    {
      title: '付款方式',
      dataIndex: 'pay_type',
      render: (_, record) => {
        return (<span>{record.pay_type === 1 ? '付定金' : '付全款'}</span>)
      },
      valueEnum: {
        0: {text: '全部'},
        1: {text: '付定金'},
        2: {text: '付全款'},
      },
      filterDropdownVisible: false,
    },
    {
      title: '预定状态',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <span>{_getReserveStatus(record.pay_type, record.reserve_status)}</span>
        )
      },
    },
    {
      title: '下单时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '付款凭证',
      dataIndex: 'pay_cert_ids',
      width: 120,
      render: (_, record) => {
        return <div className={styles.pay_cert_ids}>
          {
            record?.pay_cert_ids?.map(i => <a className={styles.pay_cert_ids_link} href={i} target="_blank">
              <img className={styles.pay_cert_ids_img} src={i}/>
            </a>)
          }
        </div>
      },
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          {
            record.reserve_status === CONFIRM_TYPE.UN_CONFIRM && record.pay_type === PAY_TYPE.PAYMENT_TYPE_RESERVE &&
            <ButtonAuth type="EDIT">
              <a
                className={styles.margin}
                onClick={() => {
                  checkReserve(record, '12', '确定收到定金了吗？')
                }}>
                确认定金
              </a>
            </ButtonAuth>
          }
          {
            record.reserve_status === CONFIRM_TYPE.UN_CONFIRM && record.pay_type === PAY_TYPE.PAYMENT_TYPE_AMOUNT &&
            <ButtonAuth type="EDIT">
              <a
                className={styles.margin}
                onClick={() => {
                  checkReserve(record, '32', '确定收到全款了吗？')
                }}>
                确认全款
              </a>
            </ButtonAuth>
          }
          {
            record.reserve_status === CONFIRM_TYPE.CONFIRMED_RESERVE && <ButtonAuth type="EDIT">
              <a
                className={styles.margin}
                onClick={() => {
                  checkReserve(record, '22', '确定收到尾款了吗？')
                }}>
                确认尾款
              </a>
            </ButtonAuth>
          }
          {
            record.reserve_status !== CONFIRM_TYPE.CANCEL ? (
              <ButtonAuth type="DELETE">
                <a
                  className={styles.colorTap}
                  onClick={() => {
                    checkReserve(record, '3', '确定取消此条预定吗？')
                  }}>
                  取消
                </a>
              </ButtonAuth>
            ) : null
          }
        </>
      ),
    },
  ];

  const checkReserve = (record, value, msg) => {
    return (
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined/>,
        content: msg,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const success = await familyFeastReserveCheck({
            id: record.id,
            reserve_status: value
          });
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        },
      })
    )
  }

  const getList = async (val: any) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    const params: any = paginationHandle(val);
    params.status = Number(params.status);
    console.log(params);
    // setPageParams(params)
    const data = await familyFeastReserveList(params);
    return tableDataHandle(data)
  }

  return (
    <div>
      <ProTable<any>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        options={false}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        tableAlertRender={false}
        request={(params) => getList(params)}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <InnerTable dataSource={record.get_family_feast_reserve_info} reload={() => actionRef.current?.reload()}/>)
        }}
      />
    </div>
  );
};

export default connect(({user, info}: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(Reservation);
