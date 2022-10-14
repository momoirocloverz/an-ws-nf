import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader } from 'antd';
import Moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './CreateForm';
import { TableListItem } from '../data.d';
import {
  integralGoodsList,
  addIntegralGoods,
  deletIntegralGoods,
  editIntegralGoods,
  editIsShowStatus,
  getRecordRange
} from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from '../style.less';

/**
 * 删除节点
 * @param goods_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletIntegralGoods({ product_id: id })
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

const getSectionList = (val) => {
  const _enum = {};
  if(val.length) {
    val.forEach((e: any) => {
      _enum[e.id] = {
        text: e.min + '-' + e.max
      }
    })
  }
  return _enum;
}

const OnShelf: React.FC<any> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const { accountInfo, areaList } = props
  const [ sectionList, setSectionList ] = useState([])
  const formRef = useRef<any>();

  const columns: ProColumns<any>[] = [
    {
      title: '商品ID',
      dataIndex: 'product_id',
      hideInSearch: true,
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      width: 180
    },
    {
      title: '商品图片',
      dataIndex: 'image_url',
      width: 180,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div className={styles.imgBox}>
            <img src={record.image_url} alt="" />
          </div>
        )
      }
    },
    {
      title: '兑换区间',
      dataIndex: '',
      hideInTable: true,
      valueType: 'select',
      filters: true,
      onFilter: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      width: 120,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists = (areaList.length>0 && accountInfo.role_type === 4) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} onChange={areaChange} changeOnSelect/>
        )
      },
    },
    {
      title: '商品积分',
      dataIndex: 'integral',
      width: 80,
      hideInSearch: true
    },
    {
      title: '积分区间',
      dataIndex: 'between_id',
      hideInTable: true,
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: getSectionList(sectionList),
    },
    {
      title: '商品库存',
      dataIndex: 'quantity',
      hideInSearch: true,
      width: 80
    },
    {
      title: '家庭限制',
      hideInSearch: true,
      width: 80,
      render: (_, record) => {
        return record.family_limit ? (
          <span>{record.family_limit}</span>
        ) : '无限制'
      }
    },
    {
      title: '商品说明',
      dataIndex: 'description',
      width: 150,
      render: (_, record) => {
      return (
        <p style={{
          width: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 0,
        }}>
          {record.description}
        </p>
      )},
      hideInSearch: true,
    },
    {
      title: '兑换流程',
      width: 150,
      render: (_, record) => {
      return (
        <p style={{
          width: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 0,
        }}>
          {record.process}
        </p>
      )},
      hideInSearch: true,
    },
    {
      title: '商品温馨提示',
      width: 150,
      render: (_, record) => {
      return (
        <p style={{
          width: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 0,
        }}>
          {record.prompt}
        </p>
      )},
      hideInSearch: true,
    },
    {
      title: '已兑换',
      dataIndex: 'exchange',
      hideInSearch: true,
      width: 80
    },
    {
      title: '已发放',
      dataIndex: 'send_num',
      hideInSearch: true,
      width: 80
    },
    {
      title: '上架时间',
      dataIndex: 'created_at',
      hideInSearch: true,
      width: 140
    },
    {
      title: '上架时间',
      dataIndex: 'updated_at',
      valueType: 'dateTimeRange',
      hideInTable: true,
      width: 140
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
          <ButtonAuth type="SOLD_OUT">
            <a
              className={styles.margin}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定下架此款商品吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const _data = await editIsShowStatus({id: record.product_id});
                    if (_data.code === 0) {
                      message.success('已下架');
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    } else {
                      message.error(_data.msg);
                    }
                  },
                });
              }}>
              下架
            </a>
          </ButtonAuth>
          {/*<ButtonAuth type="DELETE">*/}
          {/*  <a*/}
          {/*    className={styles.colorTap}*/}
          {/*    onClick={() => {*/}
          {/*      Modal.confirm({*/}
          {/*        title: '提示',*/}
          {/*        icon: <ExclamationCircleOutlined />,*/}
          {/*        content: '确定删除本条商品数据吗？',*/}
          {/*        okText: '确认',*/}
          {/*        cancelText: '取消',*/}
          {/*        onOk: async () => {*/}
          {/*          const success = await handleDelet(record['product_id']);*/}
          {/*          if (success) {*/}
          {/*            if (actionRef.current) {*/}
          {/*              actionRef.current.reload();*/}
          {/*            }*/}
          {/*          }*/}
          {/*        },*/}
          {/*      });*/}
          {/*    }}>*/}
          {/*    删除*/}
          {/*  </a>*/}
          {/*</ButtonAuth>*/}
        </>
      ),
    },
  ];

  // 更新状态
  const changeStatus = async (id: number) => {
    try {
      const params = {
        id: id
      };
      const _data = await editIsShowStatus(params);
      if (_data.code === 0) {
        message.success('已下架');
        return;
      } else {
        message.error(_data.msg);
        return;
      }
    } catch (err) {
      message.error('更新失败');
      return false;
    }
  }

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: any) => {
    try {
      let _data: any = {};
      if (isEdit) {
        _data = await editIntegralGoods(fields);
      } else {
        _data = await addIntegralGoods(fields);
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

  const getIntegralGoodsList = async (val:any) => {
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    if (val.updated_at && val.updated_at.length > 0) {
      val.start_time = val.updated_at[0];
      val.end_time = val.updated_at[1];
      delete val.updated_at;
    };
    const _params = paginationHandle(val);
    const _data = await integralGoodsList(_params);
    return tableDataHandle(_data);
  }



  // 获取小组数据
  const areaChange = async (e: any) => {
    console.log(e, 'eeeee')
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if(e.length > 0) {
      if(user.role_type === 4 && e.length === 2) {
        getList(e);
      }else if(user.role_type !== 4 && e.length === 3) {
        getList(e);
      }
    } else {
      formRef.current.setFieldsValue({ integral: '' });
      setSectionList([]);
    }
    formRef.current.setFieldsValue({ area: e });
  }

  const getList = async (e) => {
    let val: any = {
      city_id: e[0],
      town_id: e[1],
      village_id: e[2],
    }
    const _params = paginationHandle(val);
    const _data = await getRecordRange(_params);
    setSectionList(tableDataHandle(_data).data);
  }

  return (
    <div>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="product_id"
        options={false}
        formRef={formRef}
        scroll={{x: 1300}}
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
              新建商品
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getIntegralGoodsList(params)}
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
}))(OnShelf);
