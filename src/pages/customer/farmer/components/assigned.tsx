import { UserOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message, Avatar, Modal, Button, Checkbox, Cascader } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateFormAssigned from './CreateFormAssigned';
import EditUserInfo from './EditUserInfo';
import { TableListItem } from '../data.d';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import {
  getAllocatedFarmerList,
  setDisableFarmer,
  setEnableFarmer,
  editFarmerFamily,
  resetFarmerPlace,
  setPhoto,
  getFarmerDetail,
  setIsEnvInspector,
  setFamilyParty,
} from '@/services/customer';
import ButtonAuth from '@/components/ButtonAuth';
import AuthorizationModal from './AuthorizationModal'
import UserDetail from './UserDetail'
import styles from '../index.less';

interface AssignedProps {
  dispatch: Dispatch;
  accountInfo: any;
  areaList: Array<any>;
  tabProps: any;
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

type permissionUpdateFunctionParams = {
  user_id: string | number;
  can: 1 | 0;
}
const permissionUpdateFunctions: Record<string, (params: permissionUpdateFunctionParams) => Promise<unknown>> = {
  routineInspection: setPhoto,
  envInspection: setIsEnvInspector,
  familyParty: setFamilyParty,
};

const Assigned: React.FC<AssignedProps> = (props) => {
  // const [ updateModalVisible, handleUpdateModalVisible ] = useState<boolean>(false);
  const [ editModalVisible, handleEditModalVisible ] = useState<boolean>(false);
  const [ detailModalVisible, handleDetailModalVisible ] = useState<boolean>(false)
  const [ authorizationModalVisible, setAuthorizationModalVisible ] = useState<boolean>(false);
  const [ stepFormValues, setStepFormValues ] = useState({});
  // const [ isEdit, setIsEdit ] = useState(false);
  const { accountInfo, dispatch, areaList } = props;
  const [ accessVisible, setAccessVisible ] = useState(false);
  const [ userPermissions, setUserPermissions ] = useState({});
  const [ initialUserPermissions, setInitialUserPermissions ] = useState({});
  const [ userObj, setUserObj ] = useState({});
  const [ pageParams, setPageParams ] = useState<any>({});
  const actionRef = useRef<ActionType>();

  const handleCancel = () => {
    setAccessVisible(false);
  }

  const handleAuthorizationCancel = () => {
    setAuthorizationModalVisible(false)
  }

  const handleOk = async () => {
    const tasks = [];
    Object.entries(userPermissions).forEach(([key, value]) => {
      if (value !== initialUserPermissions[key]){
        tasks.push(permissionUpdateFunctions[key]({ ...userObj, can: value ? 1 : 0 }));
      }
    });
    try {
      const results = await Promise.all(tasks);
      const errors = results.filter((result) => (result?.code !== 0));
      if (errors.length > 0) {
        errors.forEach((error) => {
          message.error(`编辑失败: ${error?.msg || ''}`);
        });
        if (results.length > errors.length) {
          message.warn('部分编辑成功');
          setAccessVisible(false);
          actionRef.current?.reload();
        }
      } else {
        message.success('编辑成功');
        setAccessVisible(false);
        if (actionRef.current && results.length > 0) {
          actionRef.current.reload();
        }
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  const handleAccessStatus = (value: any) => {
    return (
      <ButtonAuth type="ACCESS_EDIT">
        <a onClick={() => {
          setAccessVisible(true);
          setUserPermissions({
            routineInspection: !!value.inspect,
            envInspection: !!value.inspect_qyxm,
            familyParty: !!value.inspect_jy,
          });
          setInitialUserPermissions({
            routineInspection: !!value.inspect,
            envInspection: !!value.inspect_qyxm,
            familyParty: !!value.inspect_jy,
          });
          setUserObj({
            user_id: value.user_id
          });
        }}>
          巡查权限
        </a>
        <br/>
      </ButtonAuth>
    )
  }

  const onChangeAccess = (value: any) => {
    const inspectValue = value.target.checked;
    setUserPermissions({
      ...userPermissions,
      routineInspection: inspectValue
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '农户ID',
      dataIndex: 'user_id',
      hideInSearch: true,
      width: 80,
      renderText: (text, record) => {
        return (<div className={styles.inspectContainer}>{record.inspect ? <span className={styles.isInspector}></span> : null } {text}</div>)
      }
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
      render: (_, record) => {
        return (<span>{record.identity ? record.identity.replace(/(?<=\d{3})\d{12}(?=\d{2})/,"************") : ''}</span>)
      }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      renderText: (_, record) => {
        return (<span>{record.mobile && record.mobile.length === 11 ? record.mobile.replace(/(\d{3})\d*(\d{4})/,"$1****$2") : record.mobile}</span>)
      }
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
      title: '所属地区',
      dataIndex: 'city_town',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        let areaLists = (accountInfo.role_type === 4 && areaList.length > 0) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    {
      title: '所属家庭',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return <div>{record.family.owner_name}</div>
      }
    },
    {
      title: '所属小组 ',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return <div>{record.family.group_name}</div>
      }
    },
    {
      title: '门牌号 ',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return <div>{record.family.doorplate}</div>
      }
    },
    {
      title: '巡查员搜索',
      dataIndex: 'inspect',
      hideInTable: true,
      valueEnum: {
        "全部": "全部",
        "否": "否",
        "是": "是"
      }
    },
    {
      title: '所属地区',
      dataIndex: 'city_town',
      hideInTable: true,
      hideInSearch: true,
    },
    // {
    //   title: '提问数 ',
    //   dataIndex: 'question_num',
    //   hideInSearch: true,
    //   width: 80
    // },
    // {
    //   title: '回答数',
    //   dataIndex: 'answer_num',
    //   hideInSearch: true,
    //   width: 80
    // },
    // {
    //   title: '供需发布数 ',
    //   dataIndex: 'market_num',
    //   hideInSearch: true,
    // },
    // {
    //   title: '总积分 ',
    //   dataIndex: 'total_score',
    //   hideInSearch: true,
    //   width: 80
    // },
    // {
    //   title: '已兑换积分 ',
    //   dataIndex: 'exchange_score',
    //   hideInSearch: true,
    // },
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
      width: '120px',
      render: (_, record) => (
        <>
          <ButtonAuth type="FARMER_DETAIL">
            <a onClick={async () => {
              getFarmerDetail({
                user_id: record.user_id
              }).then(r => {
                if(r.code === 0) {
                  handleDetailModalVisible(true)
                  setStepFormValues(r.data)
                }
              })
            }}>
              详情
            </a>
            <br/>
          </ButtonAuth>

          <ButtonAuth type="EDIT">
            <a onClick={async () => {
              handleEditModalVisible(true)
              setStepFormValues(record)
            }}>
              编辑
            </a>
            <br/>
          </ButtonAuth>
          {
            handleAccessStatus(record)
          }
          <ButtonAuth type="AREA_ADMIN">
            <a onClick={async () => {
              setAuthorizationModalVisible(true)
              setStepFormValues(record)
            }}>
              授权管理
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];
  const [selfColums, setSelfColums] = useState(columns);
  const [tabKey, setTabKey] = useState('1');

  // const handleStatus = (val: any, idVal: any) => {
  //   if (val === 0 || val === 2) {
  //     return (
  //       <ButtonAuth type="DISABLE">
  //         <a onClick={() => {
  //           Modal.confirm({
  //             title: '提示',
  //             icon: <ExclamationCircleOutlined />,
  //             content: val === 0 ? '确定禁用该农户账号信息吗？' : '确定开启该账号吗？',
  //             okText: '确认',
  //             cancelText: '取消',
  //             onOk() {
  //               if (val === 0) {
  //                 setDisableFarmer({
  //                   user_id: idVal,
  //                 }).then(res => {
  //                   if (res.code === 0) {
  //                     message.success('操作成功');
  //                     if (actionRef.current) {
  //                       actionRef.current.reload();
  //                     }
  //                   } else {
  //                     message.error(res.msg);
  //                   }
  //                 });
  //               } else {
  //                 setEnableFarmer({
  //                   user_id: idVal,
  //                 }).then(res => {
  //                   if (res.code === 0) {
  //                     message.success('操作成功');
  //                     if (actionRef.current) {
  //                       actionRef.current.reload();
  //                     }
  //                   } else {
  //                     message.error(res.msg);
  //                   }
  //                 });
  //               }
  //             },
  //           });
  //         }}>
  //           {
  //             val === 0 ? '禁用' : '开启'
  //           }
  //         </a>
  //       </ButtonAuth>
  //     );
  //   } else {
  //     if (val === 1) {
  //       return (<span>该账号已被注销</span>);
  //     }

  //     if (val === 3) {
  //       return (<span>该账号待审核</span>);
  //     }

  //     return (null);
  //   }

  // }

  // 获取列表数据
  const getCustomerAssignedList = async (val: any, allot: string) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if(val.city_town) {
      val.city_id=user.role_type==4?user.city_id:val.city_town[0];
      val.town_id=user.role_type==4?val.city_town[0]:val.city_town[1];
      val.village_id=user.role_type==4?val.city_town[1]:val.city_town[2];
      // let len = val.city_town.length
      // if(len === 1) {
      //   val.city_id = val.city_town[0]
      // } else if(len === 2) {
      //   val.city_id = val.city_town[0]
      //   val.town_id = val.city_town[1]
      // } else {
      //   val.city_id = val.city_town[0]
      //   val.town_id = val.city_town[1]
      //   val.village_id = val.city_town[2]
      // }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    val.city_town=undefined;
    const _params:any = paginationHandle(allot ? {...val, allot: allot} : val);
    if(_params.inspect){
      switch (_params.inspect) {
        case "全部":
          _params.inspect = ""
          break;
        case "否":
            _params.inspect = "0"
            break;
        case "是":
          _params.inspect = "1"
          break;
        default:
          break;
      }
    }
    setPageParams(_params)
    const _data = await getAllocatedFarmerList(_params);
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
    console.log(_data, '_data')
    return tableDataHandle(_data);
  }

  // 编辑农户信息
  const editFarmerData = async (val: any) => {
    if(val.area && val.area.length) {
      val.city_id = val.area[0]
      val.town_id = val.area[1]
      val.village_id = val.area[2]
      delete val.area
    }
    let _data = await editFarmerFamily({...val});
    if(_data.code === 0) {
      message.success('编辑成功')
      handleEditModalVisible(false);
      setStepFormValues({});
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(_data.msg);
    }
  }

  useEffect(() => {
    dispatch({
      type: 'info/queryAreaList',
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

  const tablist = [
    {
      key: '1',
      tab: '全部'
    },
    {
      key: '2',
      tab: '已关联农户'
    },
    {
      key: '3',
      tab: '未关联农户'
    }
  ]

  const tabChange = async (e: string) => {
    setTabKey(e)
    getCustomerAssignedList(pageParams, e)
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }

  // 用户导出列表
  const exportList = async () => {
    let cityId = '';
    let townId = '';
    let villageId = '';
    if(accountInfo.role_type == 3) {
      cityId = accountInfo.city_id
      townId = accountInfo.town_id
      villageId = accountInfo.village_id
    } else {
      cityId = pageParams.city_id
      townId = pageParams.town_id
      villageId = pageParams.village_id
    }
    window.open('/farmapi/gateway?api_name=export_farmer&version=1.2.0&os=h5&sign&allot='
      + pageParams.allot
      + (pageParams.farmer ? '&farmer=' + pageParams.farmer : '')
      + (pageParams.identity ? '&identity=' + pageParams.identity : '')
      + (pageParams.inspect ? '&inspect=' + pageParams.inspect : '')
      + (pageParams.mobile ? '&mobile=' + pageParams.mobile : '')
      + (cityId ? '&city_id=' + cityId : '')
      + (townId ? '&town_id=' + townId : '')
      + (villageId ? '&village_id=' + villageId : '')
    )
  }

  return (
    <PageHeaderWrapper
      tabProps={{
        size: 'large',
        tabBarGutter: 60,
        className: styles.tabs
      }}
      tabActiveKey={tabKey}
      tabList={tablist}
      onTabChange={tabChange}
    >
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="user_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={() => [
          <ButtonAuth type="EXPORT_USER">
            <Button type="primary" onClick={()=> {exportList()}}>
              导出
            </Button>
          </ButtonAuth>
        ]}
        options={false}
        request={(params) => getCustomerAssignedList(params, tabKey)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
      {editModalVisible ? (
        <EditUserInfo
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              editFarmerData(value);
            }
          }}
          onCancel={() => {
            handleEditModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={editModalVisible}
          values={stepFormValues}
        />
      ): null}
      {detailModalVisible ? (
        <UserDetail
          onOk={() => {
            handleDetailModalVisible(false);
            setStepFormValues({});
          }}
          onCancel={() => {
            handleDetailModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={detailModalVisible}
          values={stepFormValues}
        />
      ): null}
      <Modal
        visible={accessVisible}
        title="设置权限"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Checkbox onChange={onChangeAccess} checked={userPermissions.routineInspection}>巡查拍照</Checkbox>
        {
          [1, 2].includes(accountInfo.role_type) &&
          <Checkbox onChange={(e) => setUserPermissions({ ...userPermissions, envInspection: e.target.checked })} checked={userPermissions.envInspection}>全域秀美检查权限</Checkbox>
        }
        <Checkbox onChange={(e) => setUserPermissions({ ...userPermissions, familyParty: e.target.checked })} checked={userPermissions.familyParty}>家宴中心管理</Checkbox>
      </Modal>
      {
        authorizationModalVisible ?
          <AuthorizationModal record={stepFormValues} modalVisible={authorizationModalVisible} onCancel={handleAuthorizationCancel} />
        :
          ""
      }
      {/* <AuthorizationModal record={stepFormValues} modalVisible={authorizationModalVisible} onCancel={handleAuthorizationCancel} /> */}
    </PageHeaderWrapper>
  );
};

export default connect(({ info, user, }: ConnectState) => ({
  familyList: info.familyList,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(Assigned);
