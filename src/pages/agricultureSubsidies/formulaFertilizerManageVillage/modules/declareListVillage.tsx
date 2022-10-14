import React, { useEffect, useRef, useState } from "react";
import ProTable from "@ant-design/pro-table";
import ButtonAuth from "@/components/ButtonAuth";
import { Button, DatePicker, Popconfirm, message, Cascader, Modal } from "antd";
import styles from "./../index.less";
import { ConnectState } from "@/models/connect";
import { connect } from "@@/plugin-dva/exports";
import AnthInfo from "./anthInfo";
import EditInfo from "./editInfo";
import PublicList from "./publicList";
import ImportBtn from "@/components/buttons/ImportBtn";
import { tableDataHandle,
  formatNumber } from "@/utils/utils";
import Moment from "moment";
import { downloadAs } from "@/pages/agricultureSubsidies/utils";
import {
  exportSubsidyFormulaDeclareVillage,
  formulaFertilizerSkipPublicity,
  formulaFertilizerStopPublicity,
  subsidyFormulaDeclareVillage,
  subsidyFormulaDeclareVillageTotal,
  townFormulaFertilizerRejectList,
  townFormulaFertilizerRejectSingle,
  townFormulaFertilizerRemitList,
  townFormulaFertilizerRemitTotal,
  townFormulaFertilizerTotal
} from "@/services/formulaFertilizerManageTown";
import { ExclamationCircleOutlined } from "@ant-design/icons";


function declareList({ ACTIVE_TABLE, SEARCH_ENUM, TABLE_ENUM, BUTTON_ENUM, regions }) {
  const tableRef: any = useRef();
  useEffect(() => {
    tableRef.current?.reset();
    tableRef.current?.reload();
  }, [ACTIVE_TABLE]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [publicVisible, setPublicVisible] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storeParams, setStoreParams]:any = useState({});
  const [totalData, setTotalData]: any = useState({});
  const [userRegion, setUserRegion]: any = useState([]);
  const [roleId, setRoleId]: any = useState(0);
  const tableEnum: any = {
    notPublic: 5,
    inThePublic: 6,
    publiced: 7,
    remitted: 8,
    rejected: 9
  };
  const tableName: any = {
    notPublic: "村未公示",
    inThePublic: "村公示中",
    publiced: "村已公示",
    remitted: "打款记录",
    rejected: "取消记录"
  };
  const natureEnum = {
    "": "全部",
    1: "个人",
    2: "合作社/公司"
  };
  const cropEnum = {
    "": "全部",
    "水稻": "水稻",
    "大小麦": "大小麦"
  };
  const isPublicEnum = {
    "": "全部",
    1: "是",
    0: "否"
  };
  const submitEnum = {
    "": "全部",
    1: "待递交",
    2: "递交中",
    3: "已递交"
  };
  // 1未审核  2已审核',
  const approvalStatus: any = {
    1: "未审核",
    2: "已审核"
  };
  const remitEnum = {
    1: "已申请",
    2: "成功",
    3: "失败"
  };
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    if (userInfo) {
      const temp: any = [];
      userInfo?.city_id != 0 && userInfo?.city_id && (temp[0] = userInfo?.city_id);
      userInfo?.town_id != 0 && userInfo?.town_id && (temp[1] = userInfo?.town_id);
      userInfo?.village_id != 0 && userInfo?.village_id && (temp[2] = userInfo?.village_id);
      setUserRegion(temp);
      setRoleId(userInfo?.role_id);
    }
  }, []);
  useEffect(()=>{
    tableRef?.current?.reload();
  },[userRegion])
  const loadData = async (rawParams: any) => {

    const params: any = {
      city_id: userRegion[0] ?? "",
      town_id: userRegion[1] ?? "",
      village_id: userRegion[2] ?? "",
      page: rawParams.current,
      page_size: rawParams.pageSize,
      // type: tableEnum[ACTIVE_TABLE],
      real_name: rawParams.real_name,
      year: rawParams.year ? Moment(rawParams.year).format("YYYY") :  Moment().format("YYYY"), // 年份需要默认值
      subsidy_type: rawParams.subsidy_type,
      crops_name: rawParams.crops_name
    };
    setStoreParams(params);
    let result;
    let total;
    switch (tableEnum[ACTIVE_TABLE]) {
      case 5: // 村未公示
        console.log("村未公示");
        params.type = 1;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 6: // 村公示中
        console.log("村公示中");
        params.type = 2;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 7: // 村已公示
        console.log("村已公示");
        params.type = 3;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 8: // 打款记录
        result = await townFormulaFertilizerRemitList(params);
        total = await townFormulaFertilizerRemitTotal(params);
        break;
      case 9: // 取消记录
        result = await townFormulaFertilizerRejectList(params);
        total = await townFormulaFertilizerTotal(params);
        break;
      default:
        break;
    }
    setTotalData(total?.data || { data: {} });
    if (result?.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } else {
      console.error(result?.msg);
      const transformed = Array.isArray(result?.data.data) ? result?.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result?.data), data: transformed } });
    }
  };

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
      key: "region",
      hideInTable: true,
      // initialValue: userRegion,

      renderFormItem: () => <Cascader defaultValue={userRegion} onChange={v=>setUserRegion(v)} options={regions} disabled={roleId == "19"} />
    },
    {
      title: "姓名",
      dataIndex: "real_name",
      hideInTable: true
    },
    {
      title: "性质",
      dataIndex: "subsidy_type",
      hideInTable: true,
      initialValue: '',
      valueEnum: natureEnum
    },
    {
      title: "作物",
      dataIndex: "crops_name",
      hideInTable: true,
      initialValue: '',
      valueEnum: cropEnum
    },
    {
      title: "年份",
      dataIndex: "year",
      initialValue: Moment().startOf("year"),
      hideInTable: true,
      renderFormItem: () => <DatePicker picker="year" allowClear={false}/>
    },
    {
      title: "是否能公示",
      dataIndex: "is_can_publicity",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("can_public"),
      valueEnum: isPublicEnum
    },
    {
      title: "递交状态",
      dataIndex: "is_examine_submit",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("submit_status"),
      valueEnum: submitEnum
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
      title: "姓名",
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
        if (record["crops_name"] === "水稻") {
          return (
            <Popconfirm
              placement="topLeft"
              title={`
                其中配方0.06吨/亩标准核实面积${formatNumber(record["formula_area"],1)}亩，限额购肥${
                formatNumber(((record["formula_area"] ?? 0) * 0.06),4)
              }吨；\n
                配方0.035吨/亩标准核实面积${ formatNumber((record["verify_area"] - (record["formula_area"] ?? 0)),1) }亩，限额购肥量${
                formatNumber(((record["verify_area"] - (record["formula_area"] ?? 0)) * 0.035) ,4)}吨；
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
          return (<span>{record["quota_ton"]}</span>);
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
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("rejected_reason")
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
      title: "递交状态",
      dataIndex: "is_examine_submit",
      align: "center",
      width: 100,
      hideInSearch: true,
      valueEnum: submitEnum,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("submit_status"),
      render: (__, record) => (<span
        style={{ color: record["is_examine_submit"] === 3 ? "green" : record["is_examine_submit"] === 2 ? "#f66" : "" }}>{submitEnum[record["is_examine_submit"]]}</span>)
    },
    {
      title: "打款状态",
      dataIndex: "payment_status",
      align: "center",
      width: 100,
      hideInSearch: true,
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
      title: "取消时间",
      dataIndex: "cancel_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("cancel_time")
    },
    {
      title: "审核状态",
      dataIndex: "is_examine",
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("approval_status"),
      hideInSearch: true,
      valueEnum: approvalStatus
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
            style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("detail") ? "block" : "none" }}
            type="link"
            onClick={() => {
              setSelectedRow(record);
              setDetailVisible(true);
            }}
          >
            查看信息
          </Button>
          <Button
            style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("delete") ? "block" : "none" }}
            type="link"
            onClick={() => {
              Modal.confirm({
                content: '确认删除?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                  try {
                    townFormulaFertilizerRejectSingle({
                      id: record.id,
                      town_reject_reason:'',
                    }).then(e=>{
                      if(e.code === 0){
                        message.success('删除成功')
                        tableRef.current.reload()
                      }
                    })
                  } catch (e) {
                    message.error(new Error(`删除失败: ${e.message}!`));
                  }
                },
              });

            }}
          >
            删除
          </Button>
          <ButtonAuth type="EDIT">
            <Button
              style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("edit") ? "block" : "none" }}
              type="link"
              onClick={() => {
                setSelectedRow(record);
                setEditVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <Popconfirm
              placement="top"
              title={`确认${record["crops_name"] === "水稻" ? "驳回" : "取消申报"}当前数据?`}
              onConfirm={async () => {
                try {
                  const result = await townFormulaFertilizerRejectSingle({ id: record["id"] });
                  if (result.code === 0) {
                    message.success(`已${record["crops_name"] === "水稻" ? "驳回" : "取消申报"}`);
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              {
                record["is_can_publicity"] && BUTTON_ENUM[ACTIVE_TABLE].includes("reject") ? (
                  <Button
                    type="link"
                  >
                    {record["crops_name"] === "水稻" ? "驳回" : "取消申报"}
                  </Button>
                ) : null
              }
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="确认将当前数据跳过公示?"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerSkipPublicity({
                    id: record["id"],
                    crops_name: record["crops_name"],
                    subsidy_type: record["subsidy_type"],
                    year: record["year"]
                  });
                  if (result.code === 0) {
                    message.success("已跳过该数据");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="确定"
              cancelText="取消"
            >

              {
                record["is_reject"] ? (
                  <Button
                    type="link"
                    style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("skip_public") ? "block" : "none" }}
                  >
                    跳过公示
                  </Button>
                ) : null
              }
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="确认将当前数据取消公示?"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerStopPublicity({ id: record["id"] });
                  if (result.code === 0) {
                    message.success("该数据已停止公示");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("stop_public") ? "block" : "none" }}
              >
                取消公示
              </Button>
            </Popconfirm>
          </ButtonAuth>
        </div>
      )
    }
  ];

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
          <div className={styles.header_bar} style={{ display: ACTIVE_TABLE === "rejected" ? "none" : "flex" }}>
            <div>户数：<p>{totalData.count || 0}</p>户</div>
            <div>最终可补量：<p>{totalData.fertilizer_ton || 0}</p>吨</div>
            <div>补贴金额：<p>{formatNumber(totalData.subsidy_amount ,2) ?? 0}</p>元</div>
          </div>
        }
        toolBarRender={() => [
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="确认全部跳过公示？"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerSkipPublicity({
                    crops_name: storeParams["crops_name"] ?? "",
                    subsidy_type: storeParams["subsidy_type"] ?? "",
                    year: storeParams["year"] ?? ""
                  });
                  if (result.code === 0) {
                    message.success("已跳过公示");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
                type="link"
                disabled={!totalData.count || totalData.count === 0}
              >
                全部跳过公示
              </Button>
            </Popconfirm>
          </ButtonAuth>,
          <ButtonAuth type="PUBLICITY">
            <Button
              style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
              type="primary"
              disabled={!totalData.count || totalData.count === 0}
              onClick={() => {
                setPublicVisible(true);
              }}
            >
              开始公示
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <Button
              style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
              type="primary"
              onClick={() => {
                window.location.href = "https://wsnf.oss-cn-hangzhou.aliyuncs.com/%E9%85%8D%E6%96%B9%E8%82%A5--%E6%9D%91%E7%BA%A7--%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
              }}
            >
              模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            {
              ACTIVE_TABLE === "notPublic" ? (
                <ImportBtn
                  api="import_subsidy_formula_declare"
                  onSuccess={() => tableRef.current?.reload()}
                  btnText="导入"
                />
              ) : null
            }
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={async () => {
                const { pageNum, pageSize, ...exportParams }: any = storeParams;
                const result = await exportSubsidyFormulaDeclareVillage(exportParams);
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
        natureEnum={natureEnum}
        context={selectedRow}
        onCancel={() => {
          setDetailVisible(false);
        }}
      />
      <EditInfo
        visible={editVisible}
        natureEnum={natureEnum}
        context={selectedRow}
        onCancel={() => {
          setEditVisible(false);
        }}
        onSuccess={() => {
          setEditVisible(false);
          tableRef?.current?.reload();
        }}
      />
      <PublicList
        visible={publicVisible}
        params={storeParams}
        natureEnum={natureEnum}
        cropEnum={cropEnum}
        onCancel={() => {
          setPublicVisible(false);
        }}
        onSuccess={() => {
          setPublicVisible(false);
          tableRef?.current?.reload();
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
