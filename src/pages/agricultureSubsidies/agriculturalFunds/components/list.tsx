import { connect } from 'umi';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import { Cascader, DatePicker, message, Button, Popconfirm,  Upload, Modal } from 'antd';
import { ConnectState } from '@/models/connect';
// import { getLandList } from '@/services/machineManagement';
import { getApiParams, getLocalToken, tableDataHandle } from '@/utils/utils';
import styles from '@/pages/partyCenter/index.less';

import CreateForm from './createForm';
import {
  createSubsidyMachineDeclare,
  delSubsidyMachineCapital, getSubsidyMachineCate,
  subsidyMachineCapitalList, subsidyMachineCapitalStatistics
} from "@/services/agricultureSubsidies";
import { PUBLIC_KEY } from '@/services/api';
import lodash from "lodash";
import { downloadAs } from "@/pages/agricultureSubsidies/utils";
import Moment from "moment";

const subsidyTypeList = {
  1: '个人',
  2: '企业/合作社',
};

function list({ user, regions, authorizations, areaList }:any) {
  const tableRef:any = useRef();
  // 导入文件
  const token = getLocalToken();
  const addApiName = {
    api_name: 'import_subsidy_machine_capital',
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [defaultRegion, setDefaultRegion] = useState(undefined);
  const [detail, setDetail]:any = useState({});
  const [storeParams, setStoreParams] = useState({});
  const [total, setTotal] = useState(0);
  const [toolEnum, setToolEnum] = useState({  });

  const areaLists =
    user.role_type === 4 && areaList.length > 0 ? areaList[0].children : areaList;
  areaLists.map((item) => {
    item.children &&
    item.children.map((val) => {
      if (val.children && val.children.length > 0) {
        delete val.children;
      }
    });
  });

  useEffect(() => {
    if (user && user.city_id) {
      const emptyArr:any = [];
      user?.city_id > 0 && emptyArr.push(user?.city_id);
      user?.town_id > 0 && emptyArr.push(user?.town_id);
      user?.village_id > 0 && emptyArr.push(user?.village_id);
      // @ts-ignore
      setDefaultRegion(emptyArr);
    }
    // 获取类别
    // eslint-disable-next-line no-unused-expressions
    !toolEnum['1'] && getSubsidyMachineCate().then((e) => {
      if (e.code === 0) {
        const temp: any = {};
        e.data.map(item => {
          temp[item.id] = item.machine_name
        });
        setToolEnum(temp);
      }
    });
  }, [user, regions, authorizations]);

  const tableColumns:any = [
    {
      title: '地区',
      dataIndex: 'area_name',
      hideInTable: true,
      initialValue: defaultRegion,
      renderFormItem: (item, props) => {
        return <Cascader options={areaLists} changeOnSelect />;
      },
    },
    {
      title: '补贴对象',
      dataIndex: 'real_name',
      align: 'center',
    },
    {
      title: '身份证',
      dataIndex: 'identity',
      align: 'center',
    },
    {
      title: '信用代码',
      dataIndex: 'credit_num',
      align: 'center',
    },
    {
      title: '性质',
      dataIndex: 'subsidy_type',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => subsidyTypeList[record.subsidy_type],
    },

    {
      title: '年份',
      dataIndex: 'year',
      align: 'center',
      width: 100,
      renderFormItem: () => <DatePicker picker="year" />,
    },
    {
      title: '地区',
      dataIndex: 'area_name',
      hideInSearch: true,
    },
    {
      title: '机具类型',
      dataIndex: 'terminal_type',
      align: 'center',
      valueEnum: toolEnum,
    },
    {
      title: '数量',
      dataIndex: 'terminal_count',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '终端编号',
      dataIndex: 'terminal_number',
      align: 'center',
      hideInSearch: true,
    },
    // {
    //   title: '省市追加补贴',
    //   dataIndex: 'region_addto_subsidy',
    //   align: 'center',
    //   hideInSearch: true,
    // },
    {
      title: '中央补贴',
      dataIndex: 'center_subsidy',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '省级配套',
      dataIndex: 'province_matching',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '市级配套',
      dataIndex: 'market_matching',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '购置总价',
      dataIndex: 'purchase_price',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '购置单价',
      dataIndex: 'purchase_price_unit',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '机具品目',
      dataIndex: 'implement_item',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '机具型号',
      dataIndex: 'implement_model',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '生产企业',
      dataIndex: 'production_enterprise',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '现居住地址',
      dataIndex: 'liberty_address',
      align: 'center',
      hideInSearch: true,
    },

    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Popconfirm
            placement="top"
            title="确认删除当前用户数据?"
            onConfirm={async () => {
              const { code, msg } = await delSubsidyMachineCapital({ id: record.id });
              if (code === 0) {
                message.success('删除成功!');
                tableRef?.current?.reload();
              }else{
                console.log(msg)
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          {
            record.zy_declare_id == 0 && (
              <Button type="link" onClick={async () => {
                const { code,msg } = await createSubsidyMachineDeclare({id:record.id});
                if (code === 0) {
                  message.success('生成成功!');
                  tableRef?.current?.reload();
                }else{
                  message.error(msg);
                }
              }}>
                生成中央补贴
              </Button>
            )
          }

        </div>
      ),
    },
  ];
  const loadData = async (rawParams) => {
    const params:any = {
      credit_num: rawParams.credit_num,
      real_name: rawParams.real_name,
      terminal_type: rawParams.terminal_type,
      year: rawParams.year && Moment(rawParams.year).format('YYYY'),
      code: rawParams.identity,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
      is_export: 0, // 是否导入 1导入
    };
    if (rawParams.area_name && rawParams.area_name.length > 0) {
      params.city_id = rawParams.area_name[0];
      params.town_id = rawParams.area_name[1];
    }
    try {
      setStoreParams(params);
      const result:any = await subsidyMachineCapitalList(params);
      // 获取资金列表统计信息
      const data = await subsidyMachineCapitalStatistics(params);
      setDetail(data.data);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        throw new Error('');
      }
      const transformed =
        Array.isArray(result.data.data) && result.data.data.length > 0
          ? result.data.data
          : [];
      setTotal(transformed.length ?? 0);
      return tableDataHandle({ ...result, data: { ...result.data, data: transformed } });
    } catch (e) {
      message.error(`读取列表失败: ${e.message}`);
      return {
        data: [],
        page: 1,
        total: 0,
        success: true,
      };
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/farmapi/gateway',
    headers: {
      authorization: token,
    },
    showUploadList: false,
    data,
    onChange(info: any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          if (info.file.response.data.length) {
            Modal.error({
              content: `${info.file.response.data.join('')}`,
            });
          } else {
            message.success(`${info.file.name} 文件导入成功`);
            tableRef.current.reload();
          }
        } else {
          message.error(info.file.response.msg);
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件导入失败`);
        setLoading(false);
      }
    },
  };


  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        search={{ labelWidth: 120 }}
        rowKey="id"
        options={false}
        tableExtraRender={() => (
          <div className={styles.headerRow}>
            <div className={styles.stats}>
              <span>用户数: {detail?.count || 0}户 </span>
              <span>省市追加补贴: {detail?.region_addto_subsidy || 0} 元</span>
              <span>中央补贴: {detail?.center_subsidy || 0} 元</span>
              <span>购置总价: {detail?.purchase_price || 0}元</span>
            </div>

            <Button
              type="primary"
              onClick={() => {
                console.log('下载模板');
                // https://img.wsnf.cn/acfile/%E4%B8%AD%E5%A4%AE%E7%9C%81%E5%B8%82%E8%B5%84%E9%87%91%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx
                window.location.href = 'https://img.wsnf.cn/acfile/%E4%B8%AD%E5%A4%AE%E7%9C%81%E5%B8%82%E8%B5%84%E9%87%91%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
              }}
            >
              模板
            </Button>
            {/* @ts-ignore */}
            <Upload {...uploadProps} disabled={loading}>
              <Button type="primary" disabled={loading} loading={loading}>
                {loading ? '正在导入...' : '导入'}
              </Button>
            </Upload>
            <Button
              type="primary"
              disabled={total === 0} // 未查询到数据禁止点击导出
              onClick={async () => {
                const params:any = lodash.cloneDeep(storeParams);
                params.is_export = 1;
                console.log('导出', params);
                const result = await subsidyMachineCapitalList(params);
                downloadAs(
                  result,
                  `${new Date().toLocaleString()}中央/省市资金管理.xls`,
                  'application/vnd.ms-excel',
                );
                // `${new Date().toLocaleString()}实名制购肥管理.xls`, 'application/vnd.ms-excel'
              }}
            >
              导出
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({});
                setVisible(true);
              }}
            >
              新建
            </Button>
          </div>
        )}
      />
      <CreateForm
        visible={visible}
        context={selectedRow}
        areaLists={areaLists}
        onCancel={() => {
          setVisible(false);
        }}
        onSuccess={() => {
          tableRef?.current?.reload();
          setVisible(false);
        }}
      />
    </>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  areaList: info.areaList,
}))(list);
