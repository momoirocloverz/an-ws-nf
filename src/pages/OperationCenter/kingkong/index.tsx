import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { TableListItem, FormValueType } from './data.d';
import ButtonAuth from '@/components/ButtonAuth';
import {
  kingkongList,
  addKingkong,
  editKingkong,
  deletKingkong,
  showKingkong
} from '@/services/kingkong';
import ImgView from '@/components/ImgView';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import Moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Switch } from 'antd';
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {
  try {
    delete fields.image_url
    const _data = await addKingkong(fields)
    if (_data.code === 0) {
      message.success('添加成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
    return true;
  } catch (err) {
    message.error('添加失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  try {
    delete fields.image_url
    const _data = await editKingkong(fields)
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

/**
 * 更新节点
 * @param banner_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletKingkong({ id: id })
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

// 更新状态
const changeStatus = async (checked: boolean, id: number) => {
  try {
    const params = {
      id: id,
      status: checked ? '1' : '0'
    };
    const _data = await showKingkong(params);
    if (_data.code === 0) {
      message.success('状态更新成功');
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '金刚区名称',
      dataIndex: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon_image',
      hideInSearch: true,
      renderText: (val, record) => {
        return (
          <ImgView url={record['icon_image']} width={120} />
        );
      }
    },
    {
      title: '跳转类型',
      dataIndex: 'jump_type',
      width: '150px',
      hideInSearch: true,
      renderText: (_, record) => (
        <span>
          {
            (
              ()=>{
                switch(record.jump_type) {
                  case 1:
                    return '原生';
                  case 2:
                    return '链接';
                  case 3:
                    return '文章';
                  case 4:
                      return '课程';
                  default:
                    return '/'
                }
              }
            )()
          }
        </span>
      )
    },
    {
      title: '跳转信息',
      dataIndex: 'jump_value',
      hideInSearch: true,
    },
    {
      title: '是/否显示',
      dataIndex: 'is_show',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.is_show === 1 ? true : false}
            onChange={async (checked) => {
              const success = await changeStatus( checked, record.id);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTimeRange',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues(record);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
              <a
                onClick={async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: '确定删除本条金刚区配置吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const success = await handleDelet(record.id);
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
        </div>
      ),
    },
  ];

  const getBannerList = async (val:any) => {
    const valObj = { ...val };
    const createTimeArr = valObj['created_at'] || [];
    if (createTimeArr && createTimeArr.length > 0) {
      valObj['start_time'] = Moment(createTimeArr[0]).valueOf() / 1000
      valObj['end_time'] = Moment(createTimeArr[1]).valueOf() / 1000
      delete valObj['created_at']
    }
    const _params = paginationHandle(valObj);
    const _data = await kingkongList(_params);
    return tableDataHandle(_data)
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        options={false}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                handleModalVisible(true);
                setIsEdit(false);
              }}>
                新建金刚区
              </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getBannerList(params)}
        columns={columns}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            onSubmit={async (value: any) => {
              let success = null;
              if (isEdit) {
                success = await handleUpdate(value);
              } else {
                success = await handleAdd(value)
              }
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
                setFormValues({});
              }
            }}
            onCancel={() => {
              handleModalVisible(false);
              setFormValues({});
            }}
            modalVisible={createModalVisible}
            values={formValues}
          />
        ) : null
      }
    </PageHeaderWrapper>
  );
};

export default TableList;
