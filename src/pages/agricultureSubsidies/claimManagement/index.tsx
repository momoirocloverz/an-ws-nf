/* eslint-disable no-unused-vars */
import React, {
  ReactText,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ClaimRecordTable from '@/components/agricultureSubsidies/ClaimRecordTable';
import {
  Menu, message,
} from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CLAIM_RECORD_TABLES, USER_TYPES } from '@/pages/agricultureSubsidies/consts';
import { getCategoryList } from '@/services/agricultureSubsidies';
import { findAuthorizationsByPath, transformCategoryTree } from '@/pages/agricultureSubsidies/utils';
import { CascaderOptionType } from 'antd/es/cascader';
import { ActionType } from '@ant-design/pro-table';
import styles from './index.less';

type ViewType = {
  view: JSX.Element;
  permissions: string[]
}

type PropType = {
  user: any,
  regions: CascaderOptionType[],
  authorizations: any[],
}

function ClaimManagement({ user, regions, authorizations }: PropType) {
  const [selectedTable, setSelectedTable]:any = useState<ReactText | null>(CLAIM_RECORD_TABLES.INVALID);
  const [categoryTree, setCategoryTree] = useState<CascaderOptionType[]>([]);
  const tableRef:any = useRef<ActionType>(null);
  const [defaultRegion, setDefaultRegion]:any = useState(undefined);
  const [initialized, setInitialized] = useState(false);
  const handleTableChange = (e) => {
    setSelectedTable(e.key.toString());
  };
  useEffect(() => {
    let isMounted = true;
    getCategoryList()
      .then((result) => {
        if (isMounted) {
          setCategoryTree(transformCategoryTree(result.data));
        }
      })
      .catch((e) => message.error(`补贴项目列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
    };
  }, []);

  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.VILLAGE_OFFICIAL) > -1), [user, authorizations]);
  const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.TOWN_OFFICIAL) > -1), [user, authorizations]);
  const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.CITY_OFFICIAL) > -1), [user, authorizations]);

  const userAuthorizations = useMemo(() => ({ isVillageOfficial, isTownOfficial, isCityOfficial }), [isVillageOfficial, isTownOfficial, isCityOfficial]);
  const lockedRegions = useMemo(() => {
    if (regions.length > 0 && user) {
      const idx = regions.map((r) => r.value).indexOf(user.city_id);
      if (idx > -1) {
        const tree = [...regions];
        const lockedEntry = { ...(regions[idx]) };
        // lockedEntry.disabled = true;  // 不禁用2022-03-04 修改逻辑
        tree[idx] = lockedEntry;
        return tree;
      }
    }
    return regions;
  }, [regions, user]);
  const availableTables = useMemo(() => {
    const availablePermissions: string[] = [];
    if (isVillageOfficial) { availablePermissions.push('village'); }
    if (isTownOfficial) { availablePermissions.push('town'); }
    if (isCityOfficial) { availablePermissions.push('city'); }

    const views: ViewType[] = [
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.PENDING_VALIDATION}>村未公示</Menu.Item>,
        permissions: ['village'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.POSTED}>公示中</Menu.Item>,
        permissions: ['village'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.SUBMITTED}>已公示</Menu.Item>,
        permissions: ['village'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.REJECTED}>驳回记录</Menu.Item>,
        permissions: ['village'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.PENDING_VALIDATION_VIEW_ONLY}>镇未公示</Menu.Item>,
        permissions: ['town'],
      },
      // {
      //   view: <Menu.Item key={CLAIM_RECORD_TABLES.TOWN_ANNOUNCEMENT}>镇公示中</Menu.Item>,
      //   permissions: ['town'],
      // },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.TOWN_ANNOUNCEMENT}>镇公示中</Menu.Item>,
        permissions: ['town'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.PENDING_APPROVAL}>待审核</Menu.Item>,
        permissions: ['town'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.APPROVED}>审核通过</Menu.Item>,
        permissions: ['town'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.FINANCIAL_BACK}>财政退回</Menu.Item>,
        permissions: ['town'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.TRANSACTION_HISTORY}>打款记录</Menu.Item>,
        permissions: ['village', 'town','city'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.PENDING_VIEW_ONLY}>未完成公示</Menu.Item>,
        permissions: ['city'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.PENDING_APPROVAL_VIEW_ONLY}>待街道审核</Menu.Item>,
        permissions: ['city'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.APPROVED_VIEW_ONLY}>街道已审核</Menu.Item>,
        permissions: ['city'],
      },
      {
        view: <Menu.Item key={CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY}>财政退回</Menu.Item>,
        permissions: ['city'],
      },
    ];

    const availableViews: JSX.Element[] = views.filter((e) => e.permissions.filter((p) => availablePermissions.includes(p)).length).map((e) => e.view);
    setSelectedTable(availableViews[0]?.key);
    return availableViews;
  }, [user, isVillageOfficial, isTownOfficial, isCityOfficial]);

  useEffect(() => {
    if (user && regions.length > 0 && authorizations.length > 0) {
      const emptyArr = [];
      user?.city_id>0 && emptyArr.push(user.city_id);
      user?.town_id>0 && emptyArr.push(user.town_id);
      user?.village_id>0 && emptyArr.push(user.village_id);
      setDefaultRegion(emptyArr);
      setInitialized(true);
    }
  }, [user, regions, authorizations]);

  return (
    <PageHeaderWrapper>
      <div className={styles.pageContent}>
        <div className={styles.headerBar}>
          <Menu onSelect={handleTableChange} selectedKeys={[selectedTable]} mode="horizontal">
            {availableTables}
          </Menu>
          {/* <div className={styles.headerAdditionalRow}> */}
          {/*  <div className={styles.headerRegionDisplay}> */}
          {/*    <span className={styles.regionDisplayLabel}>地区:</span> */}
          {/*    <Cascader */}
          {/*      options={lockedRegions} */}
          {/*      // bordered={false} */}
          {/*      value={selectedRegion} */}
          {/*      disabled={(isVillageOfficial && !(isTownOfficial || isCityOfficial))} */}
          {/*      onChange={(v) => setSelectedRegion(v)} */}
          {/*      changeOnSelect={isTownOfficial || isCityOfficial} */}
          {/*      allowClear={false} */}
          {/*    /> */}
          {/*  </div> */}
          {/*  {isTownOfficial */}
          {/*  && selectedTable === CLAIM_RECORD_TABLES.PENDING_APPROVAL ? ( */}
          {/*    <Button type="primary" className={styles.headerBarActionBtn} onClick={() => setIsListModalOpen(true)}>批量通过</Button> */}
          {/*    ) : null} */}
          {/*  {isVillageOfficial */}
          {/*  && selectedTable === CLAIM_RECORD_TABLES.PENDING_VALIDATION ? ( */}
          {/*    <Button type="primary" className={styles.headerBarActionBtn} onClick={() => setIsDraftModalOpen(true)}>开始公示</Button> */}
          {/*    ) : null} */}
          {/* </div> */}
        </div>
        {initialized ? (
          <ClaimRecordTable
            table={selectedTable}
            catTree={categoryTree}
            tableRef={tableRef}
            userAuthorizations={userAuthorizations}
            defaultRegion={defaultRegion}
            regions={lockedRegions}
          />
        ) : null}
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList,
}))(ClaimManagement);
