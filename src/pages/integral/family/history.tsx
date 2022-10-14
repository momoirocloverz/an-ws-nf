import { UserOutlined } from '@ant-design/icons';
import { Avatar} from 'antd';
import React, { useRef } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from '../data.d';
import { ConnectState } from '@/models/connect';
import CarouselImg from '@/components/CarouselImg';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { getIntegralFamilyLog,} from '@/services/integral';

const History: React.FC<{}> = (props) => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '打分id',
      dataIndex: 'record_id',
      hideInSearch: true,
    },
    {
      title: '打分日期',
      dataIndex: 'mark_at',
      hideInSearch: true,
    },
    {
      title: '打分项',
      dataIndex: 'item_name',
      hideInSearch: true,
    },
    {
      title: '分数',
      dataIndex: 'integral',
      hideInSearch: true,
      renderText: (_,record) => {
        if(record.direction === 'DECREASE'){
          return `-${record.integral}`
        }else {
          return record.integral
        }
      }
    },
    {
      title: '证明图片',
      dataIndex: 'identity',
      hideInSearch: true,
      render: (_: any, record: any) => {
        const urls = record.image_url.map((item: any) => {
          return item
        })
        return record.image_url && record.image_url.length > 0 ? (
          <CarouselImg urlList={urls} />
        ) : null
      },
    },
    {
      title: '检查时间',
      hideInSearch: true,
      dataIndex: 'checked_at',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作人员',
      dataIndex: 'operate_name',
      hideInSearch: true,
    },
    {
      title: '操作类别',
      dataIndex: 'operate_type',
      hideInSearch: true,
      renderText: (text) => text === 'EDIT'? '编辑':'删除'
    }
  ];
  const getList = async (val: any) => {
    console.log(props);
    const {family_id} = props.location.query;
    val.family_id = family_id
    const _params = paginationHandle(val);
    const _data = await getIntegralFamilyLog(_params);
    
    return tableDataHandle(_data);
  }

  return (
       <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="user_id"
        search={false}
        toolBarRender={false}

        options={false}
        request={(params) => getList(params)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        // scroll={{ x: 1500, }}
      />
  );
};

export default History
