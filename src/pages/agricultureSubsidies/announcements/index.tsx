import React, { useRef, useState } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal, Select
} from "antd";
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { tableDataHandle } from '@/utils/utils';
import TableImage from '@/components/ImgView/TableImage';
import AnnouncementModal from '@/components/agricultureSubsidies/announcements/AnnouncementModal';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { deleteAnnouncement, getAnnouncements } from '@/services/agricultureSubsidies';

const { RangePicker } = DatePicker;

function Index() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [categoryId, setCategoryId] = useState('0');
  const categoryList = {
    '0': '全部',
    '1': '种粮补贴',
    '2': '配方肥补贴',
    '3': '农机补贴',
  };
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      title: rawParams.title,
      dateRange: rawParams.createdAt,
      category_id: categoryId,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    console.log(params)
    const result = await getAnnouncements(params);
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      title: row.title,
      poster: row.image,
      createdAt: row.created_at,
      category_id: row.category_id,
      admin_name: row.admin_name,
      content: row.content,
      file_url: row.file_url,
      pdf_id: row.pdf_id
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
      title: '政策标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '政策封面',
      dataIndex: 'poster',
      hideInSearch: true,
      align: 'center',
      render: (__, record) => (<TableImage src={record.poster?.url} />),
      width: 140,
    },
    {
      title: '政策内容',
      dataIndex: 'content',
      hideInSearch: true,
      width: 400,
      align: 'center',
      render: (text) => (
        <div style={{ wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15vh' }}>
          {new DOMParser().parseFromString(text, 'text/html').documentElement.textContent}
        </div>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      align: 'center',
      renderFormItem: () => (<RangePicker picker="date" />),
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      align: 'center',
      renderFormItem:()=>{
        return (
          <Select onChange={(v) => {
            console.log(v)
            setCategoryId(v)
          }} >
              <Select.Option value={'0'}>全部</Select.Option>
              <Select.Option value={'1'}>种粮补贴</Select.Option>
              <Select.Option value={'2'}>配方肥补贴</Select.Option>
              <Select.Option value={'3'}>农机补贴</Select.Option>
          </Select>
        )
      },
      render: (__, record) => (
        <div>
          {categoryList[record.category_id] || '-'}
        </div>
      ),
    },
    {
      title: '发布人',
      dataIndex: 'admin_name',
      hideInSearch: true,
      align: 'center',
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
                      await deleteAnnouncement(record.id);
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
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <AnnouncementModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => {
          setSelectedRow({})
          setIsModalVisible(false)}
        }
        onSuccess={() => {
          setSelectedRow({})
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </PageHeaderWrapper>
  );
}

export default Index;
