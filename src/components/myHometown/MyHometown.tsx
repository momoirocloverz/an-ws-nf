import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Cascader } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from '@/pages/OperationCenter/BannerConfig/components/CreateForm';
import ButtonAuth from '@/components/ButtonAuth';
import {
  bannerList,
  addBanner,
  editBanner,
  deletBanner
} from '@/services/operationCanter';
import ImgView from '@/components/ImgView';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import Moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
// import { BANNER_TYPE_OPTIONS } from '../data.js'
import styles from './style.less'
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    delete fields.image_url
    const _data = await addBanner(fields)
    if (_data.code === 0) {
      message.success('添加成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
    return true;
  } catch (err) {
    message.error('添加失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    delete fields.image_url
    const _data = await editBanner(fields)
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

/**
 * 更新节点
 * @param banner_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletBanner({ banner_id: id })
    if (_data.code === 0) {
      message.success('删除成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('删除失败');
    return false;
  }
}

function MyHometown({ authorizations, regionTree, userRegion } : any) {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'banner_id',
      hideInSearch: true,
    },
    {
      title: '广告名称',
      dataIndex: 'title'
    },
    {
      title: '广告图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      renderText: (val, record) => {
        return (
          <div className={styles.imageBox}>
            <img src={record['image_url']} alt=""/>
          </div>
        );
      }
    },
    // {
    //   title: '广告类型',
    //   dataIndex: 'banner_type',
    //   filterDropdownVisible: false,
    //   filterIcon: <div></div>,
    //   renderText: (_, record) => (<span>{record.banner_type === 2 ? '首页弹窗' : '顶部轮播'}</span>),
    //   valueEnum: BANNER_TYPE_OPTIONS
    // },
    {
      title: '跳转路径',
      dataIndex: 'jump_value',
      hideInSearch: true,
      width: '200px',
      render: (_, record) => {
        return (
          <span>{record.jump_value ? record.jump_value : '不跳转'}</span>
        )
      }
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: !(authorizations.isCityOfficial),
      renderFormItem: () => (<Cascader options={regionTree} changeOnSelect />),
    },
    {
      title: '发布时间',
      dataIndex: 'timed_release',
      hideInSearch: true
    },
    {
      title: '发布时间',
      dataIndex: 'timed_release',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '创建人员',
      dataIndex: 'admin_name',
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
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues({...record, bannerType: '1'});
              }}
            >
              编辑
            </a>
            <br/>
          </ButtonAuth>

          <ButtonAuth type="DELETE">
            <a
              className={styles.colorTap}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定删除本条Banner配置吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record.banner_id);
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
        </>
      ),
    },
  ];

  const getBannerList = async (val:any) => {
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    }
    val.area = undefined;
    val.banner_type = '1';
    const valObj = { ...val };
    const timeArr = valObj['timed_release'] || [];
    const createTimeArr = valObj['created_at'] || [];
    if (timeArr && timeArr.length > 0) {
      valObj['start_time'] = Moment(timeArr[0]).valueOf() / 1000
      valObj['end_time'] = Moment(timeArr[1]).valueOf() / 1000
      delete valObj['timed_release']
    }
    if (createTimeArr && createTimeArr.length > 0) {
      valObj['begin_time'] = Moment(createTimeArr[0]).valueOf() / 1000
      valObj['finish_time'] = Moment(createTimeArr[1]).valueOf() / 1000
      delete valObj['created_at']
    }
    if (valObj['banner_type']) {
      valObj['banner_type'] = parseInt(valObj['banner_type'])
    }
    
    const _params = paginationHandle(valObj);
    const _data = await bannerList(_params);
    return tableDataHandle(_data)
  }

  return (
    <>
      <ProTable<any>
        headerTitle=""
        actionRef={actionRef}
        rowKey="banner_id"
        options={false}
        scroll={{ x: 1300 }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                handleModalVisible(true);
                setIsEdit(false);
              }}>
                新建广告
              </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getBannerList(params)}
        columns={columns}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            onSubmit={async (value: any) => {
              let success: any = null;
              if (isEdit) {
                success = await handleUpdate(value);
              } else {
                success = await handleAdd(value)
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
            values={{...formValues, bannerType: '1'}}
          />
        ) : null
      }
    </>
  );
};

export default MyHometown;