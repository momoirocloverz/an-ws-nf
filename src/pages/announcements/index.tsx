// 权限: CREATE, MODIFY, DELETE, CITY_OFFICIAL, VILLAGE_OFFICIAL
import React, { useMemo, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { tableDataHandle } from '@/utils/utils';
import {
  Button, DatePicker, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ButtonAuth from '@/components/ButtonAuth';
import AnnouncementArticleModal from '@/components/announcements/AnnouncementArticleModal';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { deleteAnnouncement, getAnnouncements } from '@/services/announcements';
import { findAuthorizationsByPath } from '@/pages/agricultureSubsidies/utils';
import styles from './index.less';
import { AnnouncementCategories, USER_TYPES } from './consts';
import TableImage from "@/components/ImgView/TableImage";

const { RangePicker } = DatePicker;

function Announcements({ regionTree, authorizations, user }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/news-releases/announcements').includes(USER_TYPES.VILLAGE_OFFICIAL)), [user, authorizations]);
  const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/news-releases/announcements').includes(USER_TYPES.TOWN_OFFICIAL)), [user, authorizations]);
  const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/news-releases/announcements').includes(USER_TYPES.CITY_OFFICIAL)), [user, authorizations]);

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '地区',
      dataIndex: 'regionString',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '分类',
      dataIndex: 'category',
      align: 'center',
      filters: false,
      valueEnum: AnnouncementCategories,
    },
    {
      title: '封面',
      dataIndex: 'poster',
      hideInSearch: true,
      align: 'center',
      render: (item) => (<TableImage src={item.url} />),
      width: 140,
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      renderFormItem: () => (<RangePicker picker="date" />),
    },
    {
      title: '浏览人数',
      dataIndex: 'views',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div className={styles.actionContainer}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                console.log(record, 'record')
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
  const loadData = async (rawParams) => {
    const params = {
      title: rawParams.title,
      category: rawParams.category,
      dateRange: rawParams.createdAt,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getAnnouncements(params);
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      region: [row.city_id, row.town_id, row.village_id],
      regionString: row.area_name.split('/').filter((str) => str).join('/'),
      title: row.title,
      category: row.cate_id,
      poster: row.image,
      views: row.views,
      createdAt: row.created_at,
      content: row.content,
      file_url: row.file_url,
      pdf_id: row.pdf_id
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

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
                setSelectedRow({ action: 'create', region: [user.city_id, user.town_id, user.village_id] });
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <AnnouncementArticleModal
        context={selectedRow}
        regionTree={regionTree}
        visible={isModalVisible}
        authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
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

export default connect(({ info, user }: ConnectState) => ({
  regionTree: info.areaList,
  user: user.accountInfo,
  authorizations: user.userAuthButton,
}))(Announcements);
