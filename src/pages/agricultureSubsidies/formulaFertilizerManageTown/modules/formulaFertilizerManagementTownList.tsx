import React, { useEffect, useRef, useState } from "react";
import ProTable from "@ant-design/pro-table";
import ButtonAuth from "@/components/ButtonAuth";
import { Button, DatePicker, Popconfirm, message, Cascader } from "antd";
import styles from "./../index.less";
import { ConnectState } from "@/models/connect";
import { connect } from "@@/plugin-dva/exports";
import AnthInfo from "./anthInfo";
import EditInfo from "./editInfo";
import PublicList from "./publicList";
import BatchReview from "./batchReview";
import ImportBtn from "@/components/buttons/ImportBtn";
import { formatNumber, tableDataHandle } from "@/utils/utils";
import Moment from "moment";
import { downloadAs } from "@/pages/agricultureSubsidies/utils";
import {
  exportSubsidyFormulaDeclareVillage,
  exportSubsidyFormulaFertilizerDeclare,
  formulaFertilizerSkipPublicity,
  formulaFertilizerStopPublicity, getSubsidyFormulaFertilizerDeclareList,
  subsidyFormulaDeclareVillage,
  subsidyFormulaDeclareVillageTotal, subsidyFormulaFertilizerDeclareExamine, subsidyFormulaFertilizerDeclareListTotal,
  townFormulaFertilizerList,
  townFormulaFertilizerListExport,
  townFormulaFertilizerRejectList,
  townFormulaFertilizerRejectListExport,
  townFormulaFertilizerRejectSingle,
  townFormulaFertilizerRemitList,
  townFormulaFertilizerRemitListExport,
  townFormulaFertilizerRemitTotal,
  townFormulaFertilizerTotal
} from "@/services/formulaFertilizerManageTown";
import moment from "moment";
import lodash from "lodash";

import { cityFormulaFertilizerListReject } from "@/services/formulaFertilizerManage";
import RejectModal from "@/components/agricultureSubsidies/RejectModal";

function declareListTown({ ACTIVE_TABLE, SEARCH_ENUM, TABLE_ENUM, BUTTON_ENUM, regions }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
  const tableRef: any = useRef();
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [publicVisible, setPublicVisible] = useState<boolean>(false);
  const [batchVisible, setBatchVisible] = useState<boolean>(false);
  const [selectedRow, setSelectedRow]:any = useState({});
  const [storeParams, setStoreParams] = useState({});
  const [totalData, setTotalData]: any = useState({});
  const [userRegion, setUserRegion]: any = useState([]);
  const [roleId, setRoleId]: any = useState(0);
  useEffect(() => {
    tableRef.current?.reset();
    tableRef.current?.reload();
  }, [ACTIVE_TABLE]);
  useEffect(() => {
    if (userInfo) {
      const temp: any = [];
      userInfo?.city_id != 0 && userInfo?.city_id && (temp[0] = userInfo?.city_id);
      userInfo?.town_id != 0 && userInfo?.town_id && (temp[1] = userInfo?.town_id);
      userInfo?.village_id != 0 && userInfo?.village_id && (temp[2] = userInfo?.village_id);
      setUserRegion(temp);
      setRoleId(userInfo?.role_id);
    }
  }, []);
  const tableEnum: any = {
    notPublicVillage: 1, // ????????????
    inThePublicVillage: 2, // ????????????
    pendingReview: 3, // ????????????
    hadReview: 4, // ????????????
    notPublic: 5,
    inThePublic: 6,
    publiced: 7,
    remitted: 8,
    rejected: 9
  };
  const tableName = {
    notPublicVillage: "????????????", // ????????????
    inThePublicVillage: "????????????", // ????????????
    pendingReview: "????????????", // ????????????
    hadReview: "????????????", // ????????????
    notPublic: "????????????",
    inThePublic: "????????????",
    publiced: "????????????",
    remitted: "???????????????",
    rejected: "?????????/????????????"
  };
  const natureEnum = {
    "": "??????",
    1: "??????",
    2: "?????????/??????"
  };
  const cropEnum = {
    "": "??????",
    "??????": "??????",
    "?????????": "?????????"
  };
  const isPublicEnum = {
    "": "??????",
    1: "???",
    0: "???"
  };
  const submitEnum = {
    "": "??????",
    1: "?????????",
    2: "?????????",
    3: "?????????"
  };
  const remitEnum = {
    1: "?????????",
    2: "??????",
    3: "??????"
  };

  const loadData = async (rawParams: any) => {
    console.log(userRegion)
    console.log(rawParams)
    const params:any = {
      type: tableEnum[ACTIVE_TABLE],
      real_name: rawParams.real_name,
      subsidy_type: rawParams.subsidy_type,
      crops_name: rawParams.crops_name,
      year: rawParams.year ? Moment(rawParams.year).format("YYYY") : Moment().format("YYYY"), // ??????????????????
      is_can_publicity: rawParams.is_can_publicity,
      payment_status: rawParams.payment_status,
      is_examine_submit: rawParams.is_examine_submit,
      page: rawParams.current,
      page_size: rawParams.pageSize,

      town_id:userRegion[1] ?? '',
      village_id:userRegion[2] ?? '',
    };
    setStoreParams(params);
    let result;
    let total;
    switch (tableEnum[ACTIVE_TABLE]) {
      case 1: // ????????????
        console.log("????????????");
        params.type = 1;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 2: // ????????????
        console.log("????????????");
        params.type = 2;
        result = await subsidyFormulaDeclareVillage(params);
        total = await subsidyFormulaDeclareVillageTotal(params);
        break;
      case 3: // ????????????
        console.log("????????????");
        params.is_examine = 1;
        params.type = 3;
        result = await getSubsidyFormulaFertilizerDeclareList(params);
        total = await subsidyFormulaFertilizerDeclareListTotal(params);
        break;
      case 4: // ????????????
        console.log("????????????");
        params.is_examine = 2;
        params.type = 3;
        result = await getSubsidyFormulaFertilizerDeclareList(params);
        total = await subsidyFormulaFertilizerDeclareListTotal(params);
        break;
      case 5: // ????????????
        console.log("????????????");
        params.type = 1;
        result = await townFormulaFertilizerList(params);
        total = await townFormulaFertilizerTotal(params);
        break;
      case 6: // ????????????
        console.log("????????????");
        params.type = 2;
        result = await townFormulaFertilizerList(params);
        total = await townFormulaFertilizerTotal(params);
        break;
      case 7: // ????????????
        console.log("????????????");
        params.type = 3;
        result = await townFormulaFertilizerList(params);
        total = await townFormulaFertilizerTotal(params);
        break;
      case 8: // ???????????????
        result = await townFormulaFertilizerRemitList(params);
        total = await townFormulaFertilizerRemitTotal(params);
        break;
      case 9: // ?????????/????????????
        result = await townFormulaFertilizerRejectList(params);
        total = await townFormulaFertilizerTotal(params);
        break;
      default:
        // result = await townFormulaFertilizerList(params);
        // total = await townFormulaFertilizerTotal(params);
        break;
    }
    // getTotal(params);
    setTotalData(total?.data || { data: {} });
    // const result = tableEnum[ACTIVE_TABLE] === 4 ? await townFormulaFertilizerRemitList(params)
    //   : tableEnum[ACTIVE_TABLE] === 5 ? await townFormulaFertilizerRejectList(params)
    //     : await townFormulaFertilizerList(params);
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
    // ????????????
    {
      title: "??????",
      key: "region",
      hideInTable: true,
      // initialValue: userRegion,
      renderFormItem: () => {
        // ???????????? ????????? ???
        const areas:any = lodash.cloneDeep(regions);
        if(userInfo.role_id == '18'){
          areas.map(item=>{
            if(userInfo?.city_id && userInfo?.city_id !=item?.city_id){
              item.disabled = true
            }
          })
        }
        return <Cascader defaultValue={userRegion} onChange={(v) => setUserRegion(v)} options={areas} disabled={roleId == "19"} />;
      }
    },
    {
      title: "??????",
      dataIndex: "real_name",
      hideInTable: true
    },
    {
      title: "??????",
      dataIndex: "subsidy_type",
      hideInTable: true,
      valueEnum: natureEnum
    },
    {
      title: "??????",
      dataIndex: "crops_name",
      hideInTable: true,
      valueEnum: cropEnum
    },
    {
      title: "??????",
      dataIndex: "year",
      hideInTable: true,
      initialValue: moment().startOf("year"),
      renderFormItem: () => <DatePicker picker="year" allowClear={false}/>
    },
    {
      title: "???????????????",
      dataIndex: "is_can_publicity",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("can_public"),
      valueEnum: isPublicEnum
    },
    {
      title: "????????????",
      dataIndex: "is_examine_submit",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("submit_status"),
      valueEnum: submitEnum
    },
    {
      title: "????????????",
      dataIndex: "payment_status",
      hideInTable: true,
      hideInSearch: !SEARCH_ENUM[ACTIVE_TABLE].includes("remit_status"),
      valueEnum: remitEnum
    },
    // ???????????????
    {
      title: "????????????",
      dataIndex: "real_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "??????",
      dataIndex: "subsidy_type",
      align: "center",
      valueEnum: natureEnum,
      width: 100,
      hideInSearch: true
    },
    {
      title: "????????????",
      dataIndex: "area_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "???????????????",
      dataIndex: "verify_area",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "??????",
      dataIndex: "crops_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "??????",
      dataIndex: "year",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "???????????????/???",
      dataIndex: "quota_ton",
      align: "center",
      width: 100,
      hideInSearch: true,
      render: (__, record) => {
        if (record["crops_name"] === "??????") {
          return (
            <Popconfirm
              placement="topLeft"
              title={`
                ????????????0.06???/?????????????????????${formatNumber(record["formula_area"] ,1) ?? 0}??????????????????${formatNumber(((record["formula_area"] ?? 0) * 0.06),4) }??????\n
                ??????0.035???/?????????????????????${formatNumber((record["verify_area"] - (record["formula_area"] ?? 0)),1) }?????????????????????${
                formatNumber(((record["verify_area"] - (record["formula_area"] ?? 0)) * 0.035), 4) }??????
              `}
              showCancel={false}
              okText="?????????"
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
      title: "??????????????????/???",
      dataIndex: "real_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "????????????/???",
      dataIndex: "billing_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "????????????/???",
      dataIndex: "delivery_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "???????????????/???",
      dataIndex: "fertilizer_ton",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "????????????",
      dataIndex: "subsidy_amount",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "????????????",
      dataIndex: "declare_time",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "???????????????",
      dataIndex: "is_can_publicity",
      align: "center",
      width: 100,
      hideInSearch: true,
      valueEnum: isPublicEnum,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("can_public")
    },
    {
      title: `${ TABLE_ENUM[ACTIVE_TABLE].includes('is_city_reject') ? '???' :''}????????????`,
      dataIndex: "reject_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("rejected_time")
    },
    {
      title: `${ TABLE_ENUM[ACTIVE_TABLE].includes('is_city_reject') ? '???':''}????????????`,
      dataIndex: 'city_reject_reason',
      align: 'center',
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes('rejected_reason'),
      render: (__, record) => {
        if (record?.city_reject_reason) {
          return <span style={{color:'red'}}>{record.city_reject_reason}</span>;
        } else {
          return <span>-</span>;
        }
      }
    },
    {
      title: "??????????????????",
      dataIndex: "publicity_end",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("stop_public_time")
    },
    {
      title: "????????????",
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
      title: "????????????",
      dataIndex: "payment_status",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("remit_status"),
      render: (__, record) => (<span
        style={{ color: record["payment_status"] === 3 ? "green" : record["payment_status"] === 2 ? "#f66" : "" }}>{remitEnum[record["payment_status"]]}</span>)
    },
    {
      title: "????????????",
      dataIndex: "payment_time",
      align: "center",
      width: 100,
      hideInSearch: true,
      hideInTable: !TABLE_ENUM[ACTIVE_TABLE].includes("remit_time")
    },
    {
      title: "??????",
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
            ????????????
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
              ??????
            </Button>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <Button
              style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("town_pass") ? "block" : "none" }}
              type="link"
              onClick={async () => {
                const params:any = lodash.cloneDeep(storeParams);
                params.id = record.id
                params.is_examine = 1// 1????????? 2?????????
                console.log("params");
                console.log(params);
                // return
                const result = await subsidyFormulaFertilizerDeclareExamine(params);
                if (result.code === 0) {
                  message.success("????????????");
                  tableRef?.current?.reload();
                } else {
                  message.error(result.msg);
                }
              }}
            >
              ??????
            </Button>
            <Button
              style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("town_reject") ? "block" : "none" }}
              type="link"
              onClick={async () => {
                setSelectedRow(record);
                setIsRejectionModalOpen(true);
              }}
            >
              ??????
            </Button>
          </ButtonAuth>
          <ButtonAuth type="EDIT">
            <Popconfirm
              placement="top"
              title={`??????${record["crops_name"] === "??????" ? "??????" : "????????????"}?????????????`}
              onConfirm={async () => {
                try {
                  const result = await townFormulaFertilizerRejectSingle({ id: record["id"] });
                  if (result.code === 0) {
                    message.success(`???${record["crops_name"] === "??????" ? "??????" : "????????????"}`);
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="??????"
              cancelText="??????"
            >
              {
                record["is_can_publicity"] && BUTTON_ENUM[ACTIVE_TABLE].includes("reject") ? (
                  <Button
                    type="link"
                  >
                    {record["crops_name"] === "??????" ? "??????" : "????????????"}
                  </Button>
                ) : null
              }
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="??????????????????????????????????"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerSkipPublicity({
                    id: record["id"],
                    crops_name: record["crops_name"],
                    subsidy_type: record["subsidy_type"],
                    year: record["year"]
                  });
                  if (result.code === 0) {
                    message.success("??????????????????");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="??????"
              cancelText="??????"
            >
              {
                record["is_reject"] ? (
                  <Button
                    type="link"
                    style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("skip_public") ? "block" : "none" }}
                  >
                    ????????????
                  </Button>
                ) : null
              }
            </Popconfirm>
          </ButtonAuth>
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="??????????????????????????????????"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerStopPublicity({ id: record["id"] });
                  if (result.code === 0) {
                    message.success("????????????????????????");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="??????"
              cancelText="??????"
            >
              <Button
                type="link"
                style={{ display: BUTTON_ENUM[ACTIVE_TABLE].includes("stop_public") ? "block" : "none" }}
              >
                ????????????
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
            <div>?????????<p>{totalData.count || 0}</p>???</div>
            <div>??????????????????<p>{formatNumber(totalData.fertilizer_ton,4) || 0}</p>???</div>
            <div>???????????????<p>{formatNumber(totalData.subsidy_amount ,2) || 0}</p>???</div>
          </div>
        }
        toolBarRender={() => [
          <ButtonAuth type="PUBLICITY">
            <Popconfirm
              placement="top"
              title="???????????????????????????"
              onConfirm={async () => {
                try {
                  const result = await formulaFertilizerSkipPublicity({
                    crops_name: storeParams["crops_name"] ?? "",
                    subsidy_type: storeParams["subsidy_type"] ?? "",
                    year: storeParams["year"] ?? ""
                  });
                  if (result.code === 0) {
                    message.success("???????????????");
                    tableRef?.current?.reload();
                  } else {
                    message.error(result.msg);
                  }
                } catch (err) {
                  message.error(err.message);
                }
              }}
              okText="??????"
              cancelText="??????"
            >
              <Button
                style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
                type="link"
              >
                ??????????????????
              </Button>
            </Popconfirm>
          </ButtonAuth>,
          <ButtonAuth type="PUBLICITY">
            <Button
              style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
              type="primary"
              onClick={() => {
                setPublicVisible(true);
              }}
            >
              ????????????
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <Button
              style={{ display: ACTIVE_TABLE === "notPublic" ? "block" : "none" }}
              type="primary"
              onClick={() => {
                window.location.href = "https://img.wsnf.cn/acfile/%E9%85%8D%E6%96%B9%E8%82%A5%E7%94%B3%E6%8A%A5--%E5%AF%BC%E5%85%A5--%E5%BC%80%E7%A5%A8%E9%80%81%E8%B4%A7%E9%87%8F.xlsx";
              }}
            >
              ??????
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            {
              ACTIVE_TABLE === "notPublic" ? (
                <ImportBtn
                  api="import_subsidy_formula_fertilizer_declare"
                  onSuccess={() => tableRef.current?.reload()}
                  btnText="????????????/?????????"
                />
              ) : null
            }
          </ButtonAuth>,
          <>
            {
              BUTTON_ENUM[ACTIVE_TABLE].includes("batch_review") && (
                <Button type="primary" onClick={()=>{
                  setBatchVisible(true)
                }}>????????????</Button>
              )
            }
          </>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={async () => {
                const { pageNum, pageSize, ...exportParams }: any = storeParams;
                let result: any;
                switch (tableEnum[ACTIVE_TABLE]) {
                  case 1: // ????????????
                    result = await exportSubsidyFormulaDeclareVillage(exportParams);
                    break;
                  case 2:// ????????????
                    result = await exportSubsidyFormulaDeclareVillage(exportParams);
                    break;
                  case 3:// ????????????
                    exportParams.is_examine = 1;
                    result = await exportSubsidyFormulaFertilizerDeclare(exportParams);
                    break;
                  case 4:// ????????????
                    exportParams.is_examine = 2;
                    result = await exportSubsidyFormulaFertilizerDeclare(exportParams);
                    break;
                  case 8:
                    result = await townFormulaFertilizerRemitListExport(exportParams);
                    break;
                  case 9:
                    result = await townFormulaFertilizerRejectListExport(exportParams);
                    break;
                  default:
                    result = await townFormulaFertilizerListExport(exportParams);
                    break;
                }
                if (result && !result.code) {
                  downloadAs(result, `${new Date().toLocaleString()}${tableName[ACTIVE_TABLE]}??????.xls`, "application/vnd.ms-excel");
                } else {
                  message.error(`????????????: ${result.msg}`);
                }
              }}
            >
              ??????
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
      {/*????????????*/}
      <BatchReview
        visible={batchVisible}
        natureEnum={natureEnum}
        regions={regions}
        cropEnum={cropEnum}
        onCancel={() => {
          setBatchVisible(false);
        }}
        onSuccess={() => {
          setBatchVisible(false);
          tableRef?.current?.reload();
        }}
      />
      <RejectModal
        visible={isRejectionModalOpen}
        cancelCb={() => setIsRejectionModalOpen(false)}
        successCb={async (response:any) => {
          const params: any = {
            id: selectedRow.id,
            city_reject_reason:response,
            status: 1,//1 ????????????????????? 2????????????????????????
            process_type: 2 //???????????????  ??? 2   ???????????????  1   ??????????????? 3    ????????????
          };
          const result = await cityFormulaFertilizerListReject(params);
          if (result.code === 0) {
            message.success(`?????????`);
            setIsRejectionModalOpen(false);
            tableRef?.current?.reload();
          } else {
            message.error(result.msg);
          }
        }}
      />
    </>
  );
}

export default connect(({ info, user }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  areaList: info.areaList
}))(declareListTown);
