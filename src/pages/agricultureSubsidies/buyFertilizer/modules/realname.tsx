import React, { useRef, useState } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import { Button, DatePicker, message, Modal, Select, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { tableDataHandle } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from "../index.less";
import CreateForm from './createForm';
import {
  formulaFertilizerList,
  deleteFormulaFertilizerList,
  applyFormulaFertilizerList,
  formulaFertilizerListTotal,
  exportFormulaFertilizerList
} from "@/services/buyFertilizer";
import moment from "moment";
import Moment from "moment";
import {downloadAs} from "@/pages/agricultureSubsidies/utils";

function Index() {
  const [selectedRow, setSelectedRow] = useState<object>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [totalData, setTotalData] = useState({});
  const [storeParams, setStoreParams] = useState({});
  const statusEnum = {
    '': '全部',
    1: '未申报',
    2: '申报中',
    3: '已申报',
  };
  const cropEnum = {
    '': '全部',
    '水稻': '水稻',
    '大小麦': '大小麦',
  };
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      real_name: rawParams.real_name,
      identity: rawParams.identity,
      crops_name: rawParams.crops_name,
      type: rawParams.type,
      year: rawParams.year ? Moment(rawParams.year).format('YYYY'):'',
      page: rawParams.current,
      page_size: rawParams.pageSize,
    };
    // eslint-disable-next-line no-use-before-define
    await getTotal(params);
    setStoreParams(params);
    const result = await formulaFertilizerList(params);
    if (result.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } else {
      message.error(result.msg);
    }
  };

  const getTotal = async (params) => {
    const { pageNum, pageSize, ...data } = params;
    const result = await formulaFertilizerListTotal(data);
    setTotalData(result.data);
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'real_name',
      align: 'center',
      width: 100,
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      align: 'center',
      width: 100,
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
      title: '实名制购肥量/吨',
      dataIndex: 'real_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      valueEnum: statusEnum,
      render: (__, record) => (<span style={{ color: record['type'] === 3 ? 'green' : record['type'] === 2 ? '#FF7215' : '' }}>{ statusEnum[record['type']] }</span>)
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
              style={{ display: record['type'] === 1 ? 'block' : 'none' }}
              type="link"
              onClick={() => {
                setSelectedRow(record);
                setVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <Popconfirm
              placement="top"
              title="确认使用当前用户核定购肥数量进行申报?"
              onConfirm={async () => {
                const result = await applyFormulaFertilizerList({ id: record.id });
                if (result.code === 0) {
                  message.success('申报成功');
                  tableRef?.current?.reload();
                } else {
                  message.error(result.msg);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                // style={{ display: record['crops_name'] === '水稻' || record['type'] !== 1 ? 'none' : 'block' }}
                style={{ display: 'none' }}
                type="link"
              >
                申报
              </Button>
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Popconfirm
              placement="top"
              title="确认删除当前用户数据?"
              onConfirm={async () => {
                const result = await deleteFormulaFertilizerList({ id: record.id });
                if (result.code === 0) {
                  message.success('删除成功');
                  tableRef?.current?.reload();
                } else {
                  message.error(result.msg);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                style={{ display: record['type'] === 1 ? 'block' : 'none' }}
                type="link"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </ButtonAuth>
        </div>
      )
    }
  ];

  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        headerTitle={
          <div className={styles.header_bar}>
            <div>总户数：<p>{ totalData.count || 0 }</p>户</div>
            <div>总实名制购肥量：<p>{ Math.round(totalData.real_ton*10000)/10000 || 0 }</p>吨</div>
          </div>
        }
        toolBarRender={() => [
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storeParams;
                exportFormulaFertilizerList(exportParams).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}实名制购肥管理.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`导出失败: ${e.message}`);
                });
              }}
            >
              导出
            </Button>
          </ButtonAuth>,
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
      <CreateForm
        visible={visible}
        context={selectedRow}
        onCancel={() => {
          setVisible(false);
        }}
        onSuccess={() => {
          tableRef?.current?.reload();
          setVisible(false);
        }}
      />
    </>
  );
}

export default Index;
