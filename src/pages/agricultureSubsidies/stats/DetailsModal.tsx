/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  Button, message, Modal,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { tableDataHandle } from '@/utils/utils';
import { getStatDetails } from '@/services/agricultureSubsidies';
import {
  downloadDocumentsAsZipFile,
} from '@/pages/agricultureSubsidies/utils';
import _ from 'lodash';
import ExportButton from '@/components/agricultureSubsidies/ExportButton';
import {
  ownershipTypes,
  seasons,
} from '@/pages/agricultureSubsidies/consts';
import DocumentPreviewModal from '@/components/agricultureSubsidies/DocumentPreviewModal';

type BaseType = {
  counts: number | null | undefined;
  totals: number | null | undefined;
}

type TableListItem = {
  id: number;
  town: string | null | undefined;
  village: string | null | undefined;
  completed: BaseType | null | undefined;
  approved: BaseType | null | undefined;
  pendingApproval: BaseType | null | undefined;
  posted: BaseType | null | undefined;
  stage: string | undefined;
  numOfHouseholds: number | null | undefined;
  sizeInMu: number | null | undefined;
};

type Context = {
  region: number[];
  regionName: string;
}
type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
}

const stages = {
  1: '已发放',
  2: '审核通过待发放',
  3: '待镇审核',
  4: '公示中',
  5: '财政退回',
  6: '待公示',
};

export function RegionalApplicationDetailsModal({ context, visible, onCancel }: PropType) {
  const [initialized, setInitialized] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const isMounted = useRef(true);
  const tableRef = useRef();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '承包人',
      dataIndex: 'contractor',
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      render: (__, record) => (
        <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : ''}</span>
      ),
    },
    {
      title: '农户类型',
      dataIndex: 'household_type',
      render: (__, record) => (record.household_type === 1 ? '规模户' : '散户'),
      hideInSearch: true
    },
    {
      title: '所属地区',
      dataIndex: 'regionString',
    },
    {
      title: '申报面积(亩)',
      dataIndex: 'cumulativeSize',
      render: (__, record) => (_.round(record.cumulativeSize, 1)),
      hideInTable: true
    },
    {
      title: '承包流转面积',
      dataIndex: 'contractedArea',
      render: (__, record) => (_.round(record.contractedArea, 1)),
      hideInTable: true
    },
    {
      title: '补贴面积(亩)',
      dataIndex: 'plot_area',
      // render: (__, record) => (_.round(Math.min(record.cumulativeSize, record.contractedArea), 1))
    },
    {
      title: '补贴金额',
      dataIndex: 'amount',
    },
    {
      title: '种植作物',
      dataIndex: 'crops',
    },
    {
      title: '性质',
      dataIndex: 'ownershipType',
      valueEnum: { ...ownershipTypes, 0: '全部' },
    },
    {
      title: '年份',
      dataIndex: 'year',
    },
    {
      title: '季节',
      dataIndex: 'season',
      valueEnum: { ...seasons, 0: '全部' },
    },
    {
      title: '补贴项目',
      dataIndex: 'category',
    },
    {
      title: '申报时间',
      dataIndex: 'createdAt',
    },
    {
      title: '材料',
      key: 'documents',
      render: (__, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setIsPreviewModalOpen(true);
              setSelectedRow(record);
            }}
          >
            预览
          </Button>
          <Button type="link" size="small" onClick={() => downloadDocumentsAsZipFile(record)} disabled={!(record.documents?.length > 0)}>
            下载
          </Button>
        </>
      ),
    },
  ];

  // FIXME: memory leak
  const loadData = async (rawParams) => {
    try {
      const params = {
        ...context,
        pageNum: rawParams.current,
        pageSize: rawParams.pageSize,
      };
      const result = await getStatDetails(params);
      if (result.code !== 0) {
        throw new Error(result.msg);
      }
      const transformed = result.data.data.map((d) => ({
        id: d.id,
        contractor: d.real_name,
        cumulativeSize: d.plot_area,
        household_type: d.household_type,
        cumulativeMetricSize: d.plot_area_m,
        createdAt: d.declare_time,
        phoneNumber: d.mobile,
        regionString: d.area_name,
        category: d.scale_name,
        ownershipType: d.subsidy_type,
        crops: d.crops_name,
        contractedArea: d.circulation_area,
        year: d.year,
        season: d.season,
        plot_area: d.plot_area,
        amount: d.subsidy_amount,
        documents: d.stuff_url,
      }));
      // @ts-ignore
      const transformedResult = tableDataHandle({ code: 0, data: { ...(result.data), data: transformed } });
      if (isMounted.current) {
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      message.error(`统计数据读取失败: ${e.message}`);
      return tableDataHandle({
        code: 0,
        data: [],
        pagination: {
          page: 1, item_total: 0, page_count: 1, page_total: 1,
        },
      });
    }
  };
  useEffect(() => () => {
    isMounted.current = false;
  },
  []);
  useEffect(() => {
    if (visible) {
      setInitialized(true);
    }
    return () => {
      if (visible) {
        setInitialized(false);
      }
    };
  },
  [visible]);

  return (
    <Modal
      visible={visible}
      title={`${context.regionName || '--'}${stages[context.type]}统计明细`}
      onCancel={onCancel}
      width={1200}
      footer={false}
      destroyOnClose
    >
      <main>
        {initialized && (
          <ProTable<TableListItem>
            actionRef={tableRef}
            request={loadData}
            columns={columns}
            rowKey="id"
            options={false}
            search={false}
            toolBarRender={() => ([
              <ExportButton params={context} func={getStatDetails} />,
            ])}
          />
        )}
      </main>
      <DocumentPreviewModal
        visible={isPreviewModalOpen}
        context={selectedRow}
        cancelCb={() => setIsPreviewModalOpen(false)}
      />
    </Modal>
  );
}
