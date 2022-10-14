import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { getClockingDetails } from '@/services/workManagement';
import TableImage from '@/components/ImgView/TableImage';

type ContextType = {
  jobId: number;
  workerId: number;
  clockedHours: string;
}
type PropType = {
  visible: boolean;
  context: ContextType;
  date: string;
  onCancel: ()=>unknown;
}

function ClockingRecordModal({ visible, onCancel, context, date } : PropType) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  const tableRef = useRef();
  const loadData = async () => {
    const result = await getClockingDetails(context.jobId, context.workerId, date);
    const transformed = Array.isArray(result.data) ? result.data.map((row) => ({
      id: row.id,
      title: row.title,
      time: row.created_at,
      address: row.address,
      pic: row.images,
      notes: row.interpret,
    })) : [];
    setCount(transformed.length);
    setData(transformed)
  };

  useEffect(() => {
    if (visible) {
      loadData();
      // tableRef.current?.reload();
    }
  }, [visible]);

  // const loadData = async (rawParams) => {
  //   const result = await getClockingDetails(context.jobId, context.workerId, rawParams.current, rawParams.pageSize);
  //   const transformed = Array.isArray(result.data) ? result.data.map((row) => ({
  //     id: row.id,
  //     title: row.title,
  //     time: row.created_at,
  //     address: row.address,
  //     pic: row.images,
  //     notes: row.interpret,
  //   })) : [];
  //   setCount(transformed.length);
  //   return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  // };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '打卡时间',
      dataIndex: 'time',
      align: 'center',
      hideInSearch: true,
      width: 180,
    },
    {
      title: '打卡照片',
      dataIndex: 'pic',
      hideInSearch: true,
      align: 'center',
      render: (item) => (<TableImage src={item?.url} />),
      width: 140,
    },
    {
      title: '打卡地点',
      dataIndex: 'address',
      align: 'center',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      align: 'center',
    },
  ];

  return (
    <Modal
      title="打卡记录"
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={false}
      destroyOnClose
    >
      <ProTable
        actionRef={tableRef}
        // request={loadData}
        dataSource={data}
        columns={tableColumns}
        rowKey="time"
        options={false}
        search={false}
        pagination={{pageSize: 4}}
        footer={() => `总计${count}次， 工时${context.clockedHours}`}
        toolBarRender={false}
      />
      <div />
    </Modal>
  );
}

export default ClockingRecordModal;
