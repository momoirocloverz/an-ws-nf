/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import {
  Button, Cascader, DatePicker, message,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { tableDataHandle } from '@/utils/utils';
import { getApplicationStats } from '@/services/agricultureSubsidies';
import { connect } from 'umi';
import _ from 'lodash';
import { ConnectState } from '@/models/connect';
import ExportButton from '@/components/agricultureSubsidies/ExportButton';
import useCategories from '@/components/agricultureSubsidies/useCategories';
import { ownershipTypes, seasons, USER_TYPES } from '@/pages/agricultureSubsidies/consts';
import { RegionalApplicationDetailsModal } from '@/pages/agricultureSubsidies/stats/DetailsModal';
import { findAuthorizationsByPath } from '@/pages/agricultureSubsidies/utils';

type BaseType = {
  counts: number | null | undefined;
  totals: number | null | undefined;
}

type TableListItem = {
  id: number;
  town: string | null | undefined;
  village: string | null | undefined;
  townId: number | null | undefined;
  villageId: number | null | undefined;
  completed: BaseType | null | undefined;
  approved: BaseType | null | undefined;
  pendingApproval: BaseType | null | undefined;
  posted: BaseType | null | undefined;
  stage: string | undefined;
  regionName: string;
  numOfHouseholds: number | null | undefined;
  sizeInMu: number | null | undefined;
};

function ApplicationStats({ user, authorizations, regionTree }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContext, setModalContext] = useState<TableListItem>({});
  const [initialized, setInitialized] = useState(false);
  const [savedParams, setSavedParams] = useState({ region: [user.city_id, user.town_id, user.village_id].filter((e) => e) });
  const catTree = useCategories();
  const isMounted = useRef(true);
  const tableRef = useRef();

  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/stats').includes(USER_TYPES.VILLAGE_OFFICIAL)), [user, authorizations]);
  const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/stats').includes(USER_TYPES.TOWN_OFFICIAL)), [user, authorizations]);
  const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/stats').includes(USER_TYPES.CITY_OFFICIAL)), [user, authorizations]);

  function renderValue(value, unit, linkType = 0, record = {}) {
    console.log(value, unit, linkType , record);
    // return
    if (linkType && value) {
      return (
        <span>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              const region = [savedParams.region[0], record.townId ?? savedParams.region[1], record.villageId ?? savedParams.region[2]].filter((e) => e);
              setModalContext({
                ...savedParams, region, regionName: record.regionName, type: linkType,
              });
              setIsModalVisible(true);
            }}
          >
            {_.round(value, 2)}
          </Button>
          {unit}
        </span>
      );
    }
    return `${(value && _.round(value, 2)) || '0'}${unit}`;
  }

  const columns: any = [
    // ==============================================================
    {
      title: '??????',
      key: 'region',
      dataIndex: 'name',
      hideInTable: savedParams.region.length > 2,
      initialValue: [user.city_id, user.town_id, user.village_id].filter((e) => e),
      renderFormItem: () => <Cascader options={regionTree} changeOnSelect allowClear={false} disabled={!isCityOfficial} />,
    },
    {
      title: '??????',
      key: 'year',
      hideInTable: true,
      renderFormItem: () => <DatePicker picker="year" />,
    },
    {
      title: '??????',
      key: 'season',
      hideInTable: true,
      initialValue: '1',
      valueEnum: seasons,
    },
    {
      title: '??????',
      key: 'ownershipType',
      hideInTable: true,
      valueEnum: ownershipTypes,
    },
    {
      title: '????????????',
      key: 'category',
      hideInTable: true,
      initialValue: [catTree[0]?.value, catTree[0]?.children?.[0]?.value],
      renderFormItem: () => <Cascader options={catTree} />,
    },
    // ==============================================================
    // {
    //   title: '?????????',
    //   dataIndex: 'town',
    //   hideInSearch: true,
    //   hideInTable: savedParams.region.length !== 1,
    // },
    // {
    //   title: '???(??????)',
    //   dataIndex: 'village',
    //   hideInSearch: true,
    //   hideInTable: savedParams.region.length !== 2,
    // },
    {
      title: '?????????',
      dataIndex: 'completed',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => (
        <div>
          {renderValue(record.completed?.counts, '???', 1, record)}
          {`/${renderValue(record.completed?.totals, '???')}`}
          {`/${renderValue(record?.completed?.total_subsidy_amount ?? 0, '???')}`}
        </div>
      ),
    },
    {
      title: '?????????????????????',
      dataIndex: 'approved',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => (
        <div>
          {renderValue(record.approved?.counts, '???', 2, record)}
          {`/${renderValue(record.approved?.totals, '???')}`}
          {`/${renderValue(record?.approved?.total_subsidy_amount ?? 0, '???')}`}
        </div>
      ),
    },
    {
      title: '????????????',
      dataIndex: 'pendingApproval',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => (
        <div>
          {renderValue(record.pendingApproval?.counts, '???', 3, record)}
          {`/${renderValue(record.pendingApproval?.totals, '???')}`}
          {`/${renderValue(record?.pendingApproval?.total_subsidy_amount ?? 0, '???')}`}
        </div>
      ),
    },
    {
      title: '?????????',
      dataIndex: 'posted',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => (
        <div>
          {renderValue(record.posted?.counts, '???', 4, record)}
          {`/${renderValue(record.posted?.totals, '???')}`}
          {`/${renderValue(record?.posted?.total_subsidy_amount ?? 0, '???')}`}
        </div>
      ),
    },
    {
      title: '????????????',
      dataIndex: 'financial',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => {
        return (
          <div>
            {renderValue(record.financial?.counts, '???', 5, record)}
            {`/${renderValue(record.financial?.totals, '???')}`}
            {`/${renderValue(record?.financial?.total_subsidy_amount ?? 0, '???')}`}
          </div>
        );
      },
    },
    {
      title: '?????????',
      dataIndex: 'unpublished',
      hideInSearch: true,
      hideInTable: savedParams.region.length > 2,
      render: (__, record) => {
        return (
          <div>
            {renderValue(record.unpublished?.counts, '???', 6, record)}
            {`/${renderValue(record.unpublished?.totals, '???')}`}
            {`/${renderValue(record?.unpublished?.total_subsidy_amount ?? 0, '???')}`}
          </div>
        );
      },
    },
    // ==============================================================
    {
      title: '??????',
      dataIndex: 'stage',
      hideInSearch: true,
      hideInTable: savedParams.region.length !== 3,
    },
    {
      title: '??????',
      dataIndex: 'numOfHouseholds',
      hideInSearch: true,
      hideInTable: savedParams.region.length !== 3,
      render: (__, record) => renderValue(record.numOfHouseholds, '???', record.id, record),
    },
    {
      title: '??????',
      dataIndex: 'sizeInMu',
      hideInSearch: true,
      hideInTable: savedParams.region.length !== 3,
      render: (__, record) => renderValue(record.sizeInMu, '???'),
    },

    // {
    //   title: '??????',
    //   key: 'actions',
    //   hideInSearch: true,
    //   // hideInTable: savedParams.region.length !== 3,
    //   render: (__, record) => (
    //     <Button
    //       type="link"
    //       onClick={() => {
    //         const region = [savedParams.region[0], record.townId ?? savedParams.region[1], record.villageId ?? savedParams.region[2]].filter((e) => e);
    //         setModalContext({
    //           ...savedParams, region, regionName: record.regionName, type: 3,
    //         });
    //         setIsModalVisible(true);
    //       }}
    //     >
    //       ??????
    //     </Button>
    //   ),
    // },
  ];

  // FIXME: memory leak
  const loadData = async (rawParams) => {
    try {
      const params = {
        region: rawParams.region ?? [user.city_id, user.town_id, user.village_id].filter((e) => e),
        year: rawParams.year && new Date(rawParams.year).getFullYear(),
        season: rawParams.season ?? '1',
        ownershipType: rawParams.ownershipType,
        category: rawParams.category ?? [catTree[0]?.value, catTree[0]?.children?.[0]?.value],
        pageNum: rawParams.current,
        pageSize: rawParams.pageSize,
      };
      console.log(params, 'params')
      const result = await getApplicationStats(params);
      if (result.code !== 0) {
        throw new Error(result.msg);
      }
      setSavedParams(params);
      let transformedResult;
      if (params.region.length === 3) {
        const transformed = [
          {
            id: 1, regionName: result.data.name, stage: '?????????', numOfHouseholds: result.data.get_Issued.counts, sizeInMu: result.data.get_Issued.totals,
          },
          {
            id: 2, regionName: result.data.name, stage: '?????????????????????', numOfHouseholds: result.data.get_To_be_issued.counts, sizeInMu: result.data.get_To_be_issued.totals,
          },
          {
            id: 3, regionName: result.data.name, stage: '????????????', numOfHouseholds: result.data.get_To_be_reviewed.counts, sizeInMu: result.data.get_To_be_reviewed.totals,
          },
          {
            id: 4, regionName: result.data.name, stage: '?????????', numOfHouseholds: result.data.get_In_public.counts, sizeInMu: result.data.get_In_public.totals,
          },
          {
            id: 5, regionName: result.data.name, stage: '????????????', numOfHouseholds: result.data.get_Financial_return.counts, sizeInMu: result.data.get_Financial_return.totals,
          },
          {
            id: 6, regionName: result.data.name, stage: '?????????', numOfHouseholds: result.data.get_Unpublished.counts, sizeInMu: result.data.get_Unpublished.totals,
          },
        ];
        console.log(transformed, 'transformed1');
        // @ts-ignore
        transformedResult = tableDataHandle({ code: 0, data: { data: transformed } });
      } else {
        const transformed = result.data.map((d) => ({
          id: `${d.city_id}::${d.town_id}::${d.village_id}`,
          town: d.town_name,
          village: d.village_name,
          townId: d.town_id,
          villageId: d.village_id,
          regionName: d.name,
          completed: d.get_Issued,
          approved: d.get_To_be_issued,
          pendingApproval: d.get_To_be_reviewed,
          posted: d.get_In_public,
          financial: d.get_Financial_return, // ????????????
          unpublished: d.get_Unpublished, // ?????????
          name: d.name
        }));
        let totalCompletedFamily = 0,
        totalCompletedMu = 0,
        totalCompletedMoney = 0,
        totalApprovedFamily = 0,
        totalApprovedMu = 0,
        totalApprovedMoney = 0,
        totalPendingApprovalFamily = 0,
        totalPendingApprovalMu = 0,
        totalPendingApprovalMoney = 0,
        totalPostedFamily = 0,
        totalPostedMu = 0,
        totalPostedMoney = 0,
        totalFinancialFamily = 0,
        totalFinancialMu = 0,
        totalFinancialMoney = 0,
        totalUnpublishedFamily = 0,
        totalUnpublishedMu = 0,
        totalUnpublishedMoney = 0
        result.data.map(res => {
          // ???????????????
          totalCompletedFamily = totalCompletedFamily + res.get_Issued.counts;
          totalCompletedMu = totalCompletedMu + res.get_Issued.totals;
          totalCompletedMoney = totalCompletedMoney + res.get_Issued.total_subsidy_amount;
          // ???????????????
          totalApprovedFamily = totalApprovedFamily + res.get_To_be_issued.counts;
          totalApprovedMu = totalApprovedMu + res.get_To_be_issued.totals;
          totalApprovedMoney = totalApprovedMoney + res.get_To_be_issued.total_subsidy_amount;
          // ??????????????????
          totalPendingApprovalFamily = totalPendingApprovalFamily + res.get_To_be_reviewed.counts;
          totalPendingApprovalMu = totalPendingApprovalMu + res.get_To_be_reviewed.totals;
          totalPendingApprovalMoney = totalPendingApprovalMoney + res.get_To_be_reviewed.total_subsidy_amount;
          // ???????????????
          totalPostedFamily = totalPostedFamily + res.get_In_public.counts;
          totalPostedMu = totalPostedMu + res.get_In_public.totals;
          totalPostedMoney = totalPostedMoney + res.get_In_public.total_subsidy_amount;
          // ???????????? ??????
          totalFinancialFamily = totalFinancialFamily + res.get_Financial_return.counts;
          totalFinancialMu = totalFinancialMu + res.get_Financial_return.totals;
          totalFinancialMoney = totalFinancialMoney + res.get_Financial_return.total_subsidy_amount;
          // ????????? ??????
          totalUnpublishedFamily = totalUnpublishedFamily + res.get_Unpublished.counts;
          totalUnpublishedMu = totalUnpublishedMu + res.get_Unpublished.totals;
          totalUnpublishedMoney = totalUnpublishedMoney + res.get_Unpublished.total_subsidy_amount;
        })
        transformed.push({
          town: '??????',
          id: '10',
          completed: {counts: totalCompletedFamily, totals: totalCompletedMu, total_subsidy_amount: totalCompletedMoney},
          approved: {counts: totalApprovedFamily, totals: totalApprovedMu, total_subsidy_amount: totalApprovedMoney},
          pendingApproval: {counts: totalPendingApprovalFamily, totals: totalPendingApprovalMu, total_subsidy_amount: totalPendingApprovalMoney},
          posted: {counts: totalPostedFamily, totals: totalPostedMu, total_subsidy_amount: totalPostedMoney},
          financial: { counts: totalFinancialFamily, totals: totalFinancialMu, total_subsidy_amount: totalFinancialMoney }, // ????????????
          unpublished: { counts: totalUnpublishedFamily, totals: totalUnpublishedMu, total_subsidy_amount: totalUnpublishedMoney } // ?????????
        })
        // @ts-ignore
        console.log(transformed, 'transformed2');
        transformedResult = tableDataHandle({ code: 0, data: { data: transformed } });
      }
      if (isMounted.current) {
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      message.error(`????????????????????????: ${e.message}`);
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
    if (user && authorizations?.length > 0 && regionTree.length > 0 && catTree.length > 0) {
      setInitialized(true);
    }
  }, [user, authorizations, regionTree, catTree]);

  return (
      <main>
        {initialized && (
          <ProTable<TableListItem>
            actionRef={tableRef}
            request={loadData}
            columns={columns}
            rowKey="id"
            options={false}
            pagination={false}
            search={{ collapsed: false, collapseRender: false }}
            toolBarRender={() => ([
              <ExportButton params={savedParams} func={getApplicationStats} />,
            ])}
          />
        )}
        <RegionalApplicationDetailsModal context={modalContext} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} />
      </main>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regionTree: info.areaList,
}))(ApplicationStats);
