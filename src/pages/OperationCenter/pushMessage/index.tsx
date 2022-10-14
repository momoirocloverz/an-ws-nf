import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Divider, Cascader } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { activityList, deleteActivity, addActivity, editActivity } from '@/services/operationCanter';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  noticeList,
  makeNotice,
  sendNotice,
  deleteNotice
} from '@/services/operationCanter'
import {checkPermissions} from '@/components/Authorized/CheckPermissions';
import CreateForm from './components/CreateForm';
import styles from '../index.less'

const pushMessage: React.FC<any> = (props) => {
  const { accountInfo, areaList } = props
  const [ moduleVisible, handleModalVisible ] = useState<boolean>(false);
  const [ formValues, setFormValues ] = useState({});
  const [ isEdit, setIsEdit ] = useState(false);
  const [ showDetail, setShowDetail ] = useState(false);
  const [ hasAreaAuth, setHasAreaAuth ] = useState(false);
  const actionRef = useRef<ActionType>();

  interface TableListItem {
    id: number;
    begin_time: string;
    end_time: String;
    activity_content: String;
    activity_rule: String;
    activity_name: String;
    apply_family: String;
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '推送时间',
      dataIndex: 'push_time',
      valueType: 'dateTimeRange',
    },
    {
      title: '推送地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists=(areaList.length>0&&accountInfo.role_type===4)?areaList[0].children:areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      },
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_: any, record: any) => {
        return <span>{record.status === 0 ? '未推送' : '已推送'}</span>
      },
      valueEnum: {
        '0': '未推送',
        '1': '已推送'
      },
      formItemProps: {
        allowClear: true
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (val: any, record: any) => (
        <>
          {
            record.status === 0 ? (
              <ButtonAuth type="PUSH_MESSAGE">
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '提示',
                      icon: <ExclamationCircleOutlined />,
                      content: '确定要推送此条消息吗？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk() { toPush(record.id) },
                    });
                  }}
                >
                  推送
                </a>
                <br/>
              </ButtonAuth>
            ) : null
          }
          {
            record.status === 0 ? (
              <ButtonAuth type="EDIT_MESSAGE">
                <a
                  onClick={() => {
                    setIsEdit(true);
                    handleModalVisible(true);
                    setFormValues(record)
                    // const data = record;
                    // data.timed_release = [record.begin_time, record.end_time];
                    // setFormValues(data);
                  }}
                >
                  编辑
                </a>
                <br/>
              </ButtonAuth>
            ) : null
          }
          <ButtonAuth type="DELETE_MESSAGE">
            <a
              className={styles.colorTap}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定要删除此条消息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() { deleteItem(record.id) },
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

  // 拉取数据
  const getActivityList = async (val: any) => {
    // if(val.area) {
    //   let len = val.area.length
    //   if(len === 1) {
    //     val.city_id = val.area[0]
    //   } else if(len === 2) {
    //     val.city_id = val.area[0]
    //     val.town_id = val.area[1]
    //   } else {
    //     val.city_id = val.area[0]
    //     val.town_id = val.area[1]
    //     val.village_id = val.area[2]
    //   }
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    if(val.push_time && val.push_time.length) {
      val.start_time = new Date(val.push_time[0]).getTime() / 1000
      val.end_time = new Date(val.push_time[1]).getTime() / 1000
    }
    val.area=undefined;
    const _params = paginationHandle(val)
    const _data = await noticeList(_params)
    return tableDataHandle(_data)
  }

  // 删除消息
  const deleteItem = async (val: string) => {
    const _data = await deleteNotice({id: val})
    if(_data.code === 0) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  // 推送消息
  const toPush = async (val: string) => {
    const _data = await sendNotice({id: val})
    if(_data.code === 0) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  // 创建、编辑消息
  const makeMessage = async (val: any) => {
    const _data = await makeNotice(val)
    if(_data.code === 0) {
      handleModalVisible(false);
      setFormValues({});
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

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
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE_MESSAGE">
            <Button type="primary" onClick={() => {
              handleModalVisible(true);
              setIsEdit(false);
            }}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getActivityList(params)}
        columns={columns}
      />
      {
        moduleVisible ? (
          <CreateForm
            isEdit={isEdit}
            onSubmit={async (value: any) => {
              await makeMessage(value)
            }}
            onCancel={() => {
              handleModalVisible(false);
              setFormValues({});
            }}
            modalVisible={moduleVisible}
            values={formValues}
          />
        ) : null
      }
    </PageHeaderWrapper>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(pushMessage);
