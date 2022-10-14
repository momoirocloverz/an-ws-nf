import React, { useRef, useState, useEffect } from "react";
import ProTable from "@ant-design/pro-table";
import ButtonAuth from "@/components/ButtonAuth";
import { Button, Cascader, DatePicker, Popconfirm, message, Modal } from "antd";
import styles from "./../index.less";
import { ConnectState } from "@/models/connect";
import { connect } from "@@/plugin-dva/exports";
import AnthInfo from "./anthInfo";
import SubmitList from "./submitList";
import {
  cityFormulaFertilizerList,
  cityFormulaFertilizerListExport, cityFormulaFertilizerListReject,
  cityFormulaFertilizerListRemit,
  cityFormulaFertilizerListRemitExport,
  cityFormulaFertilizerListRemitTotal,
  cityFormulaFertilizetListTotal
} from "@/services/formulaFertilizerManage";
import Moment from "moment";
import { formatNumber, tableDataHandle } from "@/utils/utils";
import { downloadAs } from "@/pages/agricultureSubsidies/utils";
import {
  getSubsidyFormulaFertilizerDeclareList,
  subsidyFormulaDeclareVillage,
  subsidyFormulaDeclareVillageTotal, subsidyFormulaFertilizerDeclareListTotal
} from "@/services/formulaFertilizerManageTown";

import RejectModal from "@/components/agricultureSubsidies/RejectModal";

function declareList({ areaList, ACTIVE_TABLE, SEARCH_ENUM, TABLE_ENUM, BUTTON_ENUM }) {
  const tableRef: any = useRef();
  useEffect(() => {
    // tableRef.current?.reset();
    tableRef.current?.reload();
  }, [ACTIVE_TABLE]);

  const userInfo: any = JSON.parse(localStorage.getItem("userInfo") as string);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [submitVisible, setSubmitVisible] = useState<boolean>(false);
  const [selectedRow, setSelectedRow]: any = useState({});
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [storeParams, setStoreParams]: any = useState({});
  const [rejectType, setRejectType]: any = useState("");
  const [totalData, setTotalData]: any = useState({});
  const natureEnum = {
    1: "个人",
    2: "合作社/公司"
  };
  const cropEnum = {
    "水稻": "水稻",
    "大小麦": "大小麦"
  };
  const isPublicEnum = {
    "": "全部",
    1: "是",
    0: "否"
  };
  const remitEnum = {
    1: "已递交",
    2: "成功",
    3: "失败"
  };
  const tableEnum = {
    notPublicVillage: 1,
    inThePublicVillage: 2,
    pendingReview: 3,
    notPublic: 4,
    inThePublic: 5,
    notSubmit: 6,
    submited: 7,
    remitted: 8,
    rejected: 9
  };
  const tableName = {
    notPublicVillage: "村未公示",
    inThePublicVillage: "村公示中",
    pendingReview: "镇待审核",
    notPublic: "镇未提交",
    inThePublic: "镇公示中",
    notSubmit: "市待递交",
    submited: "已递交",
    remitted: "打款记录",
    rejected: "财政退回"
  };

  // @ts-ignore
  const loadData = async (rawParams: any) => {
    // 1 未公示 2 公示中 3待递交 4已递交 5 财政退回
    const params: any = {
      // type: tableEnum[ACTIVE_TABLE],
      city_id: rawParams.town_id && rawParams.town_id.length ? rawParams.town_id?.[0] : "",
      town_id: rawParams.town_id && rawParams.town_id.length ? rawParams.town_id?.[1] : "",
      real_name: rawParams.real_name,
      subsidy_type: rawParams.subsidy_type,
      crops_name: rawParams.crops_name,
      year: rawParams.year ? Moment(rawParams.year).format("YYYY") : "",
      is_can_publicity: rawParams.is_can_publicity,
      payment_status: rawParams.payment_status,
      page: rawParams.current,
      page_size: rawParams.pageSize
    };
    let result;
    let total;
    switch (tableEnum[ACTIVE_TABLE]) {
      case 1: // 村未公示
        console.log("村未公示");
        params.type = 1;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 2: // 村公示中
        console.log("村公示中");
        params.type = 2;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 3: // 镇待审核
        console.log("镇待审核");
        params.is_examine = 1;
        result = await getSubsidyFormulaFertilizerDeclareList(params);
        total = await subsidyFormulaFertilizerDeclareListTotal(params);
        break;
      case 4: // 镇未公示
        console.log("镇未公示");
        params.type = 1;
        result = await cityFormulaFertilizerList(params);
        total = await cityFormulaFertilizetListTotal(params);
        break;
      case 5: // 镇公示中
        console.log("镇公示中");
        params.type = 2;
        result = await cityFormulaFertilizerList(params);
        total = await cityFormulaFertilizetListTotal(params);
        break;
      case 6: // 市待递交
        console.log("市待递交");
        params.type = 3;
        // params.is_examine_submit = 1; // 1市级待递交  2市级递交中  3市级已递交

        result = await cityFormulaFertilizerList(params);
        total = await cityFormulaFertilizetListTotal(params);
        break;
      case 7: // 市已递交
        console.log("市已递交");
        params.type = 4;
        result = await cityFormulaFertilizerList(params);
        total = await cityFormulaFertilizetListTotal(params);
        break;
      case 8: // 打款记录
        result = await cityFormulaFertilizerListRemit(params);
        total = await cityFormulaFertilizerListRemitTotal(params);
        break;
      case 9: // 财政退回
        params.type = 5;
        params.finance_return_type = 1;
        result = await cityFormulaFertilizerList(params);
        total = await cityFormulaFertilizetListTotal(params);
        break;
      default:
        // result = await cityFormulaFertilizerList(params);
        // total = await cityFormulaFertilizetListTotal(params);
        break;
    }
    setTotalData(total?.data || { data: {} });
    setStoreParams(params);
    // const result = tableEnum[ACTIVE_TABLE] !== 5 ? await cityFormulaFertilizerList(params) : await cityFormulaFertilizerListRemit(params);
    if (result?.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result?.data), data: transformed } });
    } else {
      console.error(result?.msg);
      const transformed = Array.isArray(result?.data?.data) ? result?.data?.data : [];
      return tableDataHandle({ ...result, data: { ...(result?.data), data: transformed } });
    }
  };
  // const getTotal = async (params) => {
  //   const { pageNum, pageSize, ...data } = params;
  //   const result = tableEnum[ACTIVE_TABLE] !== 5 ? await cityFormulaFertilizetListTotal(data) : await cityFormulaFertilizerListRemitTotal(data);
  //   setTotalData(result.data);
  // };

  const tableColumns: any = [
    {
      title: "id",
      dataIndex: "id",
      align: "center",
      width: 200,
      hideInTable: true,
      hideInSearch: true
    },
    // 查询条件
    {
      title: "地区",
      dataIndex: "town_id",
      hideInTable: true,
      renderFormItem: () => {
        let newArea: any = [];
        areaList.map((city) => {
          if (city.city_id == userInfo?.city_id) {
            newArea = city.children;
          }
        });
        return (
          <Cascader options={newArea} changeOnSelect />
        );
      }
    },
    {
      title: "补贴对象",
      dataIndex: "real_name",
      hideInTable: true
    },
    {
      title: "性质",
      dataIndex: "subsidy_type",
      hideInTable: true,
      valueEnum: { ...natureEnum, "": "全部" }
    },
    {
      title: "作物",
      dataIndex: "crops_name",
      hideInTable: true,
      valueEnum: { ...cropEnum, "": "全部" }
    },
    {
      title: "年份",
      dataIndex: "year",
      hideInTable: true,
      renderFormItem: () => <DatePicker picker="year" />
    },
    {
      title: "是否能公示",
      dataIndex: "is_can_publicity",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("can_public"),
      valueEnum: isPublicEnum
    },
    {
      title: "打款状态",
      dataIndex: "payment_status",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("remit_status"),
      valueEnum: remitEnum
    },
    // 展示列表项
    {
      title: "真实姓名",
      dataIndex: "real_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "性质",
      dataIndex: "subsidy_type",
      align: "center",
      valueEnum: natureEnum,
      width: 100,
      hideInSearch: true
    },
    {
      title: "所属地区",
      dataIndex: "area_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "核实总面积",
      dataIndex: "verify_area",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "作物",
      dataIndex: "crops_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "年份",
      dataIndex: "year",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "限额购肥量/吨",
      dataIndex: "quota_ton",
      align: "center",
      width: 100,
      hideInSearch: true,
      render: (__, record) => {
        if (record?.crops_name === "水稻") {
          return (
            <Popconfirm
              placement="topLeft"
              title={`
                其中配方0.06吨/亩标准核实面积${formatNumber(record["formula_area"], 1)}亩，限额购肥${formatNumber(((record["formula_area"] ?? 0) * 0.06), 4)}吨；\n
                配方0.035吨/亩标准核实面积${formatNumber((record["verify_area"] - (record["formula_area"] ?? 0)), 1)}亩，限额购肥量${
                formatNumber(((record["verify_area"] - (record["formula_area"] ?? 0)) * 0.035), 4)}吨；
              `}
              showCancel={false}
              okText="知道了"
            >
               <span style={{ color: "#f66", cursor: "pointer" }}>
                {record["quota_ton"]}
              </span>
            </Popconfirm>
          );
        } else {
          return (
            <Popconfirm
              placement="topLeft"
              title={`
                其中配方0.045吨/亩标准核实面积${formatNumber(record["formula_area"], 1) ?? 0}亩，限额购肥${formatNumber(((record["formula_area"] ?? 0) * 0.06), 4)}吨；\n
                配方0.035吨/亩标准核实面积${formatNumber((record["verify_area"] - (record["formula_area"] ?? 0)), 1)}亩，限额购肥量${
                formatNumber(((record["verify_area"] - (record["formula_area"] ?? 0)) * 0.035), 4)}吨；
              `}
              showCancel={false}
              okText="知道了"
            >
            <span style={{ color: "#f66", cursor: "pointer" }}>
              {record["quota_ton"]}
            </span>
            </Popconfirm>
          );
        }
      }
    },
    {
      title: "实名制购肥量/吨",
      dataIndex: "real_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "开票数量/吨",
      dataIndex: "billing_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "送货数量/吨",
      dataIndex: "delivery_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "最终可补量/吨",
      dataIndex: "fertilizer_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "补贴金额",
      dataIndex: "subsidy_amount",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "申报时间",
      dataIndex: "declare_time",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "是否能公示",
      dataIndex: "is_can_publicity",
      align: "center",
      width: 100,
      hideInSearch: true,
      valueEnum: isPublicEnum,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("can_public")
    },
    {
      title: "驳回时间",
      dataIndex: "reject_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("rejected_time")
    },
    {
      title: "驳回理由",
      dataIndex: "city_reject_reason",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("rejected_reason"),
      render: (__, record) => {
        if (record?.city_reject_reason) {
          return <span style={{ color: "red" }}>{record.city_reject_reason}</span>;
        } else {
          return <span>-</span>;
        }
      }
    },
    {
      title: "公示截止日期",
      dataIndex: "publicity_end",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("stop_public_time")
    },
    {
      title: "递交时间",
      dataIndex: "check_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("submit_time")
    },
    {
      title: "代办人",
      dataIndex: "agency_name",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("public_agent")
    },
    {
      title: "打款状态",
      dataIndex: "payment_status",
      align: "center",
      width: 100,
      hideInSearch: true,
      valueEnum: remitEnum,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("remit_status"),
      render: (__, record) => (<span
        style={{ color: record["payment_status"] === 3 ? "green" : record["payment_status"] === 2 ? "#f66" : "" }}>{remitEnum[record["payment_status"]]}</span>)
    },
    {
      title: "打款时间",
      dataIndex: "payment_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("remit_time")
    },
    {
      title: "操作",
      dataIndex: "option",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", flexFlow: "column nowrap" }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow(record);
              setDetailVisible(true);
            }}
          >
            查看信息
          </Button>
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认一键驳回当前搜索条件下导入的申报记录?"
              onConfirm={async () => {
                setSelectedRow(record);
                setIsRejectionModalOpen(true);
                setRejectType("reject_city");
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("turn_down_city") ? "block" : "none" }}
                type="link"
              >
                退回市
              </Button>
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认驳回当前数据至镇街道?"
              onConfirm={async () => {
                setSelectedRow(record);
                setIsRejectionModalOpen(true);
                setRejectType("reject_town");
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                style={{ display: ACTIVE_TABLE === "notSubmit" || ACTIVE_TABLE === "rejected" ? "block" : "none" }}
                type="link"
              >
                {ACTIVE_TABLE === "notSubmit" ? "驳回" : "驳回镇"}
              </Button>
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认一键驳回当前搜索条件下导入的申报记录?"
              onConfirm={async () => {
                setSelectedRow(record);
                setIsRejectionModalOpen(true);
                setRejectType("reject_village");
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("turn_down_city") ? "block" : "none" }}
                type="link"
              >
                驳回村
              </Button>
            </Popconfirm>
          </ButtonAuth>
        </div>
      )
    }
  ];
  // 驳回
  const rejectCity = async (params) => {
    try {
      if (totalData.count === 0) {
        Modal.warning({
          title: "提示",
          content: "暂时没有符合可以驳回的数据"
        });
        return;
      }
      const { code, data, msg } = await cityFormulaFertilizerListReject(params);
      if (code === 0) {
        message.success(msg ?? "");
        tableRef.current?.reload();
        setIsRejectionModalOpen(false);
      } else {
        console.error(data, msg);
      }
    } catch (e) {
      console.error("catch:", e);
    }
  };
  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        scroll={{ x: 1500 }}
        rowKey="id"
        options={false}
        headerTitle={
          <div className={styles.header_bar}>
            <div>户数：<p>{totalData.count || 0}</p>户</div>
            <div>最终可补量：<p>{totalData.fertilizer_ton || 0}</p>吨</div>
            <div>补贴金额：<p>{totalData.subsidy_amount ? (Math.round(totalData.subsidy_amount * 100) / 100) : 0}</p>元</div>
          </div>
        }
        toolBarRender={() => [
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认一键驳回当前搜索条件下导入的申报记录，驳回后村里可以重新跳过公示。"
              onConfirm={async () => {
                const params: any = {
                  // id: '',
                  // city_reject_reason:"",
                  status: 2,//1 未递交列表驳回 2财政退回列表驳回
                  process_type: 2 //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
                };
                await rejectCity(params);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("turn_down_village") ? "block" : "none" }}
              >
                一键驳回村
              </Button>
            </Popconfirm>
          </ButtonAuth>,
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认一键驳回当前搜索条件下的申报记录到镇，驳回后，自主申报的记录镇可以重新跳过公示或驳回给用户。"
              onConfirm={async () => {
                const params: any = {
                  // id: '',
                  // city_reject_reason:"",
                  status: 2,//1 未递交列表驳回 2财政退回列表驳回
                  process_type: 1 //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
                };
                await rejectCity(params);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("turn_down_town") ? "block" : "none" }}
              >
                一键驳回镇
              </Button>
            </Popconfirm>
          </ButtonAuth>,
          <ButtonAuth type="REJECT">
            <Popconfirm
              placement="top"
              title="确认一键驳回当前搜索条件下导入的申报记录？"
              onConfirm={async () => {
                const params: any = {
                  // id: '',
                  // city_reject_reason:"",
                  status: 2,//1 未递交列表驳回 2财政退回列表驳回
                  process_type: 3 //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
                };
                await rejectCity(params);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("turn_down_city") ? "block" : "none" }}
              >
                一键退回市
              </Button>
            </Popconfirm>
          </ButtonAuth>,
          <ButtonAuth type="SUBMIT">
            <Button
              style={{ display: ACTIVE_TABLE === "notSubmit" ? "block" : "none" }}
              type="primary"
              onClick={() => {
                setSubmitVisible(true);
              }}
            >
              批量递交
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={async () => {
                const { pageNum, pageSize, ...exportParams }: any = storeParams;
                const result = tableEnum[ACTIVE_TABLE] !== 6 ? await cityFormulaFertilizerListExport(exportParams) : await cityFormulaFertilizerListRemitExport(exportParams);
                if (result && !result.code) {
                  downloadAs(result, `${new Date().toLocaleString()}${tableName[ACTIVE_TABLE]}列表.xls`, "application/vnd.ms-excel");
                } else {
                  message.error(`导出失败: ${result.msg}`);
                }
              }}
            >
              导出
            </Button>
          </ButtonAuth>
        ]}
      />
      <AnthInfo
        visible={detailVisible}
        context={selectedRow}
        natureEnum={natureEnum}
        onCancel={() => {
          setDetailVisible(false);
        }}
      />
      <SubmitList
        visible={submitVisible}
        defaultParams={storeParams}
        areaList={areaList}
        natureEnum={natureEnum}
        cropEnum={cropEnum}
        onCancel={() => {
          setSubmitVisible(false);
        }}
        onSuccess={() => {
          setSubmitVisible(false);
          tableRef?.current?.reload();
        }}
      />

      <RejectModal
        visible={isRejectionModalOpen}
        cancelCb={() => setIsRejectionModalOpen(false)}
        successCb={async (response: any) => {
          let params: any
          if(rejectType === 'reject_village'){
            params = {
              id: selectedRow.id,
              city_reject_reason: response,
              status: 2,//1 未递交列表驳回 2财政退回列表驳回
              process_type: 2 //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
            };
          }else if(rejectType === 'reject_town'){
            params= {
              id: selectedRow.id,
              city_reject_reason: response,
              status: 2,//1 未递交列表驳回 2财政退回列表驳回
              process_type: selectedRow.process_type //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
            };
            //notSubmit 市待递交
            if (ACTIVE_TABLE === "notSubmit") {
              params.status = 1;
            } else {

            }
          }else if(rejectType === 'reject_city'){
            params = {
              id: selectedRow.id,
              city_reject_reason: response,
              status: 2,//1 未递交列表驳回 2财政退回列表驳回
              process_type: 3 //一键驳回村  传 2   一键驳回镇  1   一件退回市 3    其余不传
            };
          }
          await rejectCity(params);
        }}
      />

    </>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  areaList: info.areaList
}))(declareList);
