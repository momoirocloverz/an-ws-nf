import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Cascader } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import VillageList from './components/VillageList';
import { TableListItem } from './data.d';
import ButtonAuth from '@/components/ButtonAuth';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import {
  integralRuleList,
  addIntegralRule,
  editIntegralRule,
  deletIntegralRule,
} from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import Moment from 'moment';
import { roleType } from '../../../models/system';
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await addIntegralRule(fields);
    if (_data.code === 0) {
      message.success('添加成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
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
    const _data = await editIntegralRule(fields);
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
 * 删除节点
 * @param article_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletIntegralRule({ id });
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
};

const TableList: React.FC<{}> = (props:any) => {
  const { accountInfo, roleAreaList } = props;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [listVisible, handleListVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '主编码',
      dataIndex: 'p_code',
      hideInSearch: true,
    },
    {
      title: '主项名称',
      dataIndex: 'p_name',
    },
    {
      title: '子项编码',
      dataIndex: 's_code',
      hideInSearch: true,
    },
    {
      title: '子项名称',
      dataIndex: 's_name',
    },
    {
      title: '打分项规则内容',
      dataIndex: 'comment',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        return (
          <Cascader options={roleAreaList} changeOnSelect />
        )
      },
      hideInTable: accountInfo.role_type === 3 ? true : false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues(record);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const village_columns: ProColumns<TableListItem>[] = [
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        return (
          <Cascader options={roleAreaList} changeOnSelect />
        )
      },
      hideInTable: accountInfo.role_type === 3 ? true : false,
    },
    {
      title: '在用子项数量',
      dataIndex: 'count',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <ButtonAuth type="INTEGRAL_DETAIL">
            <a
              onClick={() => {
                handleListVisible(true);
                setFormValues(record);
              }}
            >
              查看
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const getIntegralList = async (val: any) => {
    if(val?.area) {
      if(accountInfo.role_type !== 4) {
        val.city_id = val.area[0];
        val.town_id = val.area[1];
        val.village_id = val.area[2];
      } else {
        val.town_id = val.area[0];
        val.village_id = val.area[1];
      }
    }
    const valObj = { ...val };
    const _params = paginationHandle(valObj);
    const _data = await integralRuleList(_params);
    return tableDataHandle(_data);
  };

  // // 获取小组数据
  // const areaChange = async (e: any) => {
  //   let user = JSON.parse(localStorage.getItem('userInfo'));
  //   if(e.length>0){
  //     if(user.role_type===4 && e.length===2) {
  //       getGroup(e)
  //     }else if(user.role_type!==4 && e.length===3) {
  //       getGroup(e)
  //     }
  //   }else {
  //     formRef.current.setFieldsValue({group_name:''})
  //     setGroupList([])
  //   }
  // }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey={accountInfo.role_type === 3 ? 'id' : 'area'}
        options={false}
        search={{
          searchText: '搜索',
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
        // toolBarRender={(action, { selectedRows }) => [
        //   <ButtonAuth type="CREATE">
        //     <Button
        //       icon={<PlusOutlined />}
        //       type="primary"
        //       onClick={() => {
        //         handleModalVisible(true);
        //         setIsEdit(false);
        //       }}
        //     >
        //       新建
        //     </Button>
        //   </ButtonAuth>,
        // ]}
        toolBarRender={false}
        tableAlertRender={false}
        request={(params) => getIntegralList(params)}
        columns={accountInfo.role_type === 3 ? columns : village_columns}
      />
      {(formValues && Object.keys(formValues).length) || createModalVisible ? (
        <CreateForm
          isEdit={isEdit}
          onSubmit={async (value) => {
            let success:any = null;
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
          values={formValues}
        />
      ) : null}

      {listVisible ? (
        <VillageList
          onSubmit={async (value) => {
            let success:any = null;
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
            handleListVisible(false);
            setFormValues({});
          }}
          modalVisible={listVisible}
          values={formValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

// export default TableList;

export default connect(({ user, info }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  accountInfo: user.accountInfo,
  roleAreaList: info.roleAreaList,
}))(TableList);