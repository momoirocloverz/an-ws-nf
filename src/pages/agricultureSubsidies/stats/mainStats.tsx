import React, { useRef, useState } from "react";
import { Button, Cascader, DatePicker, message } from "antd";
import ProTable from "@ant-design/pro-table";
import { getDeclaresObjectDataStatisticsList } from "@/services/agricultureSubsidies";
import { mask, tableDataHandle } from "@/utils/utils";
import { ownershipTypes } from "@/pages/agricultureSubsidies/consts";
import { connect } from "@@/plugin-dva/exports";
import { ConnectState } from "@/models/connect";
import { downloadAs } from "@/pages/agricultureSubsidies/utils";
import moment from "moment";

function MainStats({ regionTree }) {
  const [rawParams,setRawParams]:any = useState({})
  const tableRef = useRef();
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'subsidy_id',
      hideInSearch: true,
    },
    {
      title: '所属地区',
      key: 'region',
      dataIndex: 'name',
      hideInTable:true,
      initialValue: [user.city_id, user.town_id, user.village_id].filter((e) => e),
      renderFormItem: () => <Cascader options={regionTree} changeOnSelect allowClear={false}/>,
    },
    {
      title: '年份',
      dataIndex: 'year',
      renderFormItem: () => <DatePicker picker="year" />
    },
    {
      title: '主体性质',
      dataIndex: 'subsidy_type',
      valueEnum: ownershipTypes,
      filters: undefined,
    },
    {
      title: '主体名称',
      dataIndex: 'real_name',
      render: (__, record) => (record.real_name || '--'),
    },
    {
      title: '姓名/法人',
      dataIndex: 'legal_name',
      hideInSearch: true,
    },
    {
      title: "所属地区",
      dataIndex: "area_name",
      hideInSearch: true,
    },
    {
      title: '身份证',
      dataIndex: 'identity',
      align: 'center',
      hideInSearch: true,
      render: (text) => (mask(text, { headLength: 4, fixedLength: 18 })),
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
    },
    {
      title: '春季流转面积（亩）',
      dataIndex: 'c_circulation_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.c_circulation_area ?? 0) * 100) / 100 ?? 0;
      }
    },
    {
      title: '秋季流转面积（亩）',
      dataIndex: 'q_circulation_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.q_circulation_area ?? 0) * 100) / 100 ?? 0;
      }
    },
    {
      title: '大小麦补贴面积（亩）',
      dataIndex: 'dzm_plot_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.dzm_plot_area ?? 0) * 100) / 100 ?? 0;
      }
    },
    {
      title: '水稻补贴面积（亩）',
      dataIndex: 'sd_plot_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.sd_plot_area ?? 0) * 100)/100 ?? 0
      }
    },
    {
      title: '旱粮补贴面积（亩）',
      dataIndex: 'hl_plot_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.hl_plot_area ?? 0) * 100)/100 ?? 0
      }
    },
    {
      title: '油菜补贴面积（亩）',
      dataIndex: 'yc_plot_area',
      hideInSearch: true,
      render: (__, record) => {
        return Math.round(Number(record.yc_plot_area ?? 0) * 100)/100 ?? 0
      }
    },
    {
      title: '合计补贴面积（亩）',
      dataIndex: 'mobile',
      hideInSearch: true,
      render: (__, record) => {
        let num: number;
        num = Number(record.yc_plot_area ?? 0) + Number(record.hl_plot_area ?? 0) + Number(record.sd_plot_area ?? 0) + Number(record.dzm_plot_area ?? 0)
        return Math.round(num*100)/100 ?? 0
      }
    },
  ];

  // FIXME: memory leak
  const loadData:any = async (params) => {
    try {
      const result = await getDeclaresObjectDataStatisticsList({
        region: params.region ?? [user.city_id, user.town_id, user.village_id].filter((e) => e),
        year: params.year ? moment(params.year).format("YYYY") :'',
        mobile: params.mobile,
        real_name: params.real_name,
        ownershipType: params.subsidy_type,
        pageNum: params.current,
        pageSize: params.pageSize,
        is_export: 0 // 1导出 默认0
      });
      setRawParams(params)
      console.log('result---')
      console.log(result.data)
      const transformed = Array.isArray(result.data.data) ? result.data.data: [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } catch (e) {
      message.error(`数据读取失败: ${e.message}`);
      return tableDataHandle({
        code: -1,
        data: [],
        pagination: {
          page: 1,
          item_total: 0,
          page_count: 1,
          page_total: 1,
        },
      });
    }
  };

  return (
      <>
        <ProTable
          actionRef={tableRef}
          request={loadData}
          columns={columns}
          rowKey="id"
          options={false}
          toolBarRender={() => [
             <Button
               type="primary"
               onClick={async ()=>{
                 const result = await getDeclaresObjectDataStatisticsList({
                   region: rawParams.region ?? [user.city_id, user.town_id, user.village_id].filter((e) => e),

                   year: rawParams.year ? moment(rawParams.year).format("YYYY") :'',
                   mobile: rawParams.mobile,
                   real_name: rawParams.real_name,
                   ownershipType: rawParams.subsidy_type,
                   pageNum: rawParams.current,
                   pageSize: rawParams.pageSize,
                   is_export: 1 // 1导出 默认0
                 });
                 downloadAs(
                   result,
                   `${new Date().toLocaleString()}_申报数据统计_按主体统计_导出记录.xls`,
                   "application/vnd.ms-excel"
                 );
               }}
             >
               导出
             </Button>
          ]}
        />
      </>
  );
}
export default connect(({ user, info }: ConnectState) => ({
  regionTree: info.areaList,
}))(MainStats);
