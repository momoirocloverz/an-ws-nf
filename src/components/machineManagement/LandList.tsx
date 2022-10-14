import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getJobTypes, removeJobType } from '@/services/workManagement';
import ExportButton from '@/components/agricultureSubsidies/ExportButton';
import { getLandList, removeLandEntry, exportLandList } from '@/services/machineManagement';

const { RangePicker } = DatePicker;

function LandList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      date: rawParams.date,
      phoneNumber: rawParams.phoneNumber,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    try {
      const result = await getLandList(params);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        // TODO: other errors
        throw new Error('');
      }
      setStoredParams(params);
      const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
        id: row.id,
        name: row.name,
        phoneNumber: row.mobile,
        landType: row.plough_type,
        season: row.plough_time,
        location: row.plot_address,
        size: row.plot_area,
        crop: row.plan_grow,
        date: row.created_at,
      })) : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } catch (e) {
      message.error(`读取列表失败: ${e.message}`);
      return {
        data: [],
        page: 1,
        total: 0,
        success: true,
      };
    }
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '农户姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '耕地类型',
      dataIndex: 'landType',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '计划耕地时间',
      dataIndex: 'season',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '地块位置',
      dataIndex: 'location',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '地块面积',
      dataIndex: 'size',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '计划种植',
      dataIndex: 'crop',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '上报时间',
      dataIndex: 'date',
      align: 'center',
      valueType: 'datetime',
      renderFormItem: () => (<RangePicker picker="date" />),
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${record.name}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await removeLandEntry(record.id);
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
          <ButtonAuth type="EXPORT">
            <ExportButton
              func={exportLandList}
              params={storedParams}
              customDownloadObject={{ name: `${new Date().toLocaleString()}耕地上报导出列表.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }}
            />
          </ButtonAuth>,
        ]}
      />
    </>
  );
}

export default LandList;
