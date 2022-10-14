// import { connect } from "umi";
import ProTable from "@ant-design/pro-table";
import React, { useEffect, useRef, useState } from "react";
import { Cascader, DatePicker, message, Button, Popconfirm } from "antd";
// import { ConnectState } from "@/models/connect";

import Moment from "moment";
// import { getLandList } from "@/services/machineManagement";
import { tableDataHandle } from "@/utils/utils";
import styles from "@/pages/partyCenter/index.less";
import { downloadAs, downloadDocumentsAsZipFile } from "@/pages/agricultureSubsidies/utils";
import DocumentPreviewModal from "@/components/agricultureSubsidies/DocumentPreviewModal";
import BatchSubmission from "./batchSubmission";
import Detail from "./detail";

const natureEnum = {
  0: "全部",
  1: "个人",
  2: "合作社/公司"
};

const recordStatuses = Object.freeze({
  1: "未公示",
  2: "公示中",
  3: "已完成"
});
import useCategories from "@/components/agricultureSubsidies/useCategories";
import {
  citySubsidyMachineDeclare,
  citySubsidyMachineDeclareDelete, citySubsidyMachineDeclareMakeWord,
  citySubsidyMachineDeclarePayment,
  citySubsidyMachineDeclarePaymentStatistics,
  citySubsidyMachineDeclareReject,
  citySubsidyMachineDeclareReturn,
  citySubsidyMachineDeclareReturnTown,
  citySubsidyMachineDeclareStatistics,
  getTerminalNumberInfo,
  subsidyMachineDeclareCancelPublicity,
  subsidyMachineDeclarePublicity,
  townSubsidyMachineDeclare,
  townSubsidyMachineDeclareAdopt,
  townSubsidyMachineDeclareReject,
  townSubsidyMachineDeclareRejectOperation,
  townSubsidyMachineDeclareStatistics
} from "@/services/agriculturalMachinery";
import lodash from "lodash";
import { paymentStatus } from "@/pages/agricultureSubsidies/agriculturalMachinery/consts";
import { getSubsidyMachineCate } from "@/services/agricultureSubsidies";
import moment from "moment";
// import { getGruppenfuhrers } from "@/services/myHometown";

// 处理地区选择的时候 各个镇的状态
const formatRegions = (regions) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
  regions.map(item => {
    item.disabled = (userInfo?.role_id == 21 && userInfo?.city_id != item.value);
    item.children && item.children.map(val => {
      val.disabled = (userInfo?.role_id == 21 && userInfo?.town_id != val.value);
      val.children && delete val.children;
    });
  });
  return regions;
};
// 过滤补贴项目数据 只留农机相关
const filterCategories = () => {
  const data = useCategories();
  const filterValue = [19, 20];
  let filterData: any = [];
  data.map((item: any) => {
    return filterValue.includes(item.value) ? filterData.push(item) : null;
  });
  return filterData;
};

function list({ selectedKey, regions }: any) {
  const tableRef: any = useRef();
  const [selectedRow, setSelectedRow] = useState({});
  const [storeParams, setStoreParams] = useState({});
  const catTree = filterCategories();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // 查看凭证
  const [isDetailsModalOpen, setIsDetailedModalOpen] = useState(false); // 查看个体信息
  const [defaultRegion, setDefaultRegion]: any = useState(undefined);
  const [detail, setDetail]: any = useState({});
  const [subTable, setSubTable] = useState([]);
  const [subId, setSubId] = useState(-1);
  const [total, setTotal] = useState(0);
  const [user, setUser]: any = useState(0);
  const newRegions = formatRegions(regions);
  const [toolEnum, setToolEnum] = useState({});
  useEffect(() => {
    tableRef?.current?.reload();
    // tableRef.current?.setFieldsValue({
    //   scale_id: [19, 21],
    // });
  }, [selectedKey]);
  useEffect(() => {
    const userInfo: any = JSON.parse(localStorage.getItem("userInfo") as string);
    const emptyArr: any = [];
    userInfo?.city_id > 0 && emptyArr.push(userInfo?.city_id);
    userInfo?.town_id > 0 && emptyArr.push(userInfo.town_id);
    userInfo?.village_id > 0 && emptyArr.push(userInfo.village_id);
    // @ts-ignore
    setDefaultRegion(emptyArr);
    setUser(userInfo);
    // 获取类别
    // eslint-disable-next-line no-unused-expressions
    !toolEnum["1"] && getSubsidyMachineCate().then((e) => {
      if (e.code === 0) {
        const temp: any = {};
        e.data.map(item => {
          temp[item.id] = item.machine_name;
        });
        setToolEnum(temp);
      }
    });
  }, []);
  const tableColumns: any = [
    {
      title: "补贴对象",
      dataIndex: "real_name",
      align: "center"
    },

    {
      title: "性质",
      dataIndex: "subsidy_type",
      align: "center",
      hideInSearch: true,
      valueEnum: natureEnum
    },
    {
      title: "所属地区",
      dataIndex: "region",
      align: "center",
      initialValue: defaultRegion,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Cascader options={newRegions} changeOnSelect />
        );
      }
    },
    {
      title: "所属地区",
      dataIndex: "area_name",
      align: "center",
      hideInSearch: true
    },
    {
      title: "机具类型",
      dataIndex: "terminal_type",
      align: "center",
      valueEnum: toolEnum
    },
    {
      title: "申请年份",
      dataIndex: "year",
      align: "center",
      width: 100,
      renderFormItem: () => <DatePicker picker="year" />
    },
    {
      title: "性质",
      dataIndex: "subsidy_type",
      align: "center",
      valueEnum: natureEnum,
      width: 100,
      hideInTable: true
    },
    // {
    //   title: "身份证/信用代码",
    //   dataIndex: "code",
    //   align: "center",
    //   hideInTable: true
    // },
    {
      title: "数量",
      dataIndex: "terminal_count",
      align: "center",
      hideInSearch: true
    },
    {
      title: "终端编号",
      dataIndex: "terminal_number",
      align: "center",
      hideInSearch: true,
      render: (__, record) => {
        return (
          // 此处自定义表格
          <div>
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => (record.scale_id != 22 && getSubData(record))} // 中央补贴记录： 终端编号不用点击弹出详情
              onMouseLeave={() => {
                setSubTable([]);
                setSubId(-1);
              }}>
              {
                subId === record.id && (
                  <div className={styles.subTable}>
                    <div>
                      <span>终端编号</span>
                      <span>购机时间</span>
                      <span>作业时间</span>
                      <span>作业面积</span>
                    </div>
                    {
                      subTable && subTable.map((val: any) => {
                        return (
                          <div key={val.id}>
                            <span>{val?.terminal_number}</span>
                            <span>{val?.buy_at && Moment(val?.buy_at).format("YYYY-MM-DD")}</span>
                            <span>
                              {val?.job_start_time && Moment(val?.job_start_time).format("YYYY-MM-DD")}
                              至
                              {val?.job_end_time && Moment(val?.job_end_time).format("YYYY-MM-DD")}
                            </span>
                            <span>{val?.job_area}亩</span>
                          </div>
                        );
                      })
                    }
                  </div>
                )
              }
              <Button type="link">{record.terminal_number || "-"}</Button>
            </div>
          </div>

        );
      }
    },
    {
      title: "填写面积",
      dataIndex: "subsidy_area",
      align: "center",
      hideInSearch: true
    },
    {
      title: "北斗面积",
      dataIndex: "voucher_area",
      align: "center",
      hideInSearch: true,
      render: (__, record) => {
        return (<span>{
          record.voucher_area == 0 ? "-" : record.voucher_area
        }</span>);
      }
    },
    {
      title: "补贴面积",
      dataIndex: "subsidy_area",
      align: "center",
      hideInSearch: true
    },
    {
      title: "中央补贴",
      dataIndex: "center_subsidy",
      align: "center",
      hideInSearch: true
    },
    {
      title: "省级配套",
      dataIndex: "province_matching",
      align: "center",
      hideInSearch: true,
      hideInTable: !["2", "5"].includes(selectedKey)
    },
    {
      title: "市级配套",
      dataIndex: "market_matching",
      align: "center",
      hideInSearch: true,
      hideInTable: !["2", "5"].includes(selectedKey)
    },
    {
      title: "市级累加补贴",
      dataIndex: "addto_subsidy",
      align: "center",
      hideInSearch: true,
      render: (__, record) => {
        return (<span>{
          record.addto_subsidy == 0 ? "-" : record.addto_subsidy
        }</span>);
      }
    },
    {
      title: "省市追加补贴",
      dataIndex: "region_addto_subsidy",
      align: "center",
      hideInSearch: true
    },
    {
      title: "购置总价",
      dataIndex: "purchase_price",
      align: "center",
      hideInSearch: true
    },
    {
      title: "补贴项目",
      key: "scale_id",
      hideInTable: true,
      renderFormItem: () => <Cascader options={catTree} />
    },
    {
      title: "申报时间",
      dataIndex: "created_at",
      align: "center",
      hideInSearch: true
    },
    {
      title: "驳回时间",
      dataIndex: "reject_time",
      align: "center",
      hideInSearch: true,
      hideInTable: !["1"].includes(selectedKey) // 2 镇已审核
    },
    {
      title: "驳回理由",
      dataIndex: "city_reject_reason",
      align: "center",
      hideInSearch: true,
      hideInTable: !["1"].includes(selectedKey)
    },
    {
      title: "补贴项目",
      dataIndex: "scale_name",
      hideInSearch: true
    },
    {
      title: "状态",
      dataIndex: "type", // 1 未公示 2公示中 3 公示完成
      align: "center",
      hideInTable: !["2"].includes(selectedKey),
      hideInSearch: !["2"].includes(selectedKey),
      valueEnum: { ...recordStatuses, 0: "全部" }
    },
    {
      title: "操作时间",
      dataIndex: "created_at",
      align: "center",
      hideInTable: !["3"].includes(selectedKey),
      hideInSearch: true
    },
    {
      title: "打款状态",
      dataIndex: "payment_status",
      align: "center",
      valueEnum: paymentStatus,
      hideInSearch: !["8"].includes(selectedKey),
      hideInTable: !["8"].includes(selectedKey)
    },
    {
      title: "最终补贴金额",
      dataIndex: "subsidy_amount",
      align: "center",
      hideInTable: !["4", "5", "6", "7", "8", "9"].includes(selectedKey),
      hideInSearch: true
    },
    {
      title: "递交时间",
      dataIndex: "check_time",
      align: "center",
      hideInTable: !["7"].includes(selectedKey),
      hideInSearch: true
    },
    {
      title: "退回时间",
      dataIndex: "finance_return_time",
      align: "center",
      hideInTable: !["9"].includes(selectedKey),
      hideInSearch: true
    },
    {
      title: "待办人",
      dataIndex: "agency_name",
      align: "center",
      hideInTable: !["7", "9"].includes(selectedKey),
      hideInSearch: true
    },
    {
      title: "凭证",
      hideInSearch: true,
      render: (__, record) =>
        !record.children && (
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
            <Button
              type="link"
              size="small"
              onClick={() => downloadDocumentsAsZipFile(record)}
              disabled={!(record.documents?.length > 0)}
            >
              下载
            </Button>
          </>
        )
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
              setIsDetailedModalOpen(true);
            }}
          >
            查看信息
          </Button>
          {
            selectedKey === "1" && (
              <>
                <Popconfirm
                  placement="top"
                  title="确认驳回该条户数据?"
                  onConfirm={async () => {
                    let result;
                    switch (selectedKey) {
                      case "1": // 镇未审核
                        result = await townSubsidyMachineDeclareRejectOperation({
                          id: record.id
                        });
                        break;
                      case "2": // 镇已审核

                        break;
                      case "3": // 镇驳回记录
                        break;
                      default:
                        break;
                    }
                    if (result.code === 0) {
                      message.success("驳回成功");
                      tableRef.current.reload();
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">驳回</Button>
                </Popconfirm>
                <Popconfirm
                  placement="top"
                  title="确认审核通过该条数据?"
                  onConfirm={async () => {
                    let result;
                    switch (selectedKey) {
                      case "1": // 镇未审核
                        result = await townSubsidyMachineDeclareAdopt({
                          id: record.id
                        });
                        break;
                      case "2": // 镇已审核

                        break;
                      case "3": // 镇驳回记录
                        break;
                      default:
                        break;
                    }
                    if (result.code === 0) {
                      message.success("通过成功");
                      tableRef.current.reload();
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">通过</Button>
                </Popconfirm>
              </>
            )
          }
          {
            selectedKey === "4" && ( // 市未公示
              <>
                <Popconfirm
                  placement="top"
                  title="确认驳回该条户数据?"
                  onConfirm={async () => {
                    let params: any = lodash.cloneDeep(storeParams);
                    params.id = record.id;
                    let result;
                    /**
                     * 市级驳回 中央的要走删除 追加的要驳回
                     * city_subsidy_machine_declare_reject    农机申报管理--市级--申报驳回
                     * city_subsidy_machine_declare_delete   农机申报管理--市级--申报删除
                     * **/
                    if (record.scale_id == 22) { // "中央补贴插秧机" 删除
                      result = await citySubsidyMachineDeclareDelete(params);
                    } else { // 追加 驳回
                      result = await citySubsidyMachineDeclareReject(params);
                    }
                    if (result.code === 0) {
                      message.success("驳回成功");
                      tableRef.current.reload();
                    } else {
                      message.error(result.msg);
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">驳回</Button>
                </Popconfirm>
                <Popconfirm
                  placement="top"
                  title="确认公示该条户数据?"
                  onConfirm={async () => {
                    const params: any = lodash.cloneDeep(storeParams);
                    params.id = record.id; // 不为0 单独公示 0一键公示
                    const { code } = await subsidyMachineDeclarePublicity(params);
                    if (code === 0) {
                      message.success("公示成功");
                      tableRef?.current?.reload();
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">公示</Button>
                </Popconfirm>
              </>
            )
          }
          {
            selectedKey === "5" && ( // 市公示中
              <>
                <Popconfirm
                  placement="top"
                  title="确认取消公示?"
                  onConfirm={async () => {
                    // 取消公示
                    let params: any = lodash.cloneDeep(storeParams);
                    params.id = record.id;
                    let result = await subsidyMachineDeclareCancelPublicity(params);
                    if (result.code === 0) {
                      message.success("驳回成功");
                      tableRef.current.reload();
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">取消公示</Button>
                </Popconfirm>
              </>
            )
          }
          {
            (selectedKey === "6" || selectedKey === "9") && ( // 6市已公示 9财政退回
              <Popconfirm
                placement="top"
                title={`确认${record.scale_id == 22 ? "删除" : "驳回"}该条户数据?`}
                onConfirm={async () => {
                  let result;
                  if (record.scale_id == 22) {
                    result = await citySubsidyMachineDeclareDelete({ id: record.id });
                  } else {
                    result = await subsidyMachineDeclareCancelPublicity({ id: record.id });
                  }
                  if (result.code === 0) {
                    message.success((record.scale_id == 22 ? "删除" : "驳回") + "成功");
                    tableRef.current.reload();
                  }
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">{record.scale_id == 22 ? "删除" : "驳回"}</Button>
              </Popconfirm>
            )
          }
          {
            selectedKey === "9" ? (
              <>
                <Button
                  type="link"
                  onClick={async () => {
                    const params: any = lodash.cloneDeep(storeParams);
                    params.id = record.id; // 不为0 单独驳回 0一键公示
                    const { code, msg } = await citySubsidyMachineDeclareReturn(params);
                    if (code === 0) {
                      message.success("退回市里成功");
                      tableRef.current.reload();
                    } else {
                      message.success(msg);
                    }
                  }}>
                  退回市里
                </Button>
                {/*中央补贴：没有“驳回到镇”按钮*/}
                {
                  record.scale_id != 22 ? (<Button
                    type="link"
                    onClick={async () => {
                      const params: any = lodash.cloneDeep(storeParams);
                      params.id = record.id; // 不为0 单独驳回 0一键公示
                      const { code, msg } = await citySubsidyMachineDeclareReturnTown(params);
                      if (code === 0) {
                        message.success("驳回到镇成功");
                        tableRef.current?.reload();
                      } else {
                        message.success(msg);
                      }
                    }}>
                    驳回到镇
                  </Button>) : null
                }
              </>
            ) : null
          }
          {/**追加补贴插秧机类目“市未公示、市公示中、市已公示”三个列表的数据，
           市级、超管权限可以在单条申报记录后面进行生成申报word文本，  role_id 1 平台管理员 平台管理员 2市级管理员 市级、局里 20 市级农机管理员
           中央补贴不需要。**/}
          {
            ["4", "5", "6"].includes(selectedKey) && (["1", "2", "20"].includes(user?.role_id + "")) && (record.scale_id != 22) ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (record.file_id == 0) {
                    citySubsidyMachineDeclareMakeWordFn(record);
                  } else {
                    window.location.href = record.file_id;
                  }
                }}
              >
                生成报表
              </div>
            ) : null
          }
        </div>
      )
    }
  ];
  // 生成报表
  const citySubsidyMachineDeclareMakeWordFn = async (record) => {
    citySubsidyMachineDeclareMakeWord({ id: record.id }).then((result) => {
      if (result?.indexOf && result?.indexOf("无有效申报记录") > -1) {
        message.error(result);
        return;
      }
      window.location.href = result.data;
      // downloadAs(result, `${new Date().toLocaleString()}报表记录.docx`, "application/vnd.ms-excel");
    }).catch((e) => {
      message.error(`导出失败: ${e.message}`);
    });
  };
  const getSubData = (item) => {


    setSubId(item.id);
    getTerminalNumberInfo({
      id: item.id
    }).then((result) => {
      if (result.code === 0) {
        result.data && setSubTable(result.data);
      }
    });

  };
  const loadData = async (rawParams) => {
    const params: any = {
      code: rawParams.code, // 补贴对象
      real_name: rawParams.real_name, // 补贴对象
      subsidy_type: rawParams.subsidy_type, // 性质
      terminal_type: rawParams.terminal_type, // 机具类型
      year: rawParams.year ? moment(rawParams.year).year() : "",
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
      city_id: (rawParams?.region && rawParams?.region[0]) || (defaultRegion && defaultRegion[0]) || "",
      town_id: (rawParams?.region && rawParams?.region[1]) || (defaultRegion && defaultRegion[1]) || ""
    };
    if (rawParams.scale_id && rawParams.scale_id.length > 0) {
      params.scale_id = rawParams.scale_id[1];
      params.scale_parent_id = rawParams.scale_id[0];
    }
    params.is_export = 0; // 0 代表不是导出
    try {
      let result;
      let detail;
      switch (selectedKey) {
        case "1": // 镇未审核
          params.is_examine = 1;
          result = await townSubsidyMachineDeclare(params);
          detail = await townSubsidyMachineDeclareStatistics(params);
          break;
        case "2": // 镇已审核
          params.is_examine = 2;
          result = await townSubsidyMachineDeclare(params);
          detail = await townSubsidyMachineDeclareStatistics(params);
          break;
        case "3": // 镇驳回记录
          result = await townSubsidyMachineDeclareReject(params);
          break;
        case "4": // 市未公示
          params.type = 1; // 1 未公示 2公示中 3 公示完成
          params.finance_return_type = 0; // 财政退回传1 其他传0
          result = await citySubsidyMachineDeclare(params);
          detail = await citySubsidyMachineDeclareStatistics(params);
          break;
        case "5": // 市公示中
          params.type = 2; // 1 未公示 2公示中 3 公示完成
          params.finance_return_type = 0; // 财政退回传1 其他传0
          result = await citySubsidyMachineDeclare(params);
          detail = await citySubsidyMachineDeclareStatistics(params);
          break;
        case "6": // 市已公示
          params.type = 3; // 1 未公示 2公示中 3 公示完成
          params.finance_return_type = 0; // 财政退回传1 其他传0
          result = await citySubsidyMachineDeclare(params);
          detail = await citySubsidyMachineDeclareStatistics(params);
          break;
        case "7": // 市已递交
          params.type = 3; // 1 未公示 2公示中 3 公示完成
          params.finance_return_type = 0; // 财政退回传1 其他传0
          params.is_examine_submit = 3; // 1市级待递交 2市级递交中 3市级已递交
          result = await citySubsidyMachineDeclare(params);
          detail = await citySubsidyMachineDeclareStatistics(params);
          break;
        case "8": // 打款记录
          params.is_export = 0; // 是否导出
          result = await citySubsidyMachineDeclarePayment(params);
          detail = await citySubsidyMachineDeclarePaymentStatistics(params);
          break;
        case "9": // 财政退回
          params.type = 3; // 1 未公示 2公示中 3 公示完成
          params.finance_return_type = 1; // 财政退回传1 其他传0
          result = await citySubsidyMachineDeclare(params);
          detail = await citySubsidyMachineDeclareStatistics(params);
          break;
        default:
          break;
      }
      setStoreParams(params);
      console.log("统计详情1111", detail?.data);
      detail?.data && setDetail(detail?.data); // 统计详情
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        throw new Error("");
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
        success: true
      };
    }
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
            {
              selectedKey !== "3" && ( // 镇驳回不显示
                <div className={styles.stats}>
                  <span>用户数: {detail?.count || 0}户 </span>
                  {
                    selectedKey <= 3 ? <span>补贴面积: {detail?.subsidy_area || 0} 亩</span> : null
                  }
                  {
                    selectedKey <= 3 ? <span>市级累加补贴: {detail?.addto_subsidy || 0} 元</span> : null
                  }
                  {
                    selectedKey >= 4 ? <span>最终补贴金额: {detail?.subsidy_amount || 0}元</span> : null
                  }
                </div>
              )
            }
            {
              selectedKey === "4" && (
                <Button
                  type="primary"
                  onClick={async () => {
                    const params: any = lodash.cloneDeep(storeParams);
                    params.id = 0; // 不为0 单独公示 0一键公示
                    const { code } = await subsidyMachineDeclarePublicity(params);
                    if (code === 0) {
                      message.success("公示成功");
                      tableRef?.current?.reload();
                    }
                  }}
                >
                  一键公示
                </Button>
              )
            }
            {
              selectedKey === "9" && (
                <>
                  <Popconfirm
                    title="一键退回后，你可以在市已公示列表继续递交财政"
                    onConfirm={async () => {
                      const params: any = lodash.cloneDeep(storeParams);
                      params.id = 0; // 不为0 单独驳回 0一键公示
                      const { code, msg } = await citySubsidyMachineDeclareReturn(params);
                      if (code === 0) {
                        message.success("一键退回已公示");
                        tableRef?.current?.reload();
                      } else {
                        message.error(msg);
                      }
                    }}
                    onVisibleChange={() => console.log("visible change")}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="primary"> 一键退回已公示 </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="一键驳回后，镇可以在镇未审核列表重新审核"
                    onConfirm={async () => {
                      const params: any = lodash.cloneDeep(storeParams);
                      params.id = 0; // 不为0 单独驳回 0一键公示
                      const { code, msg } = await citySubsidyMachineDeclareReturnTown(params);
                      if (code === 0) {
                        message.success("一键驳回镇成功");
                        tableRef?.current?.reload();
                      } else {
                        message.error(msg);
                      }
                    }}
                    onVisibleChange={() => console.log("visible change")}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="primary">
                      一键驳回镇
                    </Button>
                  </Popconfirm>
                </>
              )
            }
            <Button
              type="primary"
              disabled={total === 0} // 未查询到数据禁止点击导出
              onClick={async () => {
                const params: any = lodash.cloneDeep(storeParams);
                params.is_export = 1;
                let result;
                let str = "";
                switch (selectedKey) {
                  case "1": // 镇未审核
                    str = "镇未审核";
                    result = await townSubsidyMachineDeclare(params);
                    break;
                  case "2": // 镇已审核
                    str = "镇已审核";
                    result = await townSubsidyMachineDeclare(params);
                    break;
                  case "3": // 镇驳回记录
                    str = "镇驳回记录";
                    result = await townSubsidyMachineDeclareReject(params);
                    break;
                  case "4": // 市未公示
                    str = "市未公示";
                    result = await citySubsidyMachineDeclare(params);
                    break;
                  case "5": // 市公示中
                    str = "市公示中";
                    result = await citySubsidyMachineDeclare(params);
                    break;
                  case "6": // 市已公示
                    str = "市已公示";
                    result = await citySubsidyMachineDeclare(params);
                    break;
                  case "7": // 市已递交
                    str = "市已递交";
                    result = await citySubsidyMachineDeclare(params);
                    break;
                  case "8": // 打款记录
                    str = "打款记录";
                    result = await citySubsidyMachineDeclarePayment(params);
                    break;
                  case "9": // 财政退回
                    str = "财政退回";
                    result = await citySubsidyMachineDeclare(params);
                    break;
                  default:
                    break;
                }
                downloadAs(
                  result,
                  `${new Date().toLocaleString()}_${str}导出记录.xls`,
                  "application/vnd.ms-excel"
                );
              }}
            >
              导出
            </Button>
            {/*批量递交*/}
            {
              selectedKey === "6" && (
                <BatchSubmission
                  regionTree={regions}
                  userRegionPath={defaultRegion}
                  catTree={catTree}
                  mainTableRef={tableRef}
                />
              )
            }
          </div>
        )}
      />
      {/* 凭证预览 */}
      <DocumentPreviewModal
        visible={isPreviewModalOpen}
        context={selectedRow}
        cancelCb={() => setIsPreviewModalOpen(false)}
      />
      {/* 查看信息 */}
      <Detail
        visible={isDetailsModalOpen}
        context={selectedRow}
        selectedKey={selectedKey}
        cancelCb={() => setIsDetailedModalOpen(false)}
        successCb={() => setIsDetailedModalOpen(false)}
      />
    </>
  );
}

export default list;
