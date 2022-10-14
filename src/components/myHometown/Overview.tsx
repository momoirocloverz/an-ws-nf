import React, {
  useRef, useState,
} from 'react';
import {
  Button, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { tableDataHandle } from '@/utils/utils';
import { BasicUserSet } from '@/pages/myHometown/types';
import { CascaderOptionType } from 'antd/lib/cascader';
import { deleteOverview, getOverview } from '@/services/myHometown';
import OverviewModal from '@/components/myHometown/OverviewModal';
import TableImage from '@/components/ImgView/TableImage';
import ButtonAuth from '@/components/ButtonAuth';

type PropType = {
  authorizations: BasicUserSet;
  regionTree: CascaderOptionType[];
  userRegion: number[];
}

export default function Overview({
  user, authorizations, regionTree, userRegion,
}: PropType) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const [showCreateBtn, setShowCreateBtn] = useState(false);

  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getOverview(params);
    setStoredParams(params);
    const transformed = Array.isArray(result.data.data)
      ? result.data.data.map((row) => ({
        ...row,
        id: row.id,
        image: (row.image && row.image_url) ? [{
          uid: row.image,
          url: row.image_url,
        }] : undefined,
      })) : [];
    setShowCreateBtn(transformed.length === 0);
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
      title: '占地面积',
      dataIndex: 'area_covered',
      align: 'center',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '总人口',
      dataIndex: 'total_population',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (__, record) => { 
        return record.total_population + '人'
      }
    },
    {
      title: '总户数',
      dataIndex: 'total_households',
      hideInSearch: true,
      align: 'center',
      width: 120,
    },
    {
      title: '组别',
      dataIndex: 'group',
      hideInSearch: true,
      align: 'center',
      width: 120,
    },
    {
      title: '党员人数',
      dataIndex: 'party_member_people',
      hideInSearch: true,
      align: 'center',
      width: 120,
    },
    {
      title: '村级工作特色及荣誉',
      dataIndex: 'characteristic_honor',
      hideInSearch: true,
      align: 'center',
      width: 200,
    },
    {
      title: '图片',
      dataIndex: 'image',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (text, record) => (<TableImage src={record.image?.[0]?.url} />),
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow({ ...record, action: 'modify' });
              setIsModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                content: '确认删除?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                  try {
                    await deleteOverview(record.id);
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
        </div>
      ),
    },
  ];

  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        search={false}
        options={false}
        toolBarRender={() => [
          showCreateBtn && (
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>
          </ButtonAuth>
          ),
        ]}
      />
      <OverviewModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </>
  );
}
