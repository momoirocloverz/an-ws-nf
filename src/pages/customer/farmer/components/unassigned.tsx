import { UserOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Divider, message, Avatar, Modal, } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateFormUnassigned from './CreateFormUnassigned';
import CreateAreaUnassigned from './CreateAreaUnassigned';
import { TableListItem } from '../data.d';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import {
  getUndistributedFarmerList,
  setDisableFarmer,
  setEnableFarmer,
  editFarmerFamily,
  editAreaFamily
} from '@/services/customer';
import ButtonAuth from '@/components/ButtonAuth';

interface RoleProps {
  dispatch: Dispatch;
  accountInfo: any;
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在配置');
  hide();
  try {
    return true;
  } catch (error) {
    return false;
  }
};

const Unassigned: React.FC<RoleProps> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateVisible, handleUpdateVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [selfColums, setSelfColums] = useState<Array<any>>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { dispatch, accountInfo, } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '农户ID',
      dataIndex: 'user_id',
      hideInSearch: true,
    },
    {
      title: '农户姓名',
      dataIndex: 'farmer',
      renderText: (_, record) => {
      return (<span>{record.farmer_name}</span>)
      }
    },
    {
      title: '农户昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      renderText: (val, record) => {
        if (!val) {
          return (<span>无</span>)
        }

        return (
          <div onClick={
            () => {
              window.open(val);
            }
          }>
            <Avatar src={val} size={64} icon={<UserOutlined />} />
          </div>
        );
      }
    },
    {
      title: '所属家庭',
      dataIndex: 'family',
      hideInSearch: true,
    },
    {
      title: '所属小组 ',
      dataIndex: 'family_group',
      hideInSearch: true,
    },
    {
      title: '所属地区',
      dataIndex: 'city_town',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '提问数 ',
      dataIndex: 'question_num',
      hideInSearch: true,
    },
    {
      title: '回答数',
      dataIndex: 'answer_num',
      hideInSearch: true,
    },
    {
      title: '供需发布数 ',
      dataIndex: 'market_num',
      hideInSearch: true,
    },
    {
      title: '总积分 ',
      dataIndex: 'total_score',
      hideInSearch: true,
    },
    {
      title: '已兑换积分 ',
      dataIndex: 'exchange_score',
      hideInSearch: true,
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <ButtonAuth type="ALLOT">
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
                setIsEdit(true);
              }}
            >
              分配
            </a>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                handleUpdateVisible(true);
                setFormValues(record);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const handleStatus = (val: any, idVal: any) => {
    if (val === 0 || val === 2) {
      return (
        <a onClick={() => {
          Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: val === 0 ? '确定禁用该农户账号信息吗？' : '确定开启该账号吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              if (val === 0) {
                setDisableFarmer({
                  user_id: idVal,
                }).then(res => {
                  if (res.code === 0) {
                    message.success('操作成功');
                  } else {
                    message.error(res.msg);
                  }
                });
              } else {
                setEnableFarmer({
                  user_id: idVal,
                }).then(res => {
                  if (res.code === 0) {
                    message.success('操作成功');
                  } else {
                    message.error(res.msg);
                  }
                });
              }
            },
          });
        }}>
          {
            val === 0 ? '禁用' : '开启'
          }
        </a>
      );
    } else {
      if (val === 1) {
        return (<span>该账号已被注销</span>);
      }

      if (val === 3) {
        return (<span>该账号待审核</span>);
      }

      return (null);
    }

  }

  const editFarmerData = (val: any) => {
    editFarmerFamily({
      ...val,
    }).then(res => {
      if (res.code === 0) {
        message.success('分配成功');
        handleUpdateModalVisible(false);
        setStepFormValues({});
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(res.msg);
      }
    });
  }

  const editAreaData = (val: any) => {
    editAreaFamily({
      ...val,
    }).then(res => {
      if (res.code === 0) {
        message.success('编辑成功');
        handleUpdateVisible(false);
        setFormValues({});
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(res.msg);
      }
    });
  }


  const getUndistributedFarmerListData = async (val: any) => {
    const _params = paginationHandle(val);
    const _data = await getUndistributedFarmerList(_params);
    if (_data.data.role_type === 2 || _data.data.role_type === 1) {
      let arr = [...columns];
      arr = columns.map((item: any) => {
        if (item.dataIndex === 'city_town') {
          item.hideInTable = false;
          item.hideInSearch = true;
        }
        return item;
      });
      setSelfColums(arr);
    }
    return tableDataHandle(_data);
  }

  useEffect(() => {
    dispatch({
      type: 'system/queryRoleList',
      payload: {
        current: 1,
        pageSize: 10,
        total: 10,
      }
    });
    let arr = [...columns];
    if (accountInfo.role_type === 2 || accountInfo.role_type === 1 || accountInfo.role_type === 4) {
      arr = columns.map((item: any) => {
        if (item.dataIndex === 'city_town') {
          item.hideInTable = false;
          item.hideInSearch = true;
        }
        return item;
      });
    }
    setSelfColums(arr);
  }, []);

  return (
    <div>
       <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="user_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={false}

        options={false}
        request={(params) => getUndistributedFarmerListData(params)}
        columns={selfColums}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        scroll={{ x: 1500, }}
      />
      {stepFormValues && Object.keys(stepFormValues).length ||  updateModalVisible ? (
        <CreateFormUnassigned
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              editFarmerData(value);
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {formValues && Object.keys(formValues).length ||  updateVisible ? (
        <CreateAreaUnassigned
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              editAreaData(value);
            }
          }}
          onCancel={() => {
            handleUpdateVisible(false);
            setFormValues({});
          }}
          modalVisible={updateVisible}
          values={formValues}
        />
      ) : null}
    </div>
  );
};

export default connect(({ user, }: ConnectState) => ({
  accountInfo: user.accountInfo,
}))(Unassigned);
