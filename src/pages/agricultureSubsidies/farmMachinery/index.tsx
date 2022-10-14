import React, { useEffect, useRef, useState } from 'react';
import { tableDataHandle, mask } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, 
  message, 
  Modal, 
  Cascader
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import ImportBtn from '@/components/buttons/ImportBtn';
import FormModule from './modules/FormModule';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { 
  agriculturalList, 
  delAgricultural,
  exportAgricultural,
} from '@/services/agricultureSubsidies';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { subsidyType } from '../consts';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';

function farmMachinery({user, areaList}) {
  const [ isVisible, setVisible ] = useState(false);
  const [ selectedRow, setSelectedRow ] = useState({});
  const tableRef = useRef();
  const formRef = useRef();

  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '身份证号',
      dataIndex: 'id_card',
      render: (__, record) => (mask(record.id_card, { headLength: 4 })),
    },
    {
      title: '机具品目',
      dataIndex: 'agricultural_item',
      hideInSearch: true,
    },
    {
      title: '机具型号',
      dataIndex: 'agricultural_model',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      hideInSearch: true
    },
    {
      title: '销售价格',
      dataIndex: 'sale_price',
      hideInSearch: true,
    },
    {
      title: '中央补贴（元）',
      dataIndex: 'central_subsidies',
      hideInSearch: true,
    },
    {
      title: '省级补贴（元）',
      dataIndex: 'provincial_subsidies',
      hideInSearch: true,
    },
    {
      title: '市级补贴（元）',
      dataIndex: 'city_subsidies',
      hideInSearch: true,
    },
    {
      title: '补贴资金总额',
      dataIndex: 'subsidies_amount',
      hideInSearch: true,
    },
    {
      title: '补贴状态',
      dataIndex: 'subsidies_status',
      render: (__, record) => {
        return (
          <span style={{ color: record.subsidies_status === 2 ? '#f5222d' : record.subsidies_status === 1 ? '#52c41a' : '#000' }}>{record.subsidies_status === 1 ? '已补贴' : record.subsidies_status === 2 ? '未补贴' : '已提交'}</span>
        )
      },
      valueType: 'select',
      valueEnum: subsidyType
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {
            record.subsidies_status === 2 ? (
              <ButtonAuth type="EDIT">
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedRow({ ...record, action: 'modify' });
                    setVisible(true);
                  }}
                >
                  编辑
                </Button>
              </ButtonAuth>
            ) : null
          }
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              style={{ color: "#f5222d" }}
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${record.name}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await delAgricultural(record.id);
                      message.success('删除成功!');
                      tableRef.current.reload();
                    } catch (e: any) {
                      message.error(new Error(`删除失败: ${e.message}!`));
                    }
                  },
                });
              }}
            >
              删除
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];

  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      id_card: rawParams.id_card,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await agriculturalList(params);
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    // setStoredParams(params);
    const transformed = result.data.data ?? [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  }

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={tableRef}
        formRef={formRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="SUBMIT">
            <Button
              type="primary"
              onClick={() => {
                message.info('即将开放');
              }}
            >
              递交
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://img.wsnf.cn/acfile/%E5%86%9C%E6%9C%BA%E8%B4%AD%E7%BD%AE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api="import_agricultural" onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                let formValue = formRef.current.getFieldsValue();
                exportAgricultural({ name: formValue?.name, id_card: formValue?.id_card }).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}农机购置.xls`, 'application/vnd.ms-excel');
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
                setSelectedRow({ action: 'create' });
                setVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      {
        isVisible ? (
          <FormModule
            context={selectedRow}
            visible={isVisible}
            onCancel={() => {
              setVisible(false);
              tableRef.current?.reload();
            }}
            onSuccess={() => {
              setVisible(false);
              tableRef.current?.reload();
            }}
          />
        ) : null
      }
    </PageHeaderWrapper>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  areaList: info.areaList
}))(farmMachinery)