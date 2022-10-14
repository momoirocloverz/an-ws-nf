import { Cascader, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
// import CreateForm from './components/CreateForm';
import { TableListItem } from '../data.d';
import { integralScoreList, integralChange } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { checkPermissions } from '@/components/Authorized/CheckPermissions';
import AboutFamily from './AboutFamily';


const TableList: React.FC<any> = (props) => {
  const { userAuthButton, accountInfo, areaList } = props;
  const [hasAreaAuth, setHasAreaAuth] = useState(false)
  const [pageParams, setPageParams] = useState<any>({})
  const [modalVisible, handleModalVisible] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<any>({})
  const [selectArea, setSelectArea] = useState<any>([])
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'item_id',
      hideInSearch: true,
    },
    {
      title: '打分项名称',
      dataIndex: 'item_name',
      width: 220
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      width: 160,
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        let areaLists = (accountInfo.role_type === 4 && areaList.length > 0) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect />
        )
      }
    },
    {
      title: '分值',
      dataIndex: 'point',
      hideInSearch: true
    },
    {
      title: '打分类型',
      dataIndex: 'direction_name',
      hideInSearch: true
    },
    {
      title: '参与家庭',
      dataIndex: 'family_count',
      hideInSearch: true,
    },
    {
      title: '累计打分次数',
      dataIndex: 'times',
      hideInSearch: true,
    },
    {
      title: '累计打分值',
      dataIndex: 'score',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <ButtonAuth type="CHECK_INTEGRAL_FAMILY">
            <a
              onClick={() => {
                handleModalVisible(true)
                setFormValues(record)
              }}>
              查看
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];


  const getIntegralScoreList = async (val: any) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
      // let len = val.area.length
      // if (len === 1) {
      //   val.city_id = val.area[0]
      // } else if (len === 2) {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      // } else {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      //   val.village_id = val.area[2]
      // }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    const _params = paginationHandle(val);
    setPageParams(_params)
    const _data = await integralScoreList(_params);
    return tableDataHandle(_data)
  }

  const getAuthArr = () => {
    let authArr: string[] = [];
    for (let i = 0; i < userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    let hasColumnAuth: any = checkPermissions("COLUMN_ADDRESS", authArr, true, false)
    setHasAreaAuth(hasColumnAuth)
  }

  // 导出列表
  const exportList = async () => {
    let cityId = '';
    let townId = '';
    let villageId = '';
    if (accountInfo.role_type == 3) {
      cityId = accountInfo.city_id
      townId = accountInfo.town_id
      villageId = accountInfo.village_id
    } else {
      cityId = pageParams.city_id
      townId = pageParams.town_id
      villageId = pageParams.village_id
    }
    window.open('/farmapi/gateway?api_name=export_item&version=1.2.0&os=h5&sign'
      + (pageParams.item_name ? '&item_name=' + pageParams.item_name : '')
      + (cityId ? '&city_id=' + cityId : '')
      + (townId ? '&town_id=' + townId : '')
      + (villageId ? '&village_id=' + villageId : '')
    )
  }

  useEffect(() => {
    getAuthArr();
  }, [props.userAuthButton]);


  return (
    <div>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="item_id"
        options={false}
        search={true}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="EXPORT_INTEGRAL_TYPE">
            <Button type="primary" onClick={exportList}>
              导出
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getIntegralScoreList(params)}
        // columns={hasAreaAuth?[...columns.slice(0,4),areaColumn,...columns.slice(4)]:columns}
        columns={columns}
      />
      {
        modalVisible ? (
          <AboutFamily
            values={formValues}
            onCancel={() => {
              handleModalVisible(false)
              setFormValues({})
            }}
            modalVisible={modalVisible}
          />
        ) : null
      }
    </div>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(TableList);
