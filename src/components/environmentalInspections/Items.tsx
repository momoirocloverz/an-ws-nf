import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  deleteInspectionItem,
  getInspectionItems,
} from '@/services/environmentalInspections';
import PrimaryItemModal from '@/components/environmentalInspections/PrimaryItemModal';
import ItemModal from '@/components/environmentalInspections/ItemModal';
import {ExclamationCircleOutlined} from "@ant-design/icons";
import styles from './index.less'

function SubItems({ primaryName, data, tableRef }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  // const loadData = async (rawParams) => {
  //   const params = {
  //     name,
  //     pageNum: rawParams.current,
  //     pageSize: rawParams.pageSize,
  //   };
  //   try {
  //     const result = await getInspectionItems(params);
  //     if (result?.code !== 0) {
  //       if (result?.code) {
  //         throw new Error(result.msg);
  //       }
  //       // TODO: other errors
  //       throw new Error('');
  //     }
  //     const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
  //       id: row.id,
  //       name: row.problem_cate,
  //       type: row.just_negative,
  //       createdAt: row.created_at,
  //     })) : [];
  //     return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  //   } catch (e) {
  //     message.error(`读取列表失败: ${e.message}`);
  //     return {
  //       data: [],
  //       page: 1,
  //       total: 0,
  //       success: true,
  //     };
  //   }
  // };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '子项名称',
      dataIndex: 'problem_cate',
      align: 'center',
    },
    {
      title: '加减分',
      dataIndex: 'just_negative',
      // valueEnum: itemType,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      width: '40%',
      hideInSearch: true,
      valueType: 'datetime',
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify', primaryCategoryName: primaryName });
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
                  content: `确认删除${record.problem_cate}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await deleteInspectionItem(record.id);
                      if (result.code === 0) {
                        message.success('删除成功!');
                        tableRef.current.reload();
                      } else {
                        throw new Error(result.msg);
                      }
                    } catch (e) {
                      message.error(`删除失败: ${e.message}!`);
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
        // actionRef={tableRef}
        // request={loadData}
        rowClassName={styles.subItemRow}
        dataSource={data}
        columns={tableColumns}
        rowKey="id"
        options={false}
        search={false}
        pagination={{
          showSizeChanger: false,
          showTotal: undefined,
        }}
        toolBarRender={false}
      />
      <ItemModal
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

export default function Items() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrimaryModalVisible, setIsPrimaryModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    try {
      const result = await getInspectionItems(params);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        // TODO: other errors
        throw new Error('');
      }
      const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
        id: row.id,
        name: row.main_item,
        createdAt: row.created_at,
        list: row.list,
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
      title: '主项名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      width: '40%',
      hideInSearch: true,
      valueType: 'datetime',
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
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
          {/* <ButtonAuth type="DELETE"> */}
          {/*  <Button */}
          {/*    type="link" */}
          {/*    onClick={() => { */}
          {/*      Modal.confirm({ */}
          {/*        content: `确认删除${record.name}?`, */}
          {/*        icon: <ExclamationCircleOutlined />, */}
          {/*        onOk: async () => { */}
          {/*          try { */}
          {/*            await deleteInspectionItem(record.id); */}
          {/*            message.success('删除成功!'); */}
          {/*            tableRef.current.reload(); */}
          {/*          } catch (e) { */}
          {/*            message.error(`删除失败: ${e.message}!`); */}
          {/*          } */}
          {/*        }, */}
          {/*      }); */}
          {/*    }} */}
          {/*  > */}
          {/*    删除 */}
          {/*  </Button> */}
          {/* </ButtonAuth> */}
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
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsPrimaryModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
        expandable={{
          expandedRowRender: (record) => (<SubItems primaryName={record.name} data={record.list} tableRef={tableRef} />), // dummy
          rowExpandable: (record) => true,
        }}
      />
      <PrimaryItemModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
      <ItemModal
        context={selectedRow}
        visible={isPrimaryModalVisible}
        onCancel={() => setIsPrimaryModalVisible(false)}
        onSuccess={() => {
          setIsPrimaryModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </>
  );
}
