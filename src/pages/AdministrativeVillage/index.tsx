import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/create';
import { TableListItem, FormValueType } from './data.d';
import ButtonAuth from '@/components/ButtonAuth';
import {
  villageList,
  townList,
  addVillage,
  deleteVillage
} from '@/services/AdministrativeVillage';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import _ from 'lodash'

/**
 * 
 * 此文件暂时无用
 * 
 * 
 */







/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {
  try {
    const _data = await addVillage(fields)
    if (_data.code === 0) {
      message.success('添加成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('添加失败');
    return false;
  }
};
/**
 * 删除节点
 * @param id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deleteVillage({ id })
    if (_data.code === 0) {
      message.success('删除成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('删除失败');
    return false;
  }
}

const TableList: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false)
  const [valueEnum, setValueEnum] = useState({}) 

  // 补全table columns数据
  useEffect(() => {
    getTownList()
  },[])
  const getTownList = async () => {
    const res = await townList()
    const valueEnumData = {}
    if (res.code === 0) {
      const child = _.get(res, 'data[0].children', [])
      child.forEach((item: any) => {
        valueEnumData[item.town_id] = item.label
      })
    }
    setValueEnum(valueEnumData)
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '市',
      dataIndex: 'city_name',
      hideInSearch: true,
    },{
      title: '乡镇',
      dataIndex: 'town_id',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_, record) => (<span>{record.town_name}</span>),
      valueEnum,
      formItemProps: { allowClear: true }
    },{
      title: '村',
      dataIndex: 'village_name'
    },{
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },{
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <ButtonAuth type="DELETE">
          <a
            onClick={async () => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除本条数据吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleDelet(record.village_id);
                  if (success) {
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                },
              });
            }}>
            删除
          </a>
        </ButtonAuth>
      ),
    },
  ];

  // 获取列表数据
  const getVillageList = async (val:any) => {
    const valObj = { ...val };
    const _params = paginationHandle(valObj);
    const _data = await villageList(_params);
    return tableDataHandle(_data)
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="village_id"
        options={false}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleModalVisible(true);
            }}>
              新建村
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getVillageList(params)}
        columns={columns}
      />
      {/* 新建弹窗 */}
      {
        modalVisible ? (
          <CreateForm
            onSubmit={async (value: any) => {
              let success = null;
              success = await handleAdd(value)
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleModalVisible(false);
            }}
            modalVisible={modalVisible}
            valueEnum={valueEnum}
          />
        ) : null
      }
    </PageHeaderWrapper>
  );
};

export default TableList;
