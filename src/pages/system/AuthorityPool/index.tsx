import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { message, Modal, Divider, Button } from 'antd';
import {
  deleteAuthority,
  addAuthority,
  editAuthority,
  getAuthorityList
} from '@/services/system';
import { TableListItem } from './data.d';
import CreateChildren from './components/CreateChildren';
import { tableDataHandle, paginationHandle } from '@/utils/utils';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await addAuthority(fields);
    if (_data.code === 0) {
      message.success('新增成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('新增失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    const _data = await editAuthority(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};
const AuthorityList: React.FC<any> = props => {
  const actionRef = useRef<ActionType>();
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [childrenFormValue, setChildrenFormValue] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: '权限名称',
      dataIndex: 'label',
    }, 
    {
      title: '权限描述',
      dataIndex: 'describe',
      hideInSearch: true
    }, 
    {
      title: '权限标识',
      dataIndex: 'value',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (val: any, record: any) => (
        <>
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定要删除该权限吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteAuthority({
                    auth_id: record.id,
                  }).then((res: any) => {
                    if (res.code === 0) {
                      message.success('删除成功');
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    } else {
                      message.error(res.msg);
                    }
                  });
                },
              });
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setChildrenVisible(true); 
              setChildrenFormValue(record);
              setIsEdit(true);
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  // 获取列表数据
  const getListData = async (val: any) => {
    const _params = paginationHandle(val);
    const _data = await getAuthorityList(_params);
    return tableDataHandle(_data);
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={() => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => { 
            setChildrenVisible(true);
            setIsEdit(false);
          }}>
            新建权限
          </Button>,
        ]}
        
        options={false}
        request={(params) => getListData(params)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
      {
        childrenVisible ? (
          <CreateChildren
            title={ !isEdit ? '添加' : '编辑' }
            values={childrenFormValue}
            isEdit={isEdit}
            onSubmit={async (value:any) => {
              let success = null;
              if (isEdit) {
                success = await handleUpdate(value);
              } else {
                success = await handleAdd(value);
              }
              if (success) {
                setChildrenVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              setChildrenFormValue({}); 
              setChildrenVisible(false); 
            }}
            modalVisible={childrenVisible}
          />
        ) : null
      }
    </PageHeaderWrapper>
  );
};

export default AuthorityList;
