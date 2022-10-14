import { ExclamationCircleOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, message, Modal, Cascader, Upload, DatePicker, Popover, Card, Descriptions, Dropdown,  } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import Moment from 'moment';
import CreateForm from './components/CreateForm';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { TableListItem } from './data.d';
import {checkPermissions} from '@/components/Authorized/CheckPermissions';
import styles from './style.less'
import { loanList, addLoan, editLoan, deleteLoan, loanStat } from '@/services/loans';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
// 接口使用模块
import { getLocalToken, getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';
import { values } from 'lodash';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await addLoan(fields);
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
    const _data = await editLoan(fields);
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
  api_name: 'import_loan',
};
const data = getApiParams(addApiName, PUBLIC_KEY);

const loans: React.FC<any> = (props) => {
  const { accountInfo, roleAreaList } = props;
  const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
  const [ formValues, setFormValues ] = useState({});
  const [ totalData, setTotalData ] = useState({});
  const [ isEdit, setIsEdit ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ pageParams,setPageParams ] = useState<any>({});
  const [ diff, setDiff ] = useState<any>('');
  const [ collapsed, setCollapsed ] = useState(false);
  const actionRef = useRef<ActionType>();
  const [ loanValue, getLoanValue ] = useState<any>({})
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '家庭ID',
      dataIndex: 'family_id',
      hideInSearch: true,
    },
    {
      title: '授信人姓名',
      dataIndex: 'name',
    },
    {
      title: '与户主关系',
      dataIndex: 'relation',
      hideInSearch: true,
    },
    {
      title: '最后授信额度',
      dataIndex: 'quota',
      hideInSearch: true,
    },
    {
      title: '授信利率',
      dataIndex: 'credit_rate',
      hideInSearch: true,
      render: (item, record:any) => {
        return (
          <span>{record.credit_rate?.indexOf('%') > 0 ? record.credit_rate : accMul(+record.credit_rate, 100) + '%'}</span>
        )
      }
    },
    {
      title: '授信有效时间',
      dataIndex: 'credit_time',
      hideInSearch: true
    },
    {
      title: '户主身份证',
      dataIndex: 'identity',
      hideInSearch: true,
      render: (item, record:any) => {
        return (
          <span>{record.identity ? record.identity.replace(/(?<=\d{3})\d{12}(?=\d{2})/,"************") : ''}</span>
        )
      }
    },
    {
      title: '户主姓名',
      dataIndex: 'owner_name',
      // hideInSearch: true,
    },
    {
      title: '户主手机号',
      dataIndex: 'mobile',
      render: (item, record:any) => {
        return (
          <span>{record.mobile ? record.mobile.replace(/(\d{3})\d*(\d{4})/,"$1****$2") : ''}</span>
        )
      }
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
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      // hideInSearch: true,
      renderFormItem: () => {
        return (
          <Cascader options={roleAreaList} changeOnSelect/>
        )
      }
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
      hideInSearch: true,
    },
    {
      title: '年份',
      dataIndex: 'year',
      initialValue: Moment(),
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
                  content: '是否要删除该条信息?',
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

  const accMul = (arg1,arg2) => {
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
  }

  const getLoanList = async (val:any, different:any) => {
    if(val.sort_type && val.sort_value) {
      val[val.sort_type] = val.sort_value
      delete val.sort_type
      delete val.sort_value
    }
    // if(val.area) {
    //   val.city_id = val.area[0] ? val.area[0] : 0
    //   val.town_id = val.area[1] ? val.area[1] : 0
    //   val.village_id = val.area[2] ? val.area[2] : 0
    // }
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    }else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    val['year'] = val.year ? Moment(val.year).format('YYYY') : new Date().getFullYear();
    val.area = undefined;
    const _params = paginationHandle({...val, different});
    setPageParams(_params)
    const _data = await loanList(_params)
    const loan_value = await loanStat(_params)
    if(loan_value.code === 0 && loan_value.data) {
      getLoanValue(loan_value.data)
    }
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
    const data = await deleteLoan({id})
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

  return (
    <PageHeaderWrapper>
      <div className={styles.totalData}>
        <p>
          <span>有额度农户数：</span>
          <span>{loanValue.count_loan}户</span>
        </p>
        <p>
          <span>总授信额度：</span>
          <span>{loanValue.sum_loan}元</span>
        </p>
      </div>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        options={false}
        search={{
          searchText: '搜索',
          collapsed,
          span: 6,
          onCollapse: setCollapsed,
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={() => [
          <ButtonAuth type="DOWNLOAD_MODEL">
            <Button type="primary" onClick={() => {
              window.location.href = '/授信模板.xlsx'
            }}>
              授信模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <Upload {...uploadProps} disabled={loading}>
              <Button disabled={loading} type="primary" loading={loading}>
                {loading ? '正在导入...' : '导入授信人'}
              </Button>
            </Upload>
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
        request={(params) => getLoanList({ ...params}, diff)}
        columns={columns}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            values={formValues}
            onSubmit={async (value: any) => {
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
        ) : null
      }
    </PageHeaderWrapper>
  );
};

// export default TableList;
export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  roleAreaList: info.roleAreaList,
}))(loans);
