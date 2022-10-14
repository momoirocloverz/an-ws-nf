import { Button, Modal, Cascader } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useRef, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { TableListItem } from './data.d';
import { contractList, makeContract, deleteContract } from '@/services/serve'
import ButtonAuth from '@/components/ButtonAuth';
import CreateEquity from './components/CreateEquity'
import { history } from 'umi';
import styles from './style.less'

const loans: React.FC<any> = (props) => {
  const { areaList, accountInfo } = props
  const actionRef = useRef<ActionType>();
  const [ modalVisible, handleModalVisible ] = useState<boolean>(false)
  const [ isEdit, setIsEdit ] = useState<boolean>(false)
  const [ stepFormValues, setStepFormValues ] = useState<any>({})
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80
    },
    {
      title: '名称',
      dataIndex: 'title',
      hideInSearch: true,
      width: 160
    },
    {
      title: '链接',
      dataIndex: 'url',
      hideInSearch: true,
      width: 260,
      render: (_, record) => {
        return (<a href={record.url} target="_blank">{record.url}</a>)
      }
    },
    {
      title: '当日访问量',
      dataIndex: 'today',
      hideInSearch: true
    },
    {
      title: '昨日访问量',
      dataIndex: 'yestoday',
      hideInSearch: true,
    },
    {
      title: '累计访问次数',
      dataIndex: 'click_times',
      hideInSearch: true,
    },
    {
      title: '访问率',
      dataIndex: 'click_rate',
      hideInSearch: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInTable: true,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        return (
          <Cascader options={areaList} changeOnSelect/>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <ButtonAuth type="EDIT_EQUITY">
            <a
              onClick={() => {
                setStepFormValues(record)
                handleModalVisible(true)
                setIsEdit(true)
              }}>
              编辑
            </a>
          </ButtonAuth>
          <ButtonAuth type="DELETE_EQUITY">
            <a
              className={styles.colorTap}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '埋点删除后不可恢复，确认删除吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await deleteContract({id: record.id});
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                })
              }}>
              删除
            </a>
          </ButtonAuth>
        </div>
      )
    },
  ];


  // 获取列表数据
  const getList = async (val: any) => {
    console.log(val, 'val')
    if(val.area) {
      let len = val.area.length
      if(len === 1) {
        val.city_id = val.area[0]
      } else if(len === 2) {
        val.city_id = val.area[0]
        val.town_id = val.area[1]
      } else {
        val.city_id = val.area[0]
        val.town_id = val.area[1]
        val.village_id = val.area[2]
      }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    const _params = paginationHandle(val);
    const _data = await contractList(_params);
    return tableDataHandle(_data);
  }

  const updateList = async (val: any) => {
    if(val.isEdit) {
      var _data = await makeContract({...val, id: val.id})
    } else {
      var _data = await makeContract(val)
    }
    if(_data.code === 0) {
      handleModalVisible(false);
      setStepFormValues({});
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  const search = async () => {

  }

  return (
    <PageHeaderWrapper>
      {/* <div className={styles.searchBar}>
        <div className={styles.search}>
          <span>所属地区：</span>
          <Cascader options={areaList} changeOnSelect />
        </div>
        <div className={styles.handle}>
          <Button type="primary" onClick={search}>搜 索</Button>
        </div>
      </div> */}
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
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE_EQUITY">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleModalVisible(true);
              setIsEdit(false)
            }}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getList(params)}
        // columns={hasAreaAuth?[...columns.slice(0,4),areaColumn,...columns.slice(4)]:columns}
        columns={columns}
      />
      {modalVisible ? (
        <CreateEquity
          isEdit={isEdit}
          onSubmit={async (value: any) => {
            updateList(value)
          }}
          onCancel={() => {
            handleModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={modalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(loans);
