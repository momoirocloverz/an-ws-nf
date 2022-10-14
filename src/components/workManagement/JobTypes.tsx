import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getJobTypes, removeJobType } from '@/services/workManagement';
import ImportBtn from '@/components/buttons/ImportBtn';
import ExportButton from '@/components/agricultureSubsidies/ExportButton';
import JobTypeModal from '@/components/workManagement/JobTypeModal';

export const gender = {
  1: '男',
  2: '女',
};

function JobTypes() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    try {
      const result = await getJobTypes(params);
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
        name: row.profession_name,
        gender: row.sex,
        jobDesc: row.profession_info,
        rate: row.price,
        rateDesc: row.standard_info,
        notes: row.interpret,
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
      title: '工种类型',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: gender,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '工种明细',
      dataIndex: 'jobDesc',
      align: 'center',
      hideInSearch: true,
      valueType: 'datetime',
    },
    {
      title: '单价(元/小时)',
      dataIndex: 'rate',
      align: 'center',
      hideInSearch: true,
      valueType: 'datetime',
    },
    {
      title: '标准明细',
      dataIndex: 'rateDesc',
      align: 'center',
      hideInSearch: true,
      valueType: 'datetime',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      align: 'center',
      hideInSearch: true,
      valueType: 'datetime',
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
                setSelectedRow({ ...record, action: 'modify' });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${record.name}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await removeJobType(record.id);
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
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://img.wsnf.cn/acfile/%E5%B7%A5%E7%A7%8D%E7%B1%BB%E5%9E%8B%E5%AF%BC%E5%85%A5.xls';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api="import_profession" onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <ExportButton func={getJobTypes} params={storedParams} />
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <JobTypeModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </>
  );
}

export default JobTypes;
