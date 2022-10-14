import React, { useState, useRef } from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Cascader, DatePicker, Button } from 'antd';
import { paginationHandle, tableDataHandle } from '@/utils/utils';
import { getCollectList } from '@/services/ItemCollect';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import ButtonAuth from '@/components/ButtonAuth';
import moment from 'moment';
import AddCollect from '../addCollect';
import InnerTable from './index'

const CollectionItem: React.FC<any> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: '主编号',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: '子编号',
      dataIndex: 's_code',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '打分项名称',
      dataIndex: 'name',
      hideInSearch: !!((props.accountInfo.role_type == 1 || props.accountInfo.role_type == 2)),
    },
    {
      title: '所属地区',
      dataIndex: 'area_name',
      hideInSearch: !((props.accountInfo.role_type == 1 || props.accountInfo.role_type == 2)),
      // hideInTable: !((props.accountInfo.role_type == 1 || props.accountInfo.role_type == 2)),
      hideInTable: true,
      renderFormItem: () => (
        <Cascader options={props.areaList} />
      ),
    },
    {
      title: '打分类型',
      dataIndex: 'direction',
      hideInSearch: true,
      render: (val) => (val == 'INCREASE' ? '加分' : '扣分'),
      hideInTable: true,
    },
    {
      title: '参考分值',
      dataIndex: 'point',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '使用说明',
      dataIndex: 'comment',
      hideInSearch: true,
      // hideInTable: !!((props.accountInfo.role_type == 1 || props.accountInfo.role_type == 2)),
      hideInTable: true,
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      hideInTable: true,
      renderFormItem: () => (
        <RangePicker />
      ),
    },
  ];
  const getCollectListInfo = async (params) => {
    if (params.time && params.time.length != 0) {
      params.start_time = moment(params.time[0]).format('YYYY-MM-DD');
      params.end_time = moment(params.time[1]).format('YYYY-MM-DD');
    }
    delete params._timestamp;
    delete params.time;
    const _params = paginationHandle(params);
    // delete _params.city_id;
    // delete _params.town_id;
    // delete _params.village_id;
    if (params.area_name && params.area_name.length != 0) {
      _params.village_id = params.area_name[2];
      delete _params.area_name;
    }
    const _data = await getCollectList(_params);
    return tableDataHandle(_data);
  };
  const handleAddSuccess = () => {
    setAddModalVisible(false);
    actionRef.current?.reload();
  };
  return (
    <>
      <ProTable
        actionRef={actionRef}
        tableAlertRender={false}
        options={false}
        columns={columns}
        search={{
          collapsed,
          onCollapse: () => setCollapsed(!collapsed),
        }}
        rowKey={'id'}
        expandable={{
          expandedRowRender: (record) => <InnerTable dataSource={record.s_list} reload={()=>actionRef.current?.reload()} />,
        }}
        request={(params) => getCollectListInfo(params)}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
        toolBarRender={() => [
          props.accountInfo.role_type == 3
            ? (
              <ButtonAuth type="COLLECTION_CREATE">
                <Button type="primary" onClick={() => setAddModalVisible(true)}>新建</Button>
              </ButtonAuth>
            )
            : null,
        ]}
      />
      {
        addModalVisible ? <AddCollect addModalVisible={addModalVisible} handleAddSuccess={handleAddSuccess} handleCancel={() => setAddModalVisible(false)} /> : null
      }
    </>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(CollectionItem);
