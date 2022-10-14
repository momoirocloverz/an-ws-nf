import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader } from 'antd';
import Moment from 'moment';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './CreateForm';
import {
  familyFeastAdd,
  familyFeastEdit,
  familyFeastDel,
  familyFeastList
} from '@/services/serve';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from '../index.less';


const Release: React.FC<any> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const { accountInfo, areaList } = props
  const [ pageParams,  setPageParams ] = useState<any>({});

  const resetValue = (values) => {
    let arr = values.split(','),
    new_arr: any = [];
    arr.map((e) => {
      if(e === '1') {
        new_arr.push('早上')
      } else if(e === '2') {
        new_arr.push('中午')
      } else {
        new_arr.push('晚上')
      }
    })
    return (
      <div>{new_arr.join(',')}</div>
    )
  }

  const columns: ProColumns<any>[] = [
    {
      title: '家宴厅',
      dataIndex: 'feast_name',
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      width: 120,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists = (areaList.length>0 && accountInfo.role_type === 4) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      },
    },
    {
      title: '总桌数',
      dataIndex: 'table_number',
      hideInSearch: true
    },
    {
      title: '可预订日期',
      render: (_, record) => {
        return (
          <p>{record.start_at.slice(0, 10)} - {record.end_at.slice(0, 10)}</p>
        )
      },
      hideInSearch: true,
    },
    {
      title: '可预订时段',
      dataIndex: 'presentable_time',
      hideInSearch: true,
      render: resetValue
    },
    {
      title: '详情描述',
      dataIndex: 'description',
      hideInSearch: true,
      width: 260
    },
    {
      title: '单价/桌',
      render(_, record) {
        return <span>{record.unit_amount}元</span>
      }
    },
    {
      title: '定金比例',
      render(_, record) {
        return <span>{record.percent}%</span>
      }
    },
    {
      title: '发布日期',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <ButtonAuth type="EDIT">
            <a
              className={styles.margin}
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues(record);
              }}>
              编辑
            </a>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <a
              className={styles.colorTap}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定删除此条信息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await familyFeastDel({ id: record.id });
                    if (success.code === 0) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    } else {
                      message.error(success.msg);
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

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: any) => {
    try {
      let _data: any = {};
      if (isEdit) {
        _data = await familyFeastEdit(fields);
      } else {
        _data = await familyFeastAdd(fields);
      }
      if (_data.code === 0) {
        message.success(isEdit ? '编辑成功' : '新增成功');
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.success(isEdit ? '编辑失败' : '新增失败');
      return false;
    }
  };

  const getList = async (val:any) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    const params: any = paginationHandle(val);
    params.status = Number(params.status);
    console.log(params);
    setPageParams(params)
    const data = await familyFeastList(params);
    return tableDataHandle(data)
  }

  return (
    <div>
      <ProTable<any>
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
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleModalVisible(true);
              setIsEdit(false);
              setFormValues({})
            }}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getList(params)}
        columns={columns}
      />
      {
       createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            values={formValues}
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
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
    </div>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(Release);
