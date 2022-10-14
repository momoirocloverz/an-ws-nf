import React, { useMemo, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import GovEmployees from '@/components/myHometown/GovEmployees';
import PartyMembers from '@/components/myHometown/PartyMembers';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { findAuthorizationsByPath } from '@/pages/agricultureSubsidies/utils';
import { USER_TYPES } from '@/pages/agricultureSubsidies/consts';
import MyHometown from '@/components/myHometown/MyHometown';
import styles from './index.less';
import Overview from "@/components/myHometown/Overview";
import Gruppenfuhrer from "@/components/myHometown/Gruppenfuhrer";
import Others from "@/components/myHometown/Others";

function MyHomeTown({ user, authorizations, regionTree }) {
  const [selectedTable, setSelectedTable] = useState(['hometown']);

  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.VILLAGE_OFFICIAL) > -1), [user, authorizations]);
  const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.TOWN_OFFICIAL) > -1), [user, authorizations]);
  const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/claim-management').indexOf(USER_TYPES.CITY_OFFICIAL) > -1), [user, authorizations]);

  return (
    <PageHeaderWrapper>
      <div className={styles.page}>
        <Menu
          mode="horizontal"
          selectedKeys={selectedTable}
          onSelect={({ selectedKeys }) => {
            setSelectedTable(selectedKeys);
          }}
        >
          <Menu.Item key="hometown">首页广告</Menu.Item>
          <Menu.Item key="overview">村情村貌概况</Menu.Item>
          <Menu.Item key="partyMembers">党员概况</Menu.Item>
          <Menu.Item key="govEmployees">村干部概况</Menu.Item>
          <Menu.Item key="gruppenfuhrer">组长网格概况</Menu.Item>
          <Menu.Item key="others">其他</Menu.Item>
        </Menu>
        { selectedTable[0] === 'hometown' && (
        <MyHometown
          regionTree={regionTree}
          authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
          userRegion={[user.city_id, user.town_id, user.village_id]}
        />
        ) }
        { selectedTable[0] === 'partyMembers' && (
        <PartyMembers
          regionTree={regionTree}
          authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
          userRegion={[user.city_id, user.town_id, user.village_id]}
        />
        ) }
        { selectedTable[0] === 'govEmployees' && (
          <GovEmployees
            regionTree={regionTree}
            authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
            userRegion={[user.city_id, user.town_id, user.village_id]}
          />
        ) }
        { selectedTable[0] === 'overview' && (
        <Overview
          user={user}
          regionTree={regionTree}
          authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
          userRegion={[user.city_id, user.town_id, user.village_id]}
        />
        ) }
        { selectedTable[0] === 'gruppenfuhrer' && (
          <Gruppenfuhrer
            regionTree={regionTree}
            authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
            userRegion={[user.city_id, user.town_id, user.village_id]}
          />
        ) }
        { selectedTable[0] === 'others' && (
          <Others
            regionTree={regionTree}
            authorizations={{ isVillageOfficial, isTownOfficial, isCityOfficial }}
            userRegion={[user.city_id, user.town_id, user.village_id]}
          />
        ) }
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regionTree: info.areaList,
}))(MyHomeTown);
