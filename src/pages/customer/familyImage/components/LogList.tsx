import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd'
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ImgView from '@/components/ImgView';
import { FormValues } from '../data';
import { getFamilyImage } from '@/services/familyImage';


const LogList: React.FC<{}> = (props) => {
  const { historyValues, modalVisible, onClose } = props;
  const [listValues, setListValues] = useState(historyValues);

  const columns:ProColumns<FormValues>[] = [
    {
      title: '照片上传时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '检查人',
      width: 120,
      dataIndex: 'operator',
      hideInSearch: true
    },
    {
      title: '照片内容',
      dataIndex: 'log_image',
      render: (_, record) => {
        return (
          record.log_image.map((item:object) => {
            return <ImgView url={item} width={100} />
          })

        );
      },
      hideInSearch: true
    },
  ]
  // 新建|编辑
  const okHandle = async () => {
    onClose();
  };

  // 查看记录
  const getHistory = async () => {
    try {
      const _data = await getFamilyImage({pic_id: historyValues.id});
      if (_data.code === 0) {
        return {
          data: _data.data.log,
          success: true
        };
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.error('获取信息失败');
      return false;
    }
  }


  useEffect(() => {

  },[])


  return (
    <Modal
      width={900}
      maskClosable= {false}
      destroyOnClose
      title='查看记录'
      footer={false}
      visible={modalVisible}
      rowKey="id"
      onOk={okHandle}
      onCancel={() => {
        onClose();
      }}
    >
      <ProTable<FormValues>
        headerTitle=""
        toolBarRender={false}
        columns={columns}
        bordered
        search={false}
        optionRender={false}
        options={false}
        tableAlertRender={false}
        rowKey="id"
        pagination={false}
        request={(params) => getHistory(params)}
      />
    </Modal>
  )
}

export default LogList;
