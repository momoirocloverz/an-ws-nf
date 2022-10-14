import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, message, Modal, Select, Upload, Cascader, Popover } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { getFamilyGroupList, addFamilyGroup, deleteFamilyGroup, editFamilyGroup, getFamilyGroupInfo, getChooseGroupList, getGroupChange } from '@/services/customer';
import ButtonAuth from '@/components/ButtonAuth';
import CreateFormFamily from './CreateFormFamily';
import FamilyDetail from './FamilyDetail';
import { checkPermissions } from '@/components/Authorized/CheckPermissions';
import { FamilyTableListItem } from '../data.d';
import _ from 'lodash'
// 接口使用模块
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';
import { getLocalToken, } from '@/utils/utils';
import styles from '../index.less'

const { Option } = Select;


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
  try {
    return true;
  } catch (error) {
    return false;
  }
};

const typeEnum = (val: Array<any>) => {
  const _enum = {};
  val.forEach((element: any) => {
    _enum[element.group_id] = {
      text: element.title
    }
  });
  return _enum;
}
// 导入文件
const token = getLocalToken();
const addApiName = {
  api_name: 'import_family_data',
};
const data = getApiParams(addApiName, PUBLIC_KEY);

const Family: React.FC<any> = (props) => {
  const { userAuthButton, areaList } = props
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [detailModal, detailModalVisible] = useState<boolean>(false);
  // const [selfColums, setSelfColums] = useState<Array<any>>([]);
  const [stepFormValues, setStepFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [pageParams, setPageParams] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { dispatch, accountInfo, groupList } = props;
  const [hasAreaAuth, setHasAreaAuth] = useState(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const [areaResult, getAreaList] = useState([])
  const [getGroupList, setGroupList] = useState([])

  const columns: ProColumns<any>[] = [
    {
      title: '家庭ID',
      dataIndex: 'family_id',
      hideInSearch: true,
    },
    {
      title: '家庭户主姓名',
      dataIndex: 'owner_name',
    },
    {
      title: '户主电话',
      dataIndex: 'mobile',
      hideInSearch: true,
      renderText: (_, record) => {
        return (<span>{record.mobile && record.mobile.length === 11 ? record.mobile.replace(/(\d{3})\d*(\d{4})/,"$1****$2") : record.mobile}</span>)
      }
    },
    {
      title: '户主身份证',
      dataIndex: 'identity',
      render: (_, record) => {
        return (<span>{record.identity ? record.identity.replace(/(?<=\d{3})\d{12}(?=\d{2})/,"************") : ''}</span>)
      }
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInTable: false,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaResults = (accountInfo.role_type == 4 && areaResult.length != 0) ? areaResult[0].children : areaResult;
        return (
          // onChange={areaChange}
          <Cascader options={areaResults} onChange={areaChange} changeOnSelect />
        )
      }
    },
    {
      title: '所属小组',
      dataIndex: 'group_id',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_, record) => (<span>{record.title}</span>),
      valueEnum: typeEnum(getGroupList),
      formItemProps: {
        showSearch: true,
        allowClear: true
      }
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
    },
    {
      title: '所属网格',
      dataIndex: 'grid',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '家庭成员',
      dataIndex: 'is_related',
      hideInTable: true,
      renderFormItem: (item, props) => {
        return (
          <Select placeholder="请选择家庭成员关系">
            <Option value="1">已关联</Option>
            <Option value="2">未关联</Option>
          </Select>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <ButtonAuth type="FAMILY_DETAIL">
            <a
              onClick={() => {
                getFamilyGroupInfo({
                  family_id: record.family_id,
                }).then(res => {
                  if (res.code === 0) {
                    setStepFormValues({ ...res.data, area: record.area, group: record.title });
                    detailModalVisible(true);
                  } else {
                    message.error(res.msg);
                  }
                });
              }}
            >
              详情
            </a>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                getFamilyGroupInfo({
                  family_id: record.family_id,
                }).then(res => {
                  if (res.code === 0) {
                    setStepFormValues(res.data);
                    handleUpdateModalVisible(true);
                    setIsEdit(true);
                  } else {
                    message.error(res.msg);
                  }
                });
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <a className={styles.colorTap} onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '是否确定要删除该家庭？当家庭关联的有农户时，删除后，农户的家庭积分将为空，请慎重',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteFamilyGroup({
                    family_id: record.family_id,
                  }).then(res => {
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
            }}>
              删除
            </a>
          </ButtonAuth>
        </div>
      ),
    },
  ];

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
        console.log(info.file);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          if (info.file.response.data.length) {
            Modal.error({
              content: `${info.file.response.data.join("")}`,
            });
          } else {
            message.success(`${info.file.name} 文件导入成功`);
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

  // 获取列表数据
  const getFamilyGroupListData = async (val: any) => {
    getAreaList(areaList)
    if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
      //   setGroupList([])
    } else {
      setGroupList(groupList)
    }
    // if(val.area) {
    //   val.city_id = val.area[0]?val.area[0]:0
    //   val.town_id = val.area[1]?val.area[1]:0
    //   val.village_id = val.area[2]?val.area[2]:0
    //   delete val.area
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    const _params = paginationHandle(val);
    setPageParams(_params)
    const _data = await getFamilyGroupList(_params);
    // if (_data.data.role_type === 2 || _data.data.role_type === 1) {
    //   let arr = [...columns];
    //   arr = columns.map((item: any) => {
    //     if (item.dataIndex === 'area') {
    //       item.hideInTable = false;
    //       item.hideInSearch = true;
    //     }
    //     return item;
    //   });
    //   setSelfColums(arr);
    // }
    return tableDataHandle(_data);
  }
  // 更换村
  const areaChange = async (e: any) => {
    if (e.length > 0) {
      let user = JSON.parse(localStorage.getItem('userInfo'));
      if (user.role_type === 4 && e.length == 2) {
        getGroup(e)
      } else if (user.role_type !== 4 && e.length == 3) {
        getGroup(e)
      }
    } else {
      formRef.current.setFieldsValue({ group_id: '' })
      setGroupList([])
    }
    formRef.current.setFieldsValue({ area: e })
  }
  // 小组数据调用
  const getGroup = async (area: any[]) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));

    // if(val.area) {
    //   val.city_id=user.role_type==4?user.city_id:val.area[0];
    //   val.town_id=user.role_type==4?val.area[0]:val.area[1];
    //   val.village_id=user.role_type==4?val.area[1]:val.area[2];

    const _data = await getGroupChange({
      city_id: user.role_type == 4 ? user.city_id : area[0],
      town_id: user.role_type == 4 ? area[0] : area[1],
      village_id: user.role_type == 4 ? area[1] : area[2]
    })
    if (_data.code === 0) {
      const _arr = _data.data || []
      setGroupList(_arr)
    }
  }

  const getAuthArr = () => {
    let authArr: string[] = [];
    for (let i = 0; i < userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    let hasColumnAuth: any = checkPermissions("COLUMN_ADDRESS", authArr, true, false)

    setHasAreaAuth(hasColumnAuth)
  }

  useEffect(() => {
    // dispatch({
    //   type: 'info/queryChooseGroupList',
    // }).then(() => {
    //   setTimeout(() => {
    //     if (actionRef.current) {
    //       actionRef.current.reload();
    //     }
    //   }, 300);
    // });
    // let arr = [...columns];
    // if (accountInfo.role_type === 2 || accountInfo.role_type === 1) {
    //   arr = columns.map((item: any) => {
    //     if (item.dataIndex === 'area') {
    //       item.hideInTable = false;
    //       item.hideInSearch = true;
    //     }
    //     return item;
    //   });
    // }
    // setSelfColums(arr);
    getAuthArr()
  }, []);

  const handleData = (val: any) => {
    if (!isEdit) {
      addFamilyGroup({
        owner_name: val.owner_name,
        group_id: val.group_id,
        mobile: val.mobile,
        doorplate: val.doorplate,
        grid: val.grid,
        identity: val.identity,
        city_id: val.city_id,
        town_id: val.town_id,
        village_id: val.village_id,
        admin_id: val.admin_id
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
    } else {
      editFamilyGroup({
        owner_name: val.owner_name,
        group_id: val.group_id,
        mobile: val.mobile,
        identity: val.identity,
        doorplate: val.doorplate,
        grid: val.grid,
        family_id: val.family_id,
        city_id: val.city_id,
        town_id: val.town_id,
        village_id: val.village_id,
        admin_id: val.admin_id
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
  // 导出列表
  const exportList = async () => {
    // console.log(pageParams);
    const adminId = JSON.parse(localStorage.getItem('userInfo')).admin_id;
    window.open('/farmapi/gateway?api_name=export_family_list&version=1.2.0&os=h5&sign&is_export=1'
      + (pageParams.owner_name ? '&owner_name=' + pageParams.owner_name : '')
      + (pageParams.doorplate ? '&doorplate=' + pageParams.doorplate : '')
      + (pageParams.identity ? '&identity=' + pageParams.identity : '')
      + (pageParams.group_id ? '&group_id=' + pageParams.group_id : '')
      + '&admin_id=' + adminId
      + (pageParams.city_id ? '&city_id=' + pageParams.city_id : '')
      + (pageParams.town_id ? '&town_id=' + pageParams.town_id : '')
      + (pageParams.village_id ? '&village_id=' + pageParams.village_id : '')
      + (pageParams.is_related ? '&is_related=' + pageParams.is_related : '')
    )
  }

  const loadNewList = (param: any) => {
    if (_.isEmpty(param)) {
      if (actionRef.current) {
        actionRef.current.reset()
      }
    }
  }

  const areaColumn = {
    hideInSearch: true,
    title: '所属地区',
    dataIndex: 'area',
    width: 120
  }
  return (
    <div>
      <ProTable<FamilyTableListItem>
        headerTitle=""
        actionRef={actionRef}
        formRef={formRef}
        rowKey="family_id"
        search={{
          searchText: '搜索',
          labelWidth: 100,
        }}
        toolBarRender={() => [
          <ButtonAuth type="FAMILY_DOWNLOAD">
            {/* <a href="https://img.wsnf.cn/acfile/%E5%AE%B6%E5%BA%AD%E6%A8%A1%E6%9D%BF.xlsx">点击下载家庭模板</a> */}
            {/* <a href="https://img.wsnf.cn/acfile/%E5%AE%B6%E5%BA%AD%E6%A8%A1%E6%9D%BF.xlsx">家庭模板</a> */}
            <Button type="primary" onClick={() => {
              window.location.href = '/家庭模板.xlsx'
            }}>
              家庭模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="FAMILY_IMPORT">
            <Upload {...uploadProps} disabled={loading}>
              <Button disabled={loading} type="primary" loading={loading}>
                {loading ? '正在导入...' : '导入'}
              </Button>
            </Upload>
          </ButtonAuth>,
          <ButtonAuth type="FAMILY_LIST_EXPORT">
            <Button type="primary" onClick={() => { exportList() }}>
              导出
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleUpdateModalVisible(true);
              setIsEdit(false);
            }}>
              新建
            </Button>
          </ButtonAuth>,
        ]}
        // onLoad={(params) => loadNewList(params)}
        options={false}
        request={(params) => getFamilyGroupListData(params)}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
      {stepFormValues && Object.keys(stepFormValues).length || updateModalVisible ? (
        <CreateFormFamily
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              handleData(value);
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
      {detailModal ? (
        <FamilyDetail
          // onSubmit={async (value: any) => {
          //   const success = await handleUpdate(value);
          //   if (success) {
          //     handleData(value);
          //   }
          // }}
          onCancel={() => {
            detailModalVisible(false);
            setStepFormValues({});
          }}
          onOk={() => {
            detailModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={detailModal}
          values={stepFormValues}
        />
      ) : null}
    </div>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  userAuthButton: user.userAuthButton,
  areaList: info.areaList,
}))(Family);
