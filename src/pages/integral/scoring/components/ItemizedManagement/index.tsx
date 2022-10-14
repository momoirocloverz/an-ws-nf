import React, { useRef, useState } from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import {
  Button, DatePicker, message, Modal, Select, Switch,
} from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { PlusOutlined } from '@ant-design/icons';
import ButtonAuth from '@/components/ButtonAuth';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import {
  getItemList, deleteItemManageList, cancelUse, editApply,
} from '@/services/ItemManage';
import moment from 'moment';
import ModifyActiveGradeItem from '@/pages/integral/scoring/components/createEdit/ModifyActiveGradeItem';
import styles from './index.less';
// 应用村弹框
import UseVillage from '../useVillage';
// 创建编辑
import CreateAndEdit from '../createEdit';
// 申请使用打分项弹框
import ApplyUse from '../ApplyUse';

const { RangePicker } = DatePicker;

const ItemManage: React.FC<any> = (props) => {
  const { accountInfo, dataSource, reload } = props;
  const { Option } = Select;
  // const actionRef = useRef<ActionType>();
  const [collapsed, setCollapsed] = useState(false);
  const [params, setParams] = useState({
    s_code: '',
    name: '',
    start_time: '',
    end_time: '',
  });
  const [modalItem, setModalItem] = useState({
    visible: false,
    title: '新建打分项',
    isAdd: true,
    record: '',
  });
  const [villageData, setVillageData] = useState({
    visible: false,
    title: '应用村',
    width: 1000,
    record: '',
  });
  const [applyModal, setApplyModal] = useState({
    visible: false,
    title: '申请使用打分项',
    record: '',
  });
  const [isModifyingActiveGradeItem, setIsModifyingActiveGradeItem] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const columns = [
    {
      title: '主编码',
      dataIndex: 'p_code',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '子编码',
      dataIndex: 's_code',
      align: 'center',
      hideInSearch: accountInfo.role_type == 3,
    },
    {
      title: '名称',
      dataIndex: 's_name',
      align: 'center',
    },
    {
      title: '打分类型',
      dataIndex: 'direction',
      align: 'center',
      hideInSearch: true,
      render: (val) => (val == 'INCREASE' ? '加分' : '扣分'),
    },
    {
      title: '参考分值',
      dataIndex: 'point',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '使用说明',
      dataIndex: 'comment',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      renderFormItem: (item, props) => <RangePicker />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: accountInfo.role_type != 3,
      hideInTable: accountInfo.role_type != 3,
      renderFormItem: () => (
        <Select placeholder="请选择状态">
          <Option value={0}>未申请</Option>
          <Option value={1}>待审批</Option>
          <Option value={2}>使用中</Option>
          <Option value={3}>已拒绝</Option>
        </Select>
      ),
      render: (val, record) => (record.is_all ? '必选' : val == 0 ? '未申请' : val == 1 ? '待审批' : val == 2 ? '使用中' : '已拒绝'),
    },
    {
      title: '实际分值',
      dataIndex: 'use_point',
      hideInSearch: true,
      hideInTable: accountInfo.role_type != 3,
    },
    {
      title: '巡查员',
      dataIndex: 'inspect',
      hideInSearch: true,
      hideInTable: accountInfo.role_type != 3,
      render: (val, record) => (record.status == 2 ? (
        <Switch checked={val == 1} onChange={() => handleChangSwitch(record)} />
      ) : null),
    },
    {
      title: '应用村/个',
      dataIndex: 'apply_num',
      hideInSearch: true,
      hideInTable: accountInfo.role_type == 3,
      render: (val, record, index) => (val != 0 ? (
        <div key={index} className={styles.villageLink} onClick={() => handleVillageOpen(record)}>
          {val}
        </div>
      ) : (
        val
      )),
    },
    {
      title: '是否必选',
      dataIndex: 'is_all',
      hideInSearch: true,
      hideInTable: accountInfo.role_type == 3,
      render: (val, record) => (record.is_all ? '是' : '否'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: '140px',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (accountInfo.role_type != 3 ? (
        <div>
          <ButtonAuth type="ITEMIZED_EDIT">
            <a className={styles.villageLink} onClick={() => handleClickEdit(record)}>
              编辑
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="ITEMIZED_DELETE">
            <a className={styles.villageLink} onClick={() => handleClickDelete(record)}>
              删除
            </a>
          </ButtonAuth>
        </div>
      ) : (
        <div>
          {record.status == 0 || record.status == 3 ? (
            <ButtonAuth type="ITEMIZED_APPLY">
              <a className={styles.villageLink} onClick={() => applyUseInfo(record)}>
                申请使用
              </a>
            </ButtonAuth>
          ) : record.status == 1 ? (
            <ButtonAuth type="ITEMIZED_REVOKE">
              <a className={styles.villageLink} onClick={() => applyCancelUseInfo(record)}>
                撤销
              </a>
            </ButtonAuth>
          ) : record.status === 2 ? (
            <ButtonAuth type="ITEMIZED_EDIT">
              <a
                className={styles.villageLink}
                onClick={() => {
                  setSelectedRow(record);
                  setIsModifyingActiveGradeItem(true);
                }}
              >
                编辑
              </a>
            </ButtonAuth>
          ) : (
            ''
          )}
        </div>
      )),
    },
  ];
  // 编辑巡查员
  const handleChangSwitch = (record) => {
    const data = {
      item_id: record.item_id,
      inspect: record.inspect == 0 ? 1 : 0,
    };
    editApply(data).then((res) => {
      if (res.code == 0) {
        message.success('编辑成功');
        reload();
      }
    });
  };
  // 删除
  const handleClickDelete = (record) => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该条信息？',
      onOk: () => {
        const data = {
          item_id: record.item_id,
        };
        deleteItemManageList(data).then((res) => {
          if (res.code == 0) {
            message.success('删除成功');
            reload();
          } else {
            message.error(`删除失败: ${res.msg}`);
          }
        });
      },
    });
  };
  // 撤销
  const applyCancelUseInfo = (record) => {
    Modal.confirm({
      title: '撤销',
      content: '您确定要撤销该审批?',
      onOk: () => {
        const data = {
          item_id: record.item_id,
        };
        cancelUse(data).then((res) => {
          if (res.code == 0) {
            message.success('撤销成功');
            reload();
          }
        });
      },
    });
  };
  // 点击编辑
  const handleClickEdit = (record) => {
    setModalItem({
      ...modalItem, isAdd: false, record, visible: true, title: '编辑',
    });
  };
  const applyUseInfo = (record) => {
    setApplyModal({ ...applyModal, visible: true, record });
  };
  const handleVillageOpen = (record) => {
    setVillageData({ ...villageData, visible: true, record });
  };
  const handleVillageCancel = () => {
    setVillageData({ ...villageData, visible: false });
  };
  const handleCreateCancel = () => {
    setModalItem({ ...modalItem, visible: false });
  };
  const handleModalCancel = () => {
    setApplyModal({ ...applyModal, visible: false });
  };
  // 请求列表接口
  const getItemizedManageList = async (params: any) => {
    if (params.created_at) {
      params.start_time = moment(params.created_at[0]).format('YYYY-MM-DD');
      params.end_time = moment(params.created_at[1]).format('YYYY-MM-DD');
      delete params.created_at;
    }
    const _params = paginationHandle(params);
    // delete _params.town_id;
    // delete _params.village_id;
    // delete _params.city_id;
    setParams(_params);
    const _data = await getItemList(_params);
    return tableDataHandle(_data);
  };
  // 添加编辑成功
  const handleSuccess = () => {
    setModalItem({ ...modalItem, visible: false });
    reload();
  };
  // 申请成功
  const handleApplySuccess = () => {
    setApplyModal({ ...applyModal, visible: false });
    reload();
  };
  const handleSuccessRemove = () => {
    reload();
  };
  return (
    <>
      <ProTable
        tableAlertRender={false}
        columns={columns}
        dataSource={dataSource}
        headerTitle=""
        rowKey="item_id"
        options={false}
        search={false}
        toolBarRender={false}
        // request={(params) => getItemizedManageList(params)}
        pagination={false}
      />

      {/* 应用村 */}
      {villageData.visible ? (
        <UseVillage
          villageData={villageData}
          handleVillageCancel={handleVillageCancel}
          handleSuccessRemove={handleSuccessRemove}
        />
      ) : null}
      {/* 新建编辑 */}
      {modalItem.visible ? (
        <CreateAndEdit
          modalItem={modalItem}
          handleCreateCancel={handleCreateCancel}
          handleSuccess={handleSuccess}
        />
      ) : null}
      {/* 申请使用打分项 */}
      {applyModal.visible ? (
        <ApplyUse
          applyModal={applyModal}
          handleModalCancel={handleModalCancel}
          handleApplySuccess={handleApplySuccess}
        />
      ) : null}
      <ModifyActiveGradeItem
        visible={isModifyingActiveGradeItem}
        context={selectedRow}
        onCancel={() => setIsModifyingActiveGradeItem(false)}
        onSuccess={() => {
          setIsModifyingActiveGradeItem(false);
          reload();
        }}
      />
    </>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(ItemManage);
