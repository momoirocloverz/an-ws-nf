import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, message, Button, Cascader } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem, FormValueType } from './data.d';
import { exchangeList, receiveExchange, createExchangeRecord } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import CarouselImg from '@/components/CarouselImg';
import AddRecord from './components/AddRecord';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Moment from 'moment';

/**
 * 更新节点
 * @param record_id
 */
const handleReceive = async (id: number, goodsId: number) => {
  try {
    const _data = await receiveExchange({
      record_id: id,
      product_id: goodsId
    })
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
}

/**
 * 添加积分兑换记录
 */
const handleAdd = async (field: FormValueType) => {
  let data = await createExchangeRecord(field)
  if(data.code === 0) {
    message.success('操作成功')
    return true;
  }else{
    message.error(data.msg)
  }
}
const TableList: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [isEdit, setIsEdit] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const { accountInfo, areaList } = props
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '用户姓名',
      dataIndex: 'user_name',
    },
    {
      title: '所属家庭',
      dataIndex: 'family_name',
      hideInSearch: true,
    },
    {
      title: '所属小组',
      dataIndex: 'group_name',
      hideInSearch: true,
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
      },
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
    },
    {
      title: '兑换日期',
      dataIndex: 'created_at',
      valueType: 'dateTimeRange',
    },
    {
      title: '商品图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      render: (_, record) => {
        return record['image_url'] && record['image_url'].length > 0 ? (
          <CarouselImg urlList={record.image_url} />
        ) : null
      }
    },
    {
      title: '商品积分',
      dataIndex: 'integral',
      hideInSearch: true,
    },
    {
      title: '兑换数量',
      dataIndex: 'quantity',
      hideInSearch: true,
    },
    {
      title: '兑换状态',
      dataIndex: 'receive_status',
      render: (_, record) => {
        return record['receive_status'] === 0 ? (<span>未领取</span>) : (<span>已领取</span>)
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {
            record.receive_status === 0 ? (<ButtonAuth type="REGISTER">
            <a
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '是否确认该用户已领取？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleReceive(record.id, record['product_id']);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              去登记
            </a>
            </ButtonAuth>) : null
          }
        </>
      ),
    },
  ];

  const getExchangeList = async (val:any) => {
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
    if (val.created_at && val.created_at.length > 0) {
      val.start_time = Moment(val.created_at[0]).valueOf() / 1000;
      val.end_time = Moment(val.created_at[1]).valueOf() / 1000;
      delete val.created_at;
    }
    const _params = paginationHandle(val);
    const _data = await exchangeList(_params);
    return tableDataHandle(_data);
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
          <ButtonAuth type="ADD_RECORD">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleUpdateModalVisible(true);
              setIsEdit(false);
            }}>
              添加兑换记录
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getExchangeList(params)}
        columns={columns}
      />
      {updateModalVisible ? (
        <AddRecord
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            let success = null;
            success = await handleAdd(value)
            if (success) {
              handleUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              setStepFormValues({});
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
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(TableList);
