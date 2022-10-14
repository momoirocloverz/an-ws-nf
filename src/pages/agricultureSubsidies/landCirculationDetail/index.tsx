import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableImage from '@/components/ImgView/TableImage';
import { history } from '@@/core/history';
import React, {useRef, useState, useEffect} from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {Button, message, Modal, Upload} from 'antd';
import {delLandCirculationDetail, landCirculationDetail} from '@/services/landCirculation';
import {getApiParams, getLocalToken, tableDataHandle} from '@/utils/utils';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import EditModel from '@/pages/agricultureSubsidies/landCirculationDetail/modules/editModel';
import {PUBLIC_KEY} from '@/services/api';
import {downloadAs} from '@/pages/agricultureSubsidies/utils';


type PropType = {
  context: Context | {};
}

function LandCirculationDetail({ context }: PropType) {
  // 导入文件
  const token = getLocalToken();
  const addApiName = {
    api_name: 'import_land_circulation_info',
    land_circulation_id: context.id,
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);

  const tableRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableColumns = [
    {
      title: '流转协议编号',
      dataIndex: 'agreement_number',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: '流出方',
      dataIndex: 'outflow_side',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: '流转面积',
      dataIndex: 'circulation_area',
      hideInTable: false,
      hideInSearch: true,
      render: (item, record) => (record.circulation_area + '亩')
    },
    {
      title: '流转时间',
      dataIndex: 'circulation_at',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify', parentId: context.id });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              danger
              onClick={() => {
                Modal.confirm({
                  content: `确认删除?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      // await delLandCirculationDetail({id: record.id, land_circulation_id: history.location.query.id});
                      await delLandCirculationDetail({id: record.id, land_circulation_id: context.id});
                      message.success('删除成功!');
                      tableRef.current.reload();
                    } catch (e) {
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
  ]
  const uploadProps = {
    name: 'file',
    action: '/farmapi/gateway',
    headers: {
      authorization: token,
    },
    showUploadList: false,
    data,
    onChange(info: any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          if (info.file.response.data.length) {
            Modal.error({
              content: `${info.file.response.data.join("")}`,
            });
          } else {
            message.success(`${info.file.name} 文件导入成功`);
            tableRef.current.reload();
          }
        } else {
          message.error(info.file.response.msg);
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件导入失败`);
        setLoading(false);
      }
    },
  }

  const loadData = async (rawParams) => {
    const params = {
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
      // land_circulation_id: history.location.query.id,
      land_circulation_id: context.id,
    }
    const result = await landCirculationDetail(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      agreement_number:row.agreement_number,
      outflow_side: row.outflow_side,
      mobile: row.mobile,
      circulation_area: row.circulation_area,
      circulation_at: row.circulation_at,
    })) : [];
    return tableDataHandle({...result, data: {...(result.data), data: transformed}});
  }
  return (
    <div>
      <ProTable
        actionRef={tableRef}
        search={false}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://img.wsnf.cn/acfile/%E5%9C%9F%E5%9C%B0%E6%B5%81%E8%BD%AC%E8%AF%A6%E6%83%85%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
          <Upload {...uploadProps} disabled={loading}>
            <Button type="primary" disabled={loading} loading={loading}>
              {loading ? '正在导入...' : '导入'}
            </Button>
          </Upload>
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                // landCirculationDetail({ land_circulation_id: history.location.query.id }, 1).then((result) => {
                landCirculationDetail({ land_circulation_id: context.id }, 1).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}土地流转详情.xls`, 'application/vnd.ms-excel');
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
                setSelectedRow({ action: 'create', parentId: context.id });
                setIsModalVisible(true);
              }}
            >
              +新增
            </Button>
          </ButtonAuth>
        ]}
      />
      <EditModel
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </div>
  )
}
export default LandCirculationDetail;
