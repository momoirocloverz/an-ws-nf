import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, message, Switch, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm2';
import Moment from 'moment';
import { TableListItem } from './data.d';
import {
  classList,
  classIsTop,
  classIsShow,
  getTypeData,
  addClass,
  editClass,
  deletClassItem
} from '@/services/train';
import ImgView from '@/components/ImgView';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';

const TableList: React.FC<any> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [typeList, setTypeList] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '课程ID',
      dataIndex: 'train_id',
      hideInSearch: true,
    },
    {
      title: '课程标题',
      dataIndex: 'title',
    },
    {
      title: '课程类型',
      dataIndex: 'category_id',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      valueEnum: typeList,
      formItemProps: {
        'allowClear': true
      },
      render: (_, record) => {
        return (<span>{record.category_title}</span>)
      }
    }, 
    {
      title: '课程封面',
      dataIndex: 'cover_image_url',
      hideInSearch: true,
      renderText: (val, record) => {
        return (
          <ImgView url={val} width={100} />
        );
      }
    },
    {
      title: '发布时间',
      dataIndex: 'timed_release',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return <span>{Moment(record.timed_release * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: '发布状态',
      dataIndex: 'release_staus',
      hideInSearch: true,
      render: (_, record) => {
        return (<span>{record.release_staus === 0 ? '未发布' : '已发布'}</span>)
      }
    },
    {
      title: '是否显示',
      dataIndex: 'is_display',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.is_display === 1 ? true : false}
            onChange={async (checked) => {
              const success = await  changeStatus('2', checked, record.train_id);
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
      title: '是否置顶',
      dataIndex: 'is_top',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.is_top === 1 ? true : false}
            onChange={async (checked) => {
              const success = await  changeStatus('1', checked, record.train_id);
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
      title: '播放数',
      dataIndex: 'views',
      hideInSearch: true,
    },
    {
      title: '分享数',
      dataIndex: 'shares',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'updated_at',
      hideInSearch: true,
    }, 
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
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
          <Divider type="vertical" />
          <ButtonAuth type="DELETE">
            <a 
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定删除本条课堂数据吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record['train_id']);
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
        </>
      ),
    },
  ];

  // 获取列表数据
  const getClassList = async (val:any) => {
    const _params = paginationHandle(val);
    const _data = await classList(_params)
    return tableDataHandle(_data)
  }

  // 获取分类数据
  const getTypeList = async () => {
    const _data = await getTypeData({});
    if (_data.code === 0) {
      const res = _data.data && _data.data.rows || [];
      const _values = {};
      res.forEach((item: any) => {
        _values[item.id] = { text: item.title };
      });
      setTypeList(_values);
    }
  }

  /**
 * 删除节点
 * @param id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletClassItem({ train_id: id })
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

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: any) => {
    try {
      if (!fields.video_id) {
        message.error('请上传视频');
        return false;
      }
      if (!fields.cover_image_id) {
        message.error('请上传封面图片');
        return false;
      }
      let _data: any = {};
      if (isEdit) {
        _data = await editClass(fields);
      } else {
        _data = await addClass(fields);
      }
      if (_data.code === 0) {
        message.success(isEdit ? '编辑成功' : '新增成功');
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.success(isEdit ? '编辑失败' : '新增失败');
      return false;
    }
  };

  // 更新状态
  const changeStatus = async (num: string, checked: boolean, id: number) => {
    try {
      let _data: any = {};
      if (num === '1') {
        _data = await classIsTop({
          train_id: id,
          is_top: checked ? '1' : '0'
        });
      } else {
        _data = await classIsShow({
          train_id: id,
          is_display: checked ? '1' : '0'
        });
      }
      if (_data.code === 0) {
        message.success('状态更新成功');
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.error('更新失败');
      return false;
    }
  }

  useEffect(() => {
    getTypeList();
  }, []);

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="train_id"
        options={false}
        search={{
          searchText: '搜索',
        }}
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
              新建课程
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getClassList(params)}
        columns={columns}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            typeList={typeList}
            onSubmit={async (value:any) => {
              const success = await handleAdd(value);
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
