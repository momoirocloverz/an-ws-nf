import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Cascader, Switch  } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { TableListItem, FormValueType } from './data.d';
import { integralScoreList, addIntegralScore, deletIntegralScore, integralChange } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {checkPermissions} from '@/components/Authorized/CheckPermissions';
import { render } from 'react-dom';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await addIntegralScore(fields);
    if (_data.code === 0) {
      message.success('新增成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('新增失败');
    return false;
  }
};

/**
 * 删除节点
 * @param article_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletIntegralScore({ item_id: id })
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

const TableList: React.FC<any> = (props) => {
  const { userAuthButton, accountInfo, areaList } = props;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [hasAreaAuth, setHasAreaAuth] = useState(false)
  const [ selectArea, setSelectArea ] = useState<any>([])
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'item_id',
      hideInSearch: true,
    },
    {
      title: '打分项名称',
      dataIndex: 'item_name',
      hideInSearch: true,
    },
    {
      title: '打分类型',
      dataIndex: 'direction',
      hideInSearch: true,
      render: (text) => text === 'INCREASE' ? '加分' : '扣分'
    },
    {
      title: '分值',
      dataIndex: 'point',
      hideInSearch: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      width: 120,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        let areaLists=(accountInfo.role_type===4&&areaList.length>0)?areaList[0].children:areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '巡查员',
      dataIndex: 'inspect',
      hideInSearch: true,
      render: (text,record) => {
        return (
          <Switch defaultChecked={text} onChange={(e)=>onInspectChange(e,record.item_id)} />
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <ButtonAuth type="DELETE">
            <a
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定删除本条打分项数据吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record['item_id']);
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

  const getIntegralScoreList = async (val:any) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if(val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
      // let len = val.area.length
      // if(len === 1) {
      //   val.city_id = val.area[0]
      // } else if(len === 2) {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      // } else {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      //   val.village_id = val.area[2]
      // }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    val.area=undefined;
    const _params = paginationHandle(val);
    const _data = await integralScoreList(_params);
    return tableDataHandle(_data)
  }
  const getAuthArr = () => {
    let authArr: string[] = [];
    for(let i=0; i<userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    let hasColumnAuth: any = checkPermissions("COLUMN_ADDRESS", authArr, true, false)
    setHasAreaAuth(hasColumnAuth)
  }


const onInspectChange = async (e:boolean, item_id:number) => {
  const _data = await integralChange({inspect: e ? 1: 0, item_id});
  actionRef.current?.reload()

}

  useEffect(() => {
    getAuthArr();
  }, [props.userAuthButton]);
  const areaColumn = {
    title: '所属地区',
    dataIndex: 'area',
    width: 120,
    hideInSearch: accountInfo.role_type === 3 ? true : false,
    renderFormItem: () => {
      let areaLists=(accountInfo.role_type===4&&areaList.length>0)?areaList[0].children:areaList;
      return (
        <Cascader options={areaLists} changeOnSelect/>
      )
    }
  }
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="item_id"
        options={false}
        search={accountInfo.role_type === 3?false:true}
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
            }}>
              新建打分项
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getIntegralScoreList(params)}
        // columns={hasAreaAuth?[...columns.slice(0,4),areaColumn,...columns.slice(4)]:columns}
        columns={columns}
      />
      {
       createModalVisible ? (
          <CreateForm
            onSubmit={async (value: any) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
                return success
              }
            }}
            onCancel={() => {
              handleModalVisible(false);
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
  areaList: info.areaList,
}))(TableList);
