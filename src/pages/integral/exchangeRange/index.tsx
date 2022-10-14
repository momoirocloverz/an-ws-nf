import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Modal, Button, InputNumber, Form, Switch,  message, Cascader } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'umi';
import { getRecordRange, createBetween, updateBetween, deleteRange, exchangeRangeShow } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import CreateForm from './components/CreateForm'
import Moment from 'moment';
import styles from './styles.less'


interface RoleProps {
  dispatch: Dispatch;
  accountInfo: any;
  groupList: any;
  areaList: any;
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

const exchangeRange: React.FC<RoleProps> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const { accountInfo, areaList } = props
  const [stepFormValues, setStepFormValues] = useState({});
  const [ areaResult, setArea ] = useState([])
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '积分范围',
      dataIndex: 'user_name',
      hideInSearch: true,
      render: (_, record) => {
        return (
        <div>{record.min} - {record.max}</div>
        )
      }
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists=(areaList.length>0&&accountInfo.role_type === 4)?areaList[0].children:areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    // {
    //   title: '是否显示',
    //   dataIndex: 'is_display',
    //   hideInSearch: true,
    //   render: (_, record) => {
    //     return (
    //       <Switch
    //         defaultChecked={record.show === 1 ? true : false}
    //         onChange={async (checked) => {
    //           const success = await exchangeRangeShow({id: record.id, show: record.show ? '0' : '1'});
    //           if (success) {
    //             if (actionRef.current) {
    //               actionRef.current.reload();
    //             }
    //           }
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {
            <ButtonAuth type="EDIT">
              <a
                className={styles.margin}
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setStepFormValues(record)
                  setIsEdit(true);
                }}
              >
                编辑
              </a>
            </ButtonAuth>
          }
          {
            <ButtonAuth type="DELETE">
              <a
                className={styles.colorTap}
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: '是否确认删除？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const success = await deleteRange({id: record.id});
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
          }
        </>
      ),
    },
  ];

  // 获取列表数据
  const getExchangeList = async (val: any) => {
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    }
    val.area=undefined;
    const params: any = paginationHandle(val);
    console.log(params, 'params')
    if (params.created_at_text) {
      params.begin = Moment(params.created_at_text[0]).valueOf() / 1000;
      params.end = Moment(params.created_at_text[1]).valueOf() / 1000;
      delete params.created_at_text
    }
    const data = await getRecordRange(params);
    return tableDataHandle(data)
  }

  const resetFarmerData = async (val: any) => {
    let _data: any = {};
    if(val.id) {
      _data = await updateBetween({...val})
    } else {
      _data = await createBetween({...val})
    }
    if (_data.code === 0) {
      message.success('保存成功');
      handleUpdateModalVisible(false);
      setStepFormValues({});
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(_data.msg);
    }
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
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleUpdateModalVisible(true);
              setIsEdit(false);
            }}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getExchangeList(params)}
        columns={columns}
      />
      {updateModalVisible ? (
        <CreateForm
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              resetFarmerData(value);
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
    </PageHeaderWrapper>
  );
}



// export default TableList;

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  userAuthButton: user.userAuthButton,
  areaList: info.areaList,
}))(exchangeRange);
