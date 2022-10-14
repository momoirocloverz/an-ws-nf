import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Cascader, Upload, DatePicker, Popover } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import Moment from 'moment';
import CreateForm from './components/CreateForm';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { TableListItem } from './data.d';
import {checkPermissions} from '@/components/Authorized/CheckPermissions';
import styles from './style.less'
import { shareBonusList, addBonus, updataBonus, houseCodeList, deleteBonus } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
// 接口使用模块
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';
import { getLocalToken, } from '@/utils/utils';
import { values } from 'lodash';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await addBonus(fields);
    if (_data.code === 0) {
      message.success('新建成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
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
    const _data = await updataBonus(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

const SORT_TYPE: any = {
  'stock': {text: '按股数排序'},
  'integral': {text: '按积分数排序'}
}
const SORT_VALUE: any = {
  'asc': {text: '升序'},
  'desc': {text: '降序'}
}

// 导入文件
const token = getLocalToken();
const addApiName = {
  api_name: 'import_stock_data',
};
const data = getApiParams(addApiName, PUBLIC_KEY);

const TableList: React.FC<any> = (props) => {
  const { userAuthButton, accountInfo, roleAreaList } = props;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [houseNumberList, setHouseNumberList] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasAreaAuth, setHasAreaAuth] = useState(false);
  const [pageParams,setPageParams] = useState<any>({});
  const [ diff, setDiff ] = useState<any>('')
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '家庭ID',
      dataIndex: 'family_id',
      hideInSearch: true,
    },
    {
      title: '家庭户主',
      dataIndex: 'owner_name',
    },
    {
      title: '户主手机号',
      dataIndex: 'mobile',
      // hideInSearch: true,
    },
    {
      title: '所属网格',
      dataIndex: 'grid',
      hideInSearch: true,
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
      hideInSearch: true,
    },
    {
      title: '股数',
      dataIndex: 'stock_number',
      hideInSearch: true,
    },
    {
      title: '积分数',
      dataIndex: 'integral',
      hideInSearch: true,
      render: (item, record:any) => {
        return (
          record.different ? 
          <Popover  content={`系统检测该家庭积分实际为${record.sum_integral}，与导入值有差异`} title="警告" trigger="hover">
            <div className={styles.different}>{record.integral}</div>
          </Popover> : <div>{record.integral}</div>
          
        )
      }
    },
    {
      title: '基本股分红',
      dataIndex: 'dividend',
      hideInSearch: true,
    },
    {
      title: '积分分红',
      dataIndex: 'integral_bonus',
      hideInSearch: true,
    },
    {
      title: '排序类型',
      dataIndex: 'sort_type',
      valueEnum: SORT_TYPE,
      hideInTable: true,
      render: (_, record) => {
        return (<span></span>)
      }
    },
    {
      title: '排序方式',
      dataIndex: 'sort_value',
      valueEnum: SORT_VALUE,
      hideInTable: true,
      render: (_, record) => {
        return (<span></span>)
      }
    },
    {
      title: '年份',
      dataIndex: 'year',
      initialValue: Moment().subtract(1,"year"),
      renderFormItem: (item, props) => {
        return (
          <DatePicker placeholder="请选择" picker="year" {...props}></DatePicker>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (val: any, record: any) => (
        <>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                handleModalVisible(true);
                setIsEdit(true);
                setFormValues(record);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <br/>
          <ButtonAuth type="DELETE">
            <a 
              className={styles.colorTap}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '是否要删除该条分红信息?',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() { deleteHandle(record.id) },
                })
              }}>
              删除
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const getIntegralSharesList = async (val:any, different:any) => {
    if(val.sort_type && val.sort_value) {
      val[val.sort_type] = val.sort_value
      delete val.sort_type
      delete val.sort_value
    }
    if(val.area) {
      if(accountInfo.role_type === 4){
        val.town_id = val.area[0];
        val.village_id = val.area[1] || ""
      }else{
        val.city_id = val.area[0];
        val.town_id = val.area[1] || "";
        val.village_id = val.area[2] || "";
      }
      delete val.area
    }
    val['year'] = val.year ? Moment(val.year).format('YYYY') : ''
    const _params = paginationHandle({...val, different});
    setPageParams(_params)
    const _data = await shareBonusList(_params)
    return tableDataHandle(_data)
  }

  const uploadProps = {
    name: 'file',
    action: '/farmapi/gateway',
    headers: {
      authorization: token,
    },
    data,
    showUploadList: false,
    onChange(info:any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
        console.log(info.file);
      }
      if (info.file.status === 'done') {
        if(info.file.response.code === 0){
          console.log(info);
          if(info.file.response.data.length>0){
            Modal.error({
              content: `${info.file.response.data.join(",")}导入失败`,
            });
          }else{
            message.success(`${info.file.name} 文件导入成功`);
          }
          if (actionRef.current) {
            actionRef.current.reload();
          }
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

  // 删除
  const deleteHandle = async (id: number) => {
    const data = await deleteBonus({'stock_id':id})
    const { code, msg } = data
    if (code === 0) {
      message.success('删除成功')
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(msg)
    }
  }

  // 获取小组列表
  const getHouseNumberList = async () => {
    try {
      const _data = await houseCodeList();
      const { code, data, msg } = _data || {};
      if (code === 0) {
        const obj = {}
        data.forEach((item:any) =>{
          obj[item.doorplate] = {text: item.doorplate}
        })
        setHouseNumberList(obj);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error('门牌号获取失败');
    }
  };

  const getAuthArr = () => {
    let authArr: string[] = [];
    for(let i=0; i<userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    let hasColumnAuth:any = checkPermissions("COLUMN_ADDRESS", authArr, true, false)
    setHasAreaAuth(hasColumnAuth)
  }

     // 导出列表
     const exportList = async () => {
      const group_name = pageParams.group_name ? `&group_name=${pageParams.group_name}` : ''
      const owner_name = pageParams.owner_name ? `&group_name=${pageParams.owner_name}` : ''
      const family_rank = pageParams.family_rank ? `&group_name=${pageParams.family_rank}` : ''
      const group_rank = pageParams.group_rank ? `&group_name=${pageParams.group_rank}` : ''
      const status = pageParams.status ? `&group_name=${pageParams.status}` : ''
      const point_start_time = pageParams.point_start_time ? `&group_name=${pageParams.point_start_time}` : ''
      const point_end_time = pageParams.point_end_time ? `&group_name=${pageParams.point_end_time}` : ''
      const year = pageParams.year ? `&year=${pageParams.year}` : ''
      let city_id = ''  
      let town_id = ''
      let village_id = ''
      if([1,2].includes(accountInfo.role_type)){
        city_id = pageParams.city_id ? `&city_id=${pageParams.city_id}` : ''  
        town_id = pageParams.town_id ? `&town_id=${pageParams.town_id}` : ''
        village_id = pageParams.village_id ? `&village_id=${pageParams.village_id}` : ''
      }else if(accountInfo.role_type === 4){
        // city_id = pageParams.city_id ? `&city_id=${pageParams.city_id}` : ''  
        town_id = pageParams.town_id ? `&town_id=${pageParams.town_id}` : ''
        village_id = pageParams.village_id ? `&village_id=${pageParams.village_id}` : ''
      }
   
      const adminId = JSON.parse(localStorage.getItem('userInfo')).admin_id;
      window.open(`/farmapi/gateway?api_name=export_stock&version=1.2.0&os=h5&sign&is_export=1${group_name}${owner_name}${family_rank}${group_rank}${status}${point_start_time}${point_end_time}${year}&admin_id=${adminId}${city_id}${town_id}${village_id}`)
    }

  useEffect(() => {
    getHouseNumberList()
    getAuthArr();
  }, [props.userAuthButton]);
  
  const areaColumn = {
    title: '所属地区',
    dataIndex: 'area',
    width: 120,
    hideInSearch: accountInfo.role_type === 3 ? true : false,
    renderFormItem: () => {
      return (
        <Cascader options={roleAreaList} changeOnSelect/>
      )
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
          collapsed: false
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="UPLOAD_SHARE_MODEL">
            <Button type="primary" onClick={() => {
              window.location.href = 'https://img.wsnf.cn/acfile/%E8%82%A1%E6%9D%83%E5%88%86%E7%BA%A2%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
            }}>
              股金分红模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="SHARE_IMPORT">
            <Upload {...uploadProps} disabled={loading}>
              <Button disabled={loading} type="primary" loading={loading}>
                {loading ? '正在导入...' : '股金分红导入'}
              </Button>
            </Upload>
          </ButtonAuth>,
          <ButtonAuth type="SHARE_BONUS_EXPORT">
          <Button type="primary" onClick={()=> {exportList()}}>
              股金分红导出
            </Button>,
          </ButtonAuth>,
          <ButtonAuth type="CHECK_DIFFERENT">
            {
              diff 
              ? <Button type="primary" onClick={() => {
                setDiff('')
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}>
                恢复默认数据
              </Button> 
              : <Button type="primary" onClick={() => {
              setDiff(1)
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              查看差异数据
            </Button>
            }
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleModalVisible(true);
              setIsEdit(false);
            }}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getIntegralSharesList({year: Moment().subtract(1,"year"), ...params}, diff)}
        columns={hasAreaAuth?[...columns.slice(0,3),areaColumn,...columns.slice(3)]:columns}
        // columns={columns}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
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
                getHouseNumberList();
              }
            }}
            onCancel={() => {
              handleModalVisible(false);
              setFormValues({});
            }}
            modalVisible={createModalVisible}
          />
        ) : null
      }
      {/* {
        loading ? (
          <div className="wait-page">
            <img src="https://img.hzanchu.com/acimg/f487ea01eaf13307f8c8a8dd05127f27.gif" alt="正在导入"/>
          </div>
        ) : null
      } */}
    </PageHeaderWrapper>
  );
};

// export default TableList;
export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  roleAreaList: info.roleAreaList,
}))(TableList);
