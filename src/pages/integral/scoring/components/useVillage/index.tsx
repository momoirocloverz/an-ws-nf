import React, { useEffect, useState } from 'react';
import {
  Button, message, Modal, Pagination, Table,
} from 'antd';
import { getVillageItem, cancelVillageItem } from '@/services/ItemManage';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import styles from './index.less';

const UseVillage:React.FC<any> = (props) => {
  const [useModal, setUseModal] = useState(props.villageData);
  const columns = [
    {
      title: '所属地区',
      dataIndex: 'area_name',
    },
    {
      title: '审批时间',
      dataIndex: 'operate_at',
    },
    {
      title: '打分类型',
      dataIndex: 'direction',
      render: (val) => (val == 'DECREASE' ? '扣分' : '加分'),
    },
    {
      title: '参考分值',
      dataIndex: 'point',
    },
    {
      title: '实际分值',
      dataIndex: 'use_point',
    },
    {
      title: '使用说明',
      dataIndex: 'comment',
    },
    {
      title: '操作',
      dataIndex: 'options',
      render: (_, record, index) => (
        (props.accountInfo.role_type == 1 || props.accountInfo.role_type == 2)
          ? <div key={index} className={styles.close} onClick={() => removeVillage(record)}>解除</div> : null
      ),
    },
  ];
    // 应用村移除
  const removeVillage = (record) => {
    Modal.confirm({
      title: '移除',
      content: '您确定要移除该应用村？',
      onOk: () => {
        const data = {
          item_id: useModal.record.item_id,
          village_id: record.village_id,
        };
        cancelVillageItem(data).then((res) => {
          if (res.code === 0) {
            message.success('移除成功');
            getUseVillageList();
            props.handleSuccessRemove();
          }
        });
      },
    });
  };
  const [dataSource, setDataSource] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    total: 0,
  });
  const onPaginationChange = async (page, pageSize) => {
    const datas = {
      page,
      page_size: pageSize,
      item_id: props.villageData.record.item_id,
    };
    const data = await getVillageItem(datas);
    if (data.code == 0) {
      setDataSource(data.data.data);
      setPaginationData({ ...paginationData, page, total: data.data.total });
    }
  };
  useEffect(() => {
    getUseVillageList();
  }, []);
  const getUseVillageList = async () => {
    const datas = {
      page: paginationData.page,
      page_size: 10,
      item_id: props.villageData.record.item_id,
    };
    const data = await getVillageItem(datas);
    if (data.code == 0) {
      setDataSource(data.data.data);
      setPaginationData({ ...paginationData, total: data.data.total });
    }
  };
  return (
    <Modal getContainer={window.document.body} visible={useModal.visible} title={useModal.title} width={useModal.width} onCancel={props.handleVillageCancel} footer={null}>
      <div className={styles.modalTop}>
        <span>
          打分项：
          {props.villageData.record.name}
        </span>
        {/*<Button type="primary">导出</Button>*/}
      </div>
      <Table
        rowKey={(record) => (`${record.city_id}-${record.town_id}-${record.village_id}`)}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        className={styles.paginaTable}
        onShowSizeChange={onPaginationChange}
        current={paginationData.page}
        hideOnSinglePage
        onChange={onPaginationChange}
        showQuickJumper
        total={paginationData.total}
      />
    </Modal>
  );
};

export default connect(({ user }: ConnectState) => ({
  accountInfo: user.accountInfo,
}))(UseVillage);
