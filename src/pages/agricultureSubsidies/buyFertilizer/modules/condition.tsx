import React, { useRef, useState } from 'react';
import { Button, DatePicker, message, Modal, Select, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import Moment from 'moment';
import ButtonAuth from '@/components/ButtonAuth';
import { tableDataHandle } from '@/utils/utils';
import styles from '../index.less';
import CreateFormCondition from './createFormCondition';
import { deleteFormulaFertilizerList, conditionList } from '@/services/buyFertilizer';

function Index() {
  const [selectedRow, setSelectedRow] = useState<object>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [storeParams, setStoreParams] = useState({});
  const cropEnum = {
    水稻: '水稻',
    大小麦: '大小麦',
  };
  const tableRef: any = useRef();
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  const loadData = async (rawParams) => {
    const params = {
      crops_name: rawParams.crops_name,
      year: rawParams.year ? Moment(rawParams.year).format('YYYY'):'',
      page: rawParams.current,
      page_size: rawParams.pageSize,
    };
    console.log(rawParams.year)
    console.log(params)
    setStoreParams(params);
    const result = await conditionList(params);
    if (result.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...result?.data, data: transformed } });
    }
    message.error(result.msg);
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '作物',
      dataIndex: 'crops_name',
      align: 'center',
      width: 100,
      valueEnum: cropEnum,
    },
    {
      title: '年份',
      dataIndex: 'year',
      align: 'center',
      width: 100,
      renderFormItem: () => <DatePicker picker="year" />,
    },
    {
      title: '配方',
      dataIndex: 'formula',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '购买时段',
      dataIndex: 'buy_start_time',
      align: 'center',
      hideInSearch: true,
      render: (item, record) => (
        <div>
          <span>{record.buy_start_time}</span>
          <span>~</span>
          <span>{record.buy_end_time}</span>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                // return;
                setSelectedRow(record);
                setVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];

  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
                setSelectedRow({});
              }}
            >
              新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      { visible ? (
        <CreateFormCondition
            key={new Date()}
            visible={visible}
            context={selectedRow}
            onCancel={() => {
              setVisible(false);
            }}
            onSuccess={() => {
              // eslint-disable-next-line no-unused-expressions
              tableRef?.current?.reload();
              setVisible(false);
            }}
          />
        ):null
      }

    </>
  );
}

export default Index;
