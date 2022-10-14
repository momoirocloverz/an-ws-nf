import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  Button, DatePicker, message, Modal, Select,
} from 'antd';
import { prepareDraft } from '@/services/agricultureSubsidies';
import { paginationHandle, tableDataHandle } from '@/utils/utils';
import moment from 'moment';
import { getItemList } from '@/services/ItemManage';
import ItemManage from '@/pages/integral/scoring/components/ItemizedManagement/index';
import ButtonAuth from '@/components/ButtonAuth';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import CreateAndEdit from '@/pages/integral/scoring/components/createEdit';
import { removePrimaryGradingGroup } from '@/services/integral';
import ModifyPrimaryGradingGroup from "@/pages/integral/scoring/components/createEdit/ModifyPrimaryGradingGroup";
import styles from './wrapper.less'

const { RangePicker } = DatePicker;
const { Option } = Select;

function GradeItemTable({ accountInfo }) {
  const [savedParams, setSavedParams] = useState({});
  const [modalContext, setModalContext] = useState({});
  const [isModifyPrimaryGroupModalVisible, setIsModifyPrimaryGroupModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const columns: any = [
    {
      title: '主编码',
      dataIndex: 'code',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '主项名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '子项名称',
      dataIndex: 's_name',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      renderFormItem: () => (<RangePicker />),
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: accountInfo.role_type != 3,
      hideInTable: true,
      renderFormItem: () => (
        <Select placeholder="请选择状态">
          <Option value={0}>未申请</Option>
          <Option value={1}>待审批</Option>
          <Option value={2}>使用中</Option>
          <Option value={3}>已拒绝</Option>
        </Select>
      ),
      render: (val) => (val == 0 ? '未申请' : val == 1 ? '待审批' : val == 2 ? '使用中' : '已拒绝'),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (__, record) => (
        <>
          <ButtonAuth type="MODIFY_PRIMARY_GRADING_GROUP">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow(record);
                setIsModifyPrimaryGroupModalVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="REMOVE_PRIMARY_GRADING_GROUP">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除主编码: ${record.code} - ${record.name}?`,
                  onOk: async () => {
                    try {
                      const result = await removePrimaryGradingGroup(record.code);
                      if (result.code === 0) {
                        message.success('删除成功');
                        tableRef.current?.reload();
                      } else {
                        throw new Error(result.msg);
                      }
                    } catch (e) {
                      message.error(`删除失败: ${e.message}`);
                    }
                  },
                });
              }}
              disabled={record.s_list.length}
            >
              删除
            </Button>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const loadData = async (params) => {
    try {
      const newParams = {
        ...params,
        name: undefined,
        created_at: undefined,
        pageSize: undefined,
        current: undefined,
        page: params.current,
        page_size: params.pageSize,
        p_name: params.name,
        start_time: params.created_at?.[0] ? moment(params.created_at[0]).format('YYYY-MM-DD') : undefined,
        end_time: params.created_at?.[1] ? moment(params.created_at[1]).format('YYYY-MM-DD') : undefined,
      };
      const result = await getItemList(newParams);
      setSavedParams(newParams);
      return tableDataHandle(result);
    } catch (e) {
      message.error(`申报数据读取失败: ${e.message}`);
      return tableDataHandle({
        code: -1,
        data: [],
        pagination: {
          page: 1,
          item_total: 0,
          page_count: 1,
          page_total: 1,
        },
      });
    }
  };

  // 导出
  const exportExcel = () => {
    const {
      _timestamp, current, pageSize, ...prunedParams
    } = savedParams;
    window.open(
      `/farmapi/gateway?api_name=export_item_list&version=1.2.0&os=h5&sign&${Object.entries(prunedParams).map(([k, v]) => (`${k}=${v ?? ''}`)).join('&')}`,
    );
  };
  return (
    <>
      <ProTable
        columns={columns}
        actionRef={tableRef}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => <ItemManage dataSource={record.s_list} reload={() => tableRef.current?.reload()} />,
        }}
        rowClassName={styles.parentRow}
        request={loadData}
        options={false}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="ITEMIZED_EXPORT">
            <Button type="primary" onClick={() => exportExcel()}>
              导出
            </Button>
          </ButtonAuth>,
          accountInfo.role_type != 3 ? (
            <ButtonAuth type="ITEMIZED_CREATE">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setModalContext({
                  visible: true, isAdd: true, record: '', title: '新建打分项',
                })}
              >
                新建打分项
              </Button>
            </ButtonAuth>
          ) : null,
        ]}
      />
      <ModifyPrimaryGradingGroup
        visible={isModifyPrimaryGroupModalVisible}
        context={selectedRow}
        onSuccess={()=>{
          setIsModifyPrimaryGroupModalVisible(false)
          tableRef.current?.reload();
          message.success("修改成功!")
        }}
        onCancel={()=>setIsModifyPrimaryGroupModalVisible(false)}
      />
      {
      modalContext.visible ? (
        <CreateAndEdit
          modalItem={modalContext}
          handleCreateCancel={() => setModalContext({ visible: false })}
          handleSuccess={() => {
            setModalContext({ visible: false });
            tableRef.current?.reload();
          }}
        />
      ) : null
    }
    </>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(GradeItemTable);
