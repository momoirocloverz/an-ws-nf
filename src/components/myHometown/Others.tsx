import React, {
  useRef, useState,
} from 'react';
import {
  Button, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { tableDataHandle } from '@/utils/utils';
import ImportBtn from '@/components/buttons/ImportBtn';
import { BasicUserSet } from '@/pages/myHometown/types';
import { CascaderOptionType } from 'antd/lib/cascader';
import {
  deleteOthers,
  getOthers,
} from '@/services/myHometown';
import ButtonAuth from '@/components/ButtonAuth';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';
import OthersModal from '@/components/myHometown/OthersModal';

type PropType = {
  authorizations: BasicUserSet;
  regionTree: CascaderOptionType[];
  userRegion: number[];
}

export const isGruppenfuhrer = {
  1: '是',
  2: '否',
};
export const isGruppenfuhrerOptions = Object.entries(isGruppenfuhrer).map(([k, v]) => ({ value: k, label: v }));

export default function Others({
  user, authorizations, regionTree, userRegion,
}: PropType) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});

  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getOthers(params);
    setStoredParams(params);
    const transformed = Array.isArray(result.data.data)
      ? result.data.data.map((row) => ({
        ...row,
        id: row.id,
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
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '工种',
      dataIndex: 'profession_name',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'interpret',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow({ ...record, action: 'modify' });
              setIsModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                content: '确认删除?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                  try {
                    await deleteOthers(record.id);
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
        search={false}
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://wsnbh-img.hzanchu.com/acfile/1798677e284c97519fc0a9aaf432ae26.xlsx';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api="import_village_other" onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storedParams;
                getOthers({ ...exportParams, asFile: 1 }).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}其他导出记录.xls`, 'application/vnd.ms-excel');
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
                setIsModalVisible(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <OthersModal
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
