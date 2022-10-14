import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Divider, Cascader } from 'antd';
import { connect } from 'umi';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ConnectState } from '@/models/connect';
import CreateForm from './components/CreateForm';
import DetailForm from './components/DetailForm';
import { TableListItem } from './data.d';
import {
  activityList,
  deleteActivity,
  addActivity,
  editActivity,
} from '@/services/operationCanter';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { checkPermissions } from '@/components/Authorized/CheckPermissions';
import './index.css';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const data = await addActivity(fields);
    if (data.code === 0) {
      message.success('新建成功');
      return true;
    }
    message.error(data.msg);
    return false;
  } catch (err) {
    message.error('新建失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    const _data = await editActivity(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    }
    message.error(_data.msg);
    return false;
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

const TableList: React.FC<any> = (props) => {
  const { userAuthButton, accountInfo, areaList } = props;
  // console.log(userAuthButton);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [hasAreaAuth, setHasAreaAuth] = useState(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100,
      render: (_, record) => (
        <div
          style={{
            width: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {record.activity_name}
        </div>
      ),
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time',
      valueType: 'dateTimeRange',
      width: 200,
      render: (_, record) => (
        <>
          <div>{record.begin_time.split('-').join('.')}</div>
          <span>至</span>
          <div>{record.end_time.split('-').join('.')}</div>
        </>
      ),
    },
    {
      title: '活动描述',
      dataIndex: 'activity_content',
      hideInSearch: true,
      width: 150,
      render: (_, record) => (
        <div
          style={{
            width: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {record.activity_content}
        </div>
      ),
    },
    {
      title: '活动规则',
      dataIndex: 'activity_rule',
      hideInSearch: true,
      width: 150,
      render: (_, record) => (
        <div
          style={{
            width: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {record.activity_rule}
        </div>
      ),
    },
    {
      title: '活动名额',
      dataIndex: 'people',
      hideInSearch: true,
    },
    {
      title: '报名家庭',
      dataIndex: 'apply_family',
      hideInSearch: true,
      render: (_, record) => {
        const contArr = record.apply_family.split(',');
        let contResult = '';
        if (contArr.length > 2) {
          contResult = `${contArr[0]}、${contArr[1]}...`;
        } else {
          contResult = contArr.join('、');
        }
        return <span>{contResult}</span>;
      },
    },
    {
      title: '活动分值',
      dataIndex: 'score',
      hideInSearch: true,
    },
    {
      title: '查看人数',
      dataIndex: 'views',
      hideInSearch: true,
    },
    {
      title: '活动状态',
      dataIndex: 'status_title',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (val: any, record: any) => (
        <>
          {record.status_title === '未开始' && (
            <>
              <ButtonAuth type="EDIT">
                <a
                  onClick={() => {
                    handleModalVisible(true);
                    setIsEdit(true);
                    const data = record;
                    data.timed_release = [record.begin_time, record.end_time];
                    setFormValues(data);
                  }}
                >
                  编辑
                </a>
              </ButtonAuth>
            </>
          )}
          <br />
          <ButtonAuth type="LOOK_DETAIL">
            <a
              onClick={() => {
                setIsEdit(false);
                setShowDetail(true);
                const data = record;
                data.timed_release = [record.begin_time, record.end_time];
                setFormValues(data);
              }}
            >
              查看详情
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="DELETE">
            <a
              className="colorTap"
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '是否要删除该条活动信息？删除后相关的报名信息也将删除',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    deleteItem(record.id);
                  },
                });
              }}
            >
              删除
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  // 删除问答
  const deleteItem = async (id: number) => {
    const data = await deleteActivity({
      activity_id: id,
    });
    const { code } = data;
    if (code === 0) {
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  // 获取列表数据
  const getActivityList = async (val: any) => {
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    const params: any = paginationHandle(val);
    if (params.activity_time) {
      params.begin_time = params.activity_time[0];
      params.end_time = params.activity_time[1];
      delete params.activity_time;
    }
    const data = await activityList(params);
    return tableDataHandle(data);
  };
  const getAuthArr = () => {
    let authArr: string[] = [];
    for (let i = 0; i < userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    const hasColumnAuth: any = checkPermissions('COLUMN_ADDRESS', authArr, true, false);
    setHasAreaAuth(hasColumnAuth);
  };
  useEffect(() => {
    getAuthArr();
  }, [props.userAuthButton]);
  const areaColumn = {
    title: '所属地区',
    dataIndex: 'area',
    width: 120,
    hideInSearch: accountInfo.role_type === 3,
    renderFormItem: () => {
      const areaLists =
        areaList.length > 0 && accountInfo.role_type === 4 ? areaList[0].children : areaList;
      return <Cascader options={areaLists} changeOnSelect />;
    },
  };
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        options={false}
        search={{
          searchText: '搜索',
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                handleModalVisible(true);
                setIsEdit(false);
              }}
            >
              新建
            </Button>
          </ButtonAuth>,
        ]}
        tableAlertRender={false}
        request={(params) => getActivityList(params)}
        // columns={columns}
        columns={hasAreaAuth ? [...columns.slice(0, 8), areaColumn, ...columns.slice(8)] : columns}
      />
      {(formValues && Object.keys(formValues).length) || createModalVisible ? (
        <CreateForm
          isEdit={isEdit}
          values={formValues}
          onSubmit={async (value) => {
            let success = null;
            if (isEdit) {
              success = await handleUpdate(value);
            } else {
              success = await handleAdd(value);
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
        />
      ) : null}
      {showDetail ? (
        <DetailForm
          values={formValues}
          onCancel={() => {
            setShowDetail(false);
            setFormValues({});
          }}
          modalVisible={showDetail}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(TableList);
