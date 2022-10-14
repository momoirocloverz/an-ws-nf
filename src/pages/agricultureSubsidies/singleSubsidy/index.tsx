import React, { useRef, useState, useEffect } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal, Cascader,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formatArea, tableDataHandle } from "@/utils/utils";
import FormModel from './modules/FormModel';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { mask } from '@/utils/utils';
import {
  _subsidyDisposableList,
  _delSubsidyDisposable,
  exportSubsidyDisposable,
} from "@/services/agricultureSubsidies";
import ImportBtn from '@/components/buttons/ImportBtn';
import styles from './index.less';
import { downloadAs } from "@/pages/agricultureSubsidies/utils";

function Index({user, regionTree}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const [ newRegionList, setNewRegion ] = useState([]);
  const [ defaultValue, setDefaultValue ] = useState<any>([]);
  const [ pageParams, setPageParams ] = useState<any>({});
  const [ totalInfo, setTotalInfo ] = useState<any>({})
  //const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/singleSubsidy').includes(USER_TYPES.VILLAGE_OFFICIAL)), [user, authorizations]);
  //const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/singleSubsidy').includes(USER_TYPES.TOWN_OFFICIAL)), [user, authorizations]);
  //const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, '/agriculture-subsidies/singleSubsidy').includes(USER_TYPES.CITY_OFFICIAL)), [user, authorizations]);

  const loadData = async (rawParams) => {
    console.log(rawParams, 'rawParams');
    const params = {
      real_name: rawParams.real_name ?? '',
      city_id: rawParams.area_name?.[0],
      town_id: rawParams.area_name?.[1],
      village_id: rawParams.area_name?.[2],
      page: rawParams.current,
      page_size: rawParams.pageSize,
      is_export: 0 // ---- 0默认 1导出
    };
    setPageParams(params)
    const result = await _subsidyDisposableList(params);
    if(result.data?.total) {
      setTotalInfo(result.data.total);
    }

    console.log(result.data.total, 'result.data.total')
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    return tableDataHandle({
      code: result.code,
      data: result.data.data,
    });
  };

  useEffect(()  =>  {
    const arr = regionTree;
    arr.map(city => {
      city.children.map(town => {
        delete town.children;
      })
    })
    console.log(user, 'arrrrrrr');
    setNewRegion(arr);
    setDefaultValue(formatArea([user.city_id, user.town_id, user.village_id]))
    // console.log(arr, 'arr')
  }, [regionTree])

  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '授权地区',
      dataIndex: 'area_name',
      hideInSearch: user.role_type === 3 ? true : false,
      initialValue: defaultValue,
      renderFormItem: (item, props) => {
        let areaLists = (user.role_type === 4 && newRegionList.length > 0) ? newRegionList[0].children : newRegionList;
        return (
          <Cascader
            options={newRegionList}
            disabled={user.role_type === 4}
            changeOnSelect
          />
        )
      }
    },
    {
      title: '补贴对象',
      dataIndex: 'real_name',
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      hideInSearch: true,
      render: (__, record) => (mask(record.identity, { headLength: 4 })),
    },
    {
      title: '一次性补贴面积（亩）',
      dataIndex: 'subsidy_area',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'createdAt',
      hideInSearch: true,
      render: (__, record) => ( record.is_subsidy ? ( record.is_subsidy === 1 ? '已减' : '已退回' ) : '未减')
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {/* </ButtonAuth> */}
          {
            record.is_subsidy === 0 || record.is_subsidy === 2 ? (
              <ButtonAuth type="EDIT">
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedRow(record);
                    setIsModalVisible(true);
                  }}
                >
                  编辑
                </Button>
              </ButtonAuth>
            ) : null
          }
          {
            record.is_subsidy === 0 ? (
              <ButtonAuth type="DELETE">
                <Button
                  type="link"
                  style={{color: '#ff4d4f'}}
                  onClick={() => {
                    Modal.confirm({
                      content: `确认删除此条数据吗?`,
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        try {
                          await _delSubsidyDisposable(record.id);
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
            ) : null
          }
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
        tableExtraRender={() => (
          <div className={styles.headerRow}>

            <div className={styles.stats}>
              {`总户数: ${totalInfo.all_count ?? 0}户    总面积: ${totalInfo.all_subsidy_area ?? 0}亩`}
            </div>
            <ButtonAuth type="IMPORT">
              <Button onClick={() => {
                exportSubsidyDisposable().then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}已减明细.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`导出失败: ${e.message}`);
                });
              }}>导出已减明细</Button>
              <Button onClick={() => {
                const paramsRow = {
                  real_name: pageParams.real_name ?? '',
                  city_id: pageParams.area_name?.[0],
                  town_id: pageParams.area_name?.[1],
                  is_export: 1 // ---- 0默认 1导出
                };
                _subsidyDisposableList(paramsRow).then((result) => {
                  console.log(result, 'result')
                  downloadAs(result, `${new Date().toLocaleString()}一次性面积.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`导出失败: ${e.message}`);
                });
              }}>导出一次性面积</Button>
              <Button
                onClick={() => {
                  window.location.href = 'https://img.wsnf.cn/acfile/%E4%B8%80%E6%AC%A1%E6%80%A7%E9%9D%A2%E7%A7%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx';
                }}
              >
                下载模板
              </Button>
            </ButtonAuth>
            <ButtonAuth type="IMPORT">
              <ImportBtn api="import_subsidy_disposable" onSuccess={() => tableRef.current?.reload()} />
            </ButtonAuth>
          </div>

        )}
        // toolBarRender={() => [
        //   <ButtonAuth type="IMPORT">
        //     <Button
        //       onClick={() => {
        //         window.location.href = 'https://img.wsnf.cn/acfile/%E4%B8%80%E6%AC%A1%E6%80%A7%E9%9D%A2%E7%A7%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx';
        //       }}
        //     >
        //       下载模板
        //     </Button>
        //   </ButtonAuth>,
        //   <ButtonAuth type="IMPORT">
        //     <ImportBtn api="import_subsidy_disposable" onSuccess={() => tableRef.current?.reload()} />
        //   </ButtonAuth>,
        // ]}
      />
      {
        isModalVisible ? (
          <FormModel
            context={selectedRow}
            visible={isModalVisible}
            cancelCb={() => setIsModalVisible(false)}
            successCb={() => {
              setIsModalVisible(false);
              tableRef.current?.reload();
            }}
          />
        ) : null
      }

    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regionTree: info.areaList,
}))(Index);
