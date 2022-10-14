import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal, Cascader,
} from 'antd';
import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import ImportBtn from '@/components/buttons/ImportBtn';
import { deleteGovEmployee, getGovEmployees } from '@/services/myHometown';
import GovEmployeeModal from '@/components/myHometown/GovEmployeeModal';
import { BasicUserSet } from '@/pages/myHometown/types';
import { CascaderOptionType } from 'antd/lib/cascader';

type PropType = {
  authorizations: BasicUserSet;
  regionTree: CascaderOptionType[];
  userRegion: number[];
}

function GovEmployees({ authorizations, regionTree, userRegion } : PropType) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      phoneNumber: rawParams.phoneNumber,
      region: rawParams.region ?? userRegion,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getGovEmployees(params);
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      name: row.name,
      phoneNumber: row.mobile,
      position: row.job,
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '地区',
      dataIndex: 'region',
      align: 'center',
      hideInTable: true,
      hideInSearch: !(authorizations.isCityOfficial),
      initialValue: userRegion,
      renderFormItem: () => (<Cascader options={regionTree} changeOnSelect />),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 140,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '职务',
      dataIndex: 'position',
      hideInSearch: true,
      align: 'center',
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
                      await deleteGovEmployee(record.id);
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
                window.location.href = 'https://img.wsnf.cn/acfile/%E6%9D%91%E5%B9%B2%E9%83%A8%E6%A6%82%E5%86%B5%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api="import_village_cadres" onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <GovEmployeeModal
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

export default GovEmployees;
