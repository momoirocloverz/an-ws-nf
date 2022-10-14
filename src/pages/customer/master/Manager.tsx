import { PlusOutlined, UserOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import {Button, Divider, message, Avatar, Modal, Upload,} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateFormMan from './components/CreateFormMan';
import { TableListItem } from './data.d';
import { ConnectState } from '@/models/connect';
import {tableDataHandle, paginationHandle, getLocalToken, getApiParams} from '@/utils/utils';
import { getMasterManList, editMaster, addMaster, deleteManagerItem } from '@/services/customer';
import _ from 'lodash';
import ButtonAuth from '@/components/ButtonAuth';
import {PUBLIC_KEY} from "@/services/api";
interface AssignedProps {
  dispatch: Dispatch;
  info: any;
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

const Manager: React.FC<AssignedProps> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { dispatch, masterTypeList, masterLevel, } = props;
  const actionRef = useRef<ActionType>();

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

  const columns: ProColumns<TableListItem>[] = [
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
          <span>{record.mobile ? record.mobile.replace(record.mobile.substr(3, 4), "****") : ''}</span>
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
      formItemProps: {
        'allowClear': true
      }
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
      width: '300',
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
                setIsEdit(true);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <br/>
          <ButtonAuth type="DELETE">
            <a onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定要删除该专家信息吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  deletItem(record.expert_id)
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

  const getMasterManListData = async (val: any) => {
    const _params = paginationHandle(val);
    const _data = await getMasterManList(_params);
    return tableDataHandle(_data);
  }

  const addApiName = {
    api_name: 'import_expert',
  };

  const token = getLocalToken();
  const data = getApiParams(addApiName, PUBLIC_KEY);
  const [loading, setLoading] = useState(false);
  const uploadProps = {
    name: 'file',
    action: '/farmapi/gateway',
    headers: {
      authorization: token,
    },
    showUploadList: false,
    data,
    onChange(info: any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          if (info.file.response.data.length) {
            Modal.error({
              content: `${info.file.response.data.join("")}`,
            });
          } else {
            message.success(`${info.file.name} 文件导入成功`);
            actionRef.current.reload();
          }
        } else {
          message.error(info.file.response.msg);
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件导入失败`);
        setLoading(false);
      }
    },
  }

  // 删除
  const deletItem = async (id: any) => {
    const _data = await deleteManagerItem({'expert_id' :id});
    const { code, msg } = _data;
    if (code === 0) {
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(msg);
    }
  }

  useEffect(() => {
    dispatch({
      type: 'info/queryChooseMasterTypeList',
    });

    dispatch({
      type: 'info/queryAreaList',
    });
  }, []);

  const dataHandle = (val: any) => {
    let _obj: any = {
      expert_name: val.expert_name,
      identity_number: val.identity_number,
      mobile: val.mobile,
      expert_type_id: val.expert_type_id,
      level: val.level,
      job_title: val.job_title,
      pro_title: val.pro_title,
      specialty: val.specialty,
      city_id: val.city_id,
      town_id: val.town_id,
      village_id: val.village_id,
      admin_id: val.admin_id
    };

    if (_.isArray(val.imgUrl) && !_.isEmpty(val.imgUrl)) {
      _obj.avatar_id = val.imgUrl[0].uid;
    }

    if (_.isArray(val.area) && !_.isEmpty(val.area)) {
      _obj.city_id = val.area[0] || 0;
      _obj.town_id = val.area[1] || 0;
      _obj.village_id = val.area[2] || 0;
    }else {
      _obj.city_id = 0;
      _obj.town_id = 0;
      _obj.village_id = 0;
    }

    console.log(val);
    if (!val.isEdit) {
      // 新增专家
      addMaster({
        ..._obj,
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
    } else {
      // 编辑
      editMaster({
        expert_id: val.expert_id,
        ..._obj
      }).then(res => {
        if (res.code === 0) {
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
    }
  }

  return (
    <div>
       <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="expert_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://anchuyunwei.oss-cn-hangzhou.aliyuncs.com/linshi/%E4%B8%93%E5%AE%B6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <Upload {...uploadProps} disabled={loading}>
              <Button type="primary" disabled={loading} loading={loading}>
                {loading ? '正在导入...' : '导入'}
              </Button>
            </Upload>
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleUpdateModalVisible(true);
            }}>
              新建专家
            </Button>
          </ButtonAuth>
        ]}
        options={false}
        request={(params) => getMasterManListData(params)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
      {stepFormValues && Object.keys(stepFormValues).length ||  updateModalVisible ? (
        <CreateFormMan
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              dataHandle(value);
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
    </div>
  );
};

export default connect(({ info, }: ConnectState) => ({
  masterTypeList: info.masterTypeList,
  masterLevel: info.masterLevel,
}))(Manager);
