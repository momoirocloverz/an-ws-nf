import { PlusOutlined, UserOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Divider, message, Avatar, Modal, Upload, Cascader } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateFormGroup from './CreateFormGroup';
import { TableListItem } from '../data.d';
import { ConnectState } from '@/models/connect';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { getGroupList, editGroup, addGroup, deleteGroup, } from '@/services/customer';
import ButtonAuth from '@/components/ButtonAuth';
// 接口使用模块
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';
import { getLocalToken, } from '@/utils/utils';
import styles from '../index.less'

interface RoleProps {
  dispatch: Dispatch;
  accountInfo: any;
  areaList: any;
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在操作中');
  try {

    hide();
    return true;
  } catch (error) {
    hide();
    return false;
  }
};


// 导入文件
const token = getLocalToken();
const addApiName = {
  api_name: 'import_group_data',
};
const data = getApiParams(addApiName, PUBLIC_KEY);

const Group: React.FC<RoleProps> = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [selfColums, setSelfColums] = useState<Array<any>>([]);
  const [stepFormValues, setStepFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [pageParams,setPageParams] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { dispatch, accountInfo, areaList } = props;
  const actionRef = useRef<ActionType>();
  const [ areaResult, getAreaList ] = useState([])
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '小组ID',
      dataIndex: 'group_id',
      hideInSearch: true,
    },
    {
      title: '小组名称',
      dataIndex: 'group_name',
      renderText: (_, record) => (<span>{record.title}</span>)
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaResults=(accountInfo.role_type==4&&areaResult.length!=0)?areaResult[0].children:areaResult;
        return (
          <Cascader options={areaResults} changeOnSelect/>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
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
          <ButtonAuth type="DELETE">
            <a className={styles.colorTap} onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除该分组吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteGroup({
                    group_id: record.group_id,
                  }).then(res => {
                    if (res.code === 0) {
                      message.success('删除成功');
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    } else {
                      message.error(res.msg);
                    }
                  })
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
    onChange(info:any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
        console.log(info.file);
      }
      if (info.file.status === 'done') {
        if(info.file.response.code === 0){
          message.success(`${info.file.name} 文件导入成功`);
        }else{
          message.error(info.file.response.msg);
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件导入失败`);
        setLoading(false);
      }
    },
  }

  // 导出列表
  const exportList = async () => {
    console.log(pageParams, 'pageParams')
    const adminId = JSON.parse(localStorage.getItem('userInfo')).admin_id;
    window.open('/farmapi/gateway?api_name=export_group_list&version=1.2.0&os=h5&sign&is_export=1&group_name='+(pageParams.group_name?pageParams.group_name:'')
      + '&keyword=' + (pageParams.key_word ? pageParams.keyword : '')
      + '&admin_id=' + adminId
      + (pageParams.city_id ? '&city_id=' + pageParams.city_id : '')
      + (pageParams.town_id ? '&town_id=' + pageParams.town_id : '')
      + (pageParams.village_id ? '&village_id=' + pageParams.village_id : '')
    )
  }
  // 获取俩表数据
  const getGroupListData = async (val: any) => {
    getAreaList(areaList)
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    let user = JSON.parse(localStorage.getItem('userInfo'))
    console.log(user, 'user')
    if(val.area) {
      val.city_id = user.role_type==4 ? user.city_id : val.area[0]
      val.town_id = user.role_type==4 ? val.area[0] : val.area[1]
      val.village_id = user.role_type==4 ? val.area[1] : val.area[2]
    }
    val.area=undefined;
    const _params = paginationHandle(val);
    setPageParams(_params)
    const _data = await getGroupList(_params);
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

  useEffect(() => {
    dispatch({
      type: 'system/queryRoleList',
      payload: {
        current: 1,
        pageSize: 10,
        total: 10,
      }
    });
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
  }, []);

  const handleData = (val: any) => {
    if (!val.isEdit) {
      addGroup({
        leader: val.leader,
        title: val.title,
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
      editGroup({
        leader: val.leader,
        title: val.title,
        group_id: val.group_id,
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

  return (
    <div>
       <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="group_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={() => [
          <ButtonAuth type="FAMILY_DOWNLOAD">
            {/* <a href="https://img.wsnf.cn/acfile/%E5%B0%8F%E7%BB%84%E6%A8%A1%E6%9D%BF.xlsx">点击下载分组模板</a> */}
            {/* <a href="https://img.wsnf.cn/acfile/%E5%B0%8F%E7%BB%84%E6%A8%A1%E6%9D%BF.xlsx">分组模板</a>  */}
            <Button type="primary" onClick={() => {
              window.location.href = 'https://img.wsnf.cn/acfile/%E5%B0%8F%E7%BB%84%E6%A8%A1%E6%9D%BF.xlsx'
            }}>
              分组模板
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
            <Button type="primary" onClick={()=> {exportList()}}>
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
          </ButtonAuth>
        ]}

        options={false}
        request={(params) => getGroupListData(params)}
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
        <CreateFormGroup
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
      {/* {
        loading ? (
          <div className="wait-page">
            <img src="https://img.hzanchu.com/acimg/f487ea01eaf13307f8c8a8dd05127f27.gif" alt="正在导入"/>
          </div>
        ) : null
      } */}
    </div>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(Group);
