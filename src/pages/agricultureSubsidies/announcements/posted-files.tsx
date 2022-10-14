import React, { useRef, useState } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { tableDataHandle } from '@/utils/utils';
import TableImage from '@/components/ImgView/TableImage';
import AnnouncementModal from '@/components/agricultureSubsidies/announcements/AnnouncementModal';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {deleteAnnouncement, deletePostedItem, getAnnouncements, getPostedItems} from '@/services/agricultureSubsidies';
import PostedItemModal from '@/components/agricultureSubsidies/announcements/PostedItemModal';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const { RangePicker } = DatePicker;

function PostedFiles({ user }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      title: rawParams.title,
      dateRange: rawParams.createdAt,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getPostedItems(params);
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      title: row.title,
      submitter: row.user_name,
      createdAt: row.created_at,
      content: row.content,
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
      title: '文章标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '发布人员',
      dataIndex: 'submitter',
      hideInSearch: true,
      align: 'center',
    },
    // {
    //   title: '政策内容',
    //   dataIndex: 'content',
    //   hideInSearch: true,
    //   // ellipsis: true,
    //   // width: 800,
    //   align: 'center',
    //   render: (text) => (
    //     <div style={{ wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15ch' }}>
    //       {new DOMParser().parseFromString(text, 'text/html').documentElement.textContent}
    //     </div>
    //   ),
    // },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      align: 'center',
      renderFormItem: () => (<RangePicker picker="date" />),
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {/* <ButtonAuth type="EDIT"> // 完全多余 */}
          <Button
            type="link"
            onClick={() => {
              Modal.info({
                content: <div dangerouslySetInnerHTML={{ __html: record.content }} />,
                width: 800,
                maskClosable: true,
                okText: '关闭',
                icon: false,
              });
            }}
          >
            预览
          </Button>
          {/* </ButtonAuth> */}
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
                  content: `确认删除${record.title}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await deletePostedItem(record.id);
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
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                user && setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <PostedItemModal
        context={selectedRow}
        visible={isModalVisible}
        user={user}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user }: ConnectState) => ({
  user: user.accountInfo,
}))(PostedFiles);
