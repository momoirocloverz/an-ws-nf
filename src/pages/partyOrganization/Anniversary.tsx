import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  deleteAnniversaryEvent,
  getAnniversaryEvents,
} from '@/services/partyOrganization';
import AnniversaryEventModal from '@/components/partyOrganization/AnniversaryEventModal';
import {clearDefaultDatetimeFormat} from "@/pages/agricultureSubsidies/utils";
import UploadVideoModal from "@/components/partyOrganization/UploadVideoModal";

const { RangePicker } = DatePicker;

function Anniversary() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  // const [storedParams, setStoredParams] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      createdAt: rawParams.createdAt,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getAnniversaryEvents(params);
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      date: row.date,
      content: row.content,
      createdAt: row.created_at,
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '党事日期',
      dataIndex: 'date',
      align: 'center',
      hideInSearch: true,
      render: (text) => (clearDefaultDatetimeFormat(text)),
      width: 160,
    },
    {
      title: '事件',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      render: (text) => (<div style={{ wordBreak: 'break-word' }}>{text}</div>),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      renderFormItem: () => (<RangePicker picker="date" />),
      width: 160,
      // hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify' });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${clearDefaultDatetimeFormat(record.date)}的党事?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await deleteAnniversaryEvent(record.id);
                      message.success('删除成功!');
                      tableRef.current.reload();
                    } catch (e) {
                      message.error(new Error(`删除失败: ${e.message}!`));
                    }
                  },
                });
              }}
            >
              删除
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="EDIT">
            <Button
              type="primary"
              onClick={() => {
                setIsVideoModalVisible(true);
              }}
            >
              修改视频
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <AnniversaryEventModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
      <UploadVideoModal
        visible={isVideoModalVisible}
        onCancel={() => setIsVideoModalVisible(false)}
        onSuccess={() => {
          setIsVideoModalVisible(false);
        }}
      />
    </PageHeaderWrapper>
  );
}

export default Anniversary;
