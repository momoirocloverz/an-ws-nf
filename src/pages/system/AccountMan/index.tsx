import { PlusOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Avatar, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ResetPass from './components/ResetPass';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data.d';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle, passwordEncryption } from '@/utils/utils';
import {
  getAccountList,
  createAccount,
  editAccount,
  deleteAccount,
  resetAccountPass,
  setAccountStatus,
  getRolePageList,
  unbindAccount,
} from '@/services/system';
import { passwordEncrypt } from '@/utils/utils';
import _ from 'lodash';

interface RoleProps {
  dispatch: Dispatch;
  pubKey: string;
}

const AccountTableList: React.FC<RoleProps> = (props) => {
  const [resetPassVisible, setResetPassVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [resetPassId, setResetPassId] = useState<any>();
  const [valueEnum, setValueEnum] = useState({})

  const { dispatch, pubKey } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'admin_id',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      render: (item, record) => {
        return (
          <span>{record.mobile ? record.mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : ''}</span>
        );
      },
    },
    {
      title: '角色名',
      dataIndex: 'role_id',
      valueEnum,
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      render: (_, record) => {
        return <p>{record.role_name}</p>;
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      renderText: (val, record) => {
        if (!val) {
          return <span>无</span>;
        }

        return (
          <div
            onClick={() => {
              window.open(val);
            }}
          >
            <Avatar src={val} size={64} icon={<UserOutlined />} />
          </div>
        );
      },
    },
    {
      title: '所属地区',
      dataIndex: 'area_name',
      hideInSearch: true,
    },
    {
      title: '浙政钉绑定',
      dataIndex: 'is_bind',
      render: (item, record) => {
        return <span>{record.is_bind ? '是' : '否'}</span>;
      },
    },
    {
      title: '浙政钉姓名',
      dataIndex: 'zzd_name',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除该账号信息吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteAccount({
                    admin_id: record.admin_id,
                  }).then((res) => {
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
          {record.is_bind ? (
            <a
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定解除该账号与浙政钉的绑定吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    // 确认删除
                    unbindAccount({
                      admin_id: record.admin_id,
                    }).then((res) => {
                      if (res.code === 0) {
                        message.success('解绑成功');
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
              解绑
            </a>
          ) : null}
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setFormValues(record);
              setIsEdit(true);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              const _status = record.status;
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: _status === 0 ? '确认禁用该账号？' : '确认启用该账号？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  //  0：正常 1：删除 2：禁用
                  setAccountStatus({
                    admin_id: record.admin_id,
                    status: _status === 0 ? 2 : 0,
                  }).then((res) => {
                    if (res.code === 0) {
                      message.success('操作成功');
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
            {record.status === 0 ? <span>禁用</span> : <span>开启</span>}
          </a>
          <a
            onClick={() => {
              setResetPassId(record.admin_id);
              setResetPassVisible(true);
            }}
          >
            重置密码
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'info/queryAccountRoleList',
    });

    dispatch({
      type: 'info/queryAreaList',
    });

    getRoleList();
  }, []);

  // 获取角色信息
  const getRoleList = async () => {
    const _data = await getRolePageList({
      page: 1,
      page_size: 9999,
    });
    if (_data.code === 0) {
      const list = (_data && _data.data && _data.data.data) || [];
      const result = {};
      if (list.length > 0) {
        list.forEach((item: any, index: number) => {
          result[item.role_id] = { text: item.role_name };
        });
        setValueEnum(result);
      }
    }
  };

  const getAccountListData = async (val: any) => {
    const _params = paginationHandle(val);
    const _data = await getAccountList(_params);
    return tableDataHandle(_data);
  };

  const formHandle = (val: any) => {
    let _obj: any = {
      user_name: val.user_name,
      real_name: val.real_name,
      mobile: val.mobile,
      password: passwordEncrypt(val.password),
      sign_password: passwordEncryption(
        val.password,
        pubKey
      ),
      role_id: val.role_id,
    };

    if (!_.isEmpty(val.wechat)) {
      _obj.wechat = val.wechat;
    }
    if (_.isArray(val.imgUrl) && !_.isEmpty(val.imgUrl)) {
      _obj.avatar_id = val.imgUrl[0].uid;
    }
    if (_.isArray(val.area) && !_.isEmpty(val.area)) {
      _obj.city_id = val.area[0] || 0;
      _obj.town_id = val.area[1] || 0;
      _obj.village_id = val.area[2] || 0;
    } else {
      _obj.city_id = 0;
      _obj.town_id = 0;
      _obj.village_id = 0;
    }

    const hide = message.loading('正在添加');
    hide();

    console.log(val);

    if (!isEdit) {
      createAccount({
        ..._obj,
      }).then((res) => {
        if (res.code === 0) {
          message.success('添加成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          handleUpdateModalVisible(false);
          setFormValues({});
        } else {
          message.error(res.msg);
        }
      });
    } else {
      editAccount({
        admin_id: val.admin_id,
        ..._obj,
      }).then((res) => {
        if (res.code === 0) {
          message.success('添加成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          handleUpdateModalVisible(false);
          setFormValues({});
        }
      });
    }
  };

  const resetPassData = (val: any) => {
    resetAccountPass({
      admin_id: val.adminId,
      password: passwordEncrypt(val.password),
      sign_password: passwordEncryption(
        val.password,
        pubKey
      )
    }).then((res) => {
      if (res.code === 0) {
        message.success('密码重置成功');
        setResetPassVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="admin_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={() => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
              setIsEdit(false);
            }}
          >
            添加账号
          </Button>,
        ]}
        options={false}
        request={(params) => getAccountListData(params)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
      />
      {resetPassVisible ? (
        <ResetPass
          adminId={resetPassId}
          onSubmit={(value) => {
            resetPassData(value);
          }}
          onCancel={() => setResetPassVisible(false)}
          modalVisible={resetPassVisible}
        />
      ) : null}
      {(formValues && Object.keys(formValues).length) || updateModalVisible ? (
        <UpdateForm
          values={formValues}
          isEdit={isEdit}
          onSubmit={(value: any) => {
            formHandle(value);
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setFormValues({});
          }}
          modalVisible={updateModalVisible}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ info, login }: ConnectState) => ({
  accountRoleList: info.accountRoleList,
  pubKey: login.pubKey
}))(AccountTableList);
