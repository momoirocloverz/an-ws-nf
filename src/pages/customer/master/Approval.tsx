import { PlusOutlined, UserOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Divider, message, Avatar, Modal, } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateFormApproval from './components/CreateFormApproval';
import RejectModal from './components/RejectModal';
import { TableListItem } from './data.d';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { getMasterApproveList, setAudit } from '@/services/customer';
import ButtonAuth from '@/components/ButtonAuth';
import ImgView from '@/components/ImgView';
import _ from 'lodash';

interface RoleProps {
  dispatch: Dispatch;
  masterTypeList: any;
  masterLevel: any;
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    return true;
  } catch (error) {
    return false;
  }
};


const typeEnum = (val:Array<any>) => {
  const _enum = {};
  val.forEach((element:any, index:any) => {
    _enum[element.expert_type_id] = {
      text: element.expert_type_title
    }
  });

  return _enum;
}

const levelEnum = (val:Array<any>) => {
  const _enum = {};
  val.forEach((element:any, index:any) => {
    _enum[element.id] = {
      text: element.title
    }
  });

  return _enum;
}

const Approval: React.FC<RoleProps> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [reasonValues, setReasonValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { dispatch, masterLevel, masterTypeList } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '专家ID',
      dataIndex: 'expert_id',
      hideInSearch: true,
    },
    {
      title: '专家姓名',
      dataIndex: 'expert_name',
    },
    {
      title: '身份证号',
      dataIndex: 'identity_number',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <span>{record.identity_number ? record.identity_number.replace(/(?<=\d{3})\d{12}(?=\d{2})/,"************") : ''}</span>
        )
      }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <span>{record.mobile ? record.mobile.replace(/(\d{3})\d*(\d{4})/,"$1****$2") : ''}</span>
        )
      }
    },
    {
      title: '专家类型',
      dataIndex: 'expert_type_id',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_, record) => (<span>{record.expert_type}</span>),
      valueEnum: typeEnum(masterTypeList),
    },
    {
      title: '认证级别',
      dataIndex: 'level',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_, record) => (<span>{record.level_name}</span>),
      valueEnum: levelEnum(masterLevel),
    },
    {
      title: '职务',
      dataIndex: 'job_title',
      hideInSearch: true,
    },
    {
      title: '职称',
      dataIndex: 'pro_title',
      hideInSearch: true,
    },
    {
      title: '专家特长',
      dataIndex: 'specialty',
      hideInSearch: true,
    },
    {
      title: '专家头像',
      dataIndex: 'avatar_url',
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
      title: '身份证正反面图片',
      hideInSearch: true,
      width: 140,
      renderText: (val, record) => {
        return (
          <>
            <ImgView url={record.front_image_url} width={120} />
            <ImgView url={record.back_image_url} width={120} />
          </>
        );
      }
    },
    {
      title: '回答数',
      dataIndex: 'answers',
      hideInSearch: true,
    },
    {
      title: '属地',
      dataIndex: 'city_town',
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_, record) => (<span>{record.cn_status}</span>),
      valueEnum: {
        0: { text: '审核中' },
        1: { text: '审核通过' },
        2: { text: '审核失败' },
      },
    },
    {
      title: '备注',
      dataIndex: 'reason',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          {
            (record.status === 1 || record.status === 2) ? null :(
              <ButtonAuth type="AUDIT">
                <a
                  onClick={() => {
                    handleUpdateModalVisible(true);
                    setStepFormValues(record);
                    setIsEdit(true);
                  }}
                >
                  审核
                </a>
              </ButtonAuth>
            )
          }
        </>
      ),
    },
  ];

  const getMasterApproveListData = async (val: any) => {
    const _params = paginationHandle(val);
    const _data = await getMasterApproveList(_params);
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
  }, []);

  return (
    <div>
       <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="expert_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={false}
        options={false}
        request={(params) => getMasterApproveListData(params)}
        columns={columns}
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
        <CreateFormApproval
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            console.log(value);
            Modal.confirm({
              title: '提示',
              icon: <ExclamationCircleOutlined />,
              content: '是否确认审核通过?',
              okText: '确认',
              cancelText: '取消',
              onOk() {
                // 确认审核通过
                setAudit({
                  status: 1,
                  expert_id: value.expert_id,
                }).then(res => {
                  if (res.code ===0) {
                    message.success('操作成功');
                    handleUpdateModalVisible(false);
                    setStepFormValues({});
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
          onCancel={(val: any) => {
            setReasonValues(stepFormValues);
            setReasonModalVisible(true);
          }}
          close={
            () => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }
          }
          modalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {
        reasonModalVisible ? (
          <RejectModal
            onSubmit = {
              async (value: any) => {
                setAudit({
                  status: 2,
                  expert_id: value.expert_id,
                  reason: value.reason,
                }).then(res => {
                  if (res.code ===0) {
                    message.success('操作成功');
                    setReasonModalVisible(false);
                    setReasonValues({});
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
            }
            onCancel ={
              () => {
                setReasonModalVisible(false);
                setReasonValues({});
              }
            }
            modalVisible={reasonModalVisible}
            values={reasonValues}
          />
        ) : null
      }
    </div>
  );
};

export default connect(({ info, }: ConnectState) => ({
  masterTypeList: info.masterTypeList,
  masterLevel: info.masterLevel,
}))(Approval);
