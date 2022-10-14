/**
 * 乱七八糟
 */
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import moment from "moment";
import { Button, message, DatePicker, Cascader, Modal, List } from "antd";
import { CascaderOptionType } from "antd/es/cascader";
import _ from "lodash";
import { FormInstance } from "antd/es/form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  approveClaim,
  deleteClaim,
  startPublicityToTown,
  deleteImport,
  getClaimRecordsForVillageOfficials,
  getClaimsForCityOfficials,
  getClaimsForTownOfficials,
  getRejectedClaimRecordsForVillageOfficials,
  retractClaim,
  getTransactionHistoryForVillageOfficials,
  toggleInspected,
  getPendingClaimsForTownOfficials,
  getTownAnnouncement
} from "@/services/agricultureSubsidies";
import { tableDataHandle } from "@/utils/utils";
import {
  CLAIM_RECORD_TABLES,
  eligibility,
  hasAction,
  inspectionStatus,
  isModificationRequested,
  ownershipTypes,
  paymentStatus,
  RECORD_ACTIONS,
  recordStatuses,
  examineSubmit,
  seasons,
  TABLE_COLUMNS,
  farmTypeOptions
} from "@/pages/agricultureSubsidies/consts";
import ExportButton from "@/components/agricultureSubsidies/ExportButton";
import ClaimRejectionModal from "@/components/agricultureSubsidies/RejectClaimModal";
import ClaimantDetailsModal from "@/components/agricultureSubsidies/ClaimantDetails";
import {
  clearDefaultDatetimeFormat,
  downloadDocumentsAsZipFile,
  renderCell,
  transformTreeData,
  traverseTree,
  findRegionNames,
  populatePathDict
} from "@/pages/agricultureSubsidies/utils";
import DocumentPreviewModal from "@/components/agricultureSubsidies/DocumentPreviewModal";
import RequestModificationModal from "@/components/agricultureSubsidies/RequestModificationModal";
import ClaimModificationFormModal from "@/components/agricultureSubsidies/ClaimModificationFormModal";
import PrepareDraftButton from "@/components/agricultureSubsidies/PrepareDraftButton";
import PrepareSubmissionButton from "@/components/agricultureSubsidies/PrepareSubmissionButton";
import { StatsType, SubsidyUserAuthorizations } from "@/pages/agricultureSubsidies/types";
import styles from "./ClaimRecordTable.less";
import useCrops from "@/components/agricultureSubsidies/useCrops";
import DeclareImportModal from "@/components/agricultureSubsidies/declareImportModal";
import {
  deleteEvaluationReport,
  townFinanceRejectDeclaresAll,
  townFinanceRejectDeclaresAllTown
} from "@/services/partyOrganization";

type ClaimRecordTableProps = {
  table: string;
  catTree: CascaderOptionType[];
  defaultRegion: string[];
  regions: any[];
  userAuthorizations: SubsidyUserAuthorizations;
  tableRef: MutableRefObject<ActionType>;
};

function limitedStatuses(unwanted) {
  if (Array.isArray(unwanted)) {
    const filtered = { ...recordStatuses };
    unwanted.forEach((prop) => {
      delete filtered[prop];
    });
    return filtered;
  }
  return recordStatuses;
}

function ClaimRecordTable({
                            table,
                            catTree,
                            defaultRegion,
                            regions,
                            userAuthorizations,
                            tableRef
                          }: ClaimRecordTableProps) {
  const isMounted = useRef(true);
  const formRef = useRef<FormInstance>();
  const [selectedRow, setSelectedRow] = useState({});
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // 表格是否加载完成
  const [loading, setLoading] = useState(false);
  const [isRequestModificationModalOpen, setIsRequestModificationModalOpen] = useState(false);
  const [isClaimModificationModalOpen, setIsClaimModificationModalOpen] = useState(false);
  const [stats, setStats] = useState<StatsType>({});
  const [storedParams, setStoredParams] = useState({});
  const [cropSelectOptions] = useCrops();
  const [declareImportModal, handleDeclareImportModal] = useState(false);
  const [region, setRegion] = useState(defaultRegion);
  const [userInfo, setUserInfo] = useState(defaultRegion);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    setUserInfo(userInfo)
    if (defaultRegion && defaultRegion.length > 0) {
      setRegion(defaultRegion);
    } else {
      console.log("---------", userInfo);
      // eslint-disable-next-line no-unused-expressions
      userInfo.town_id
        ? setRegion([userInfo?.city_id, userInfo?.town_id, userInfo?.village_id])
        : null;
      // tableRef.current.reload()
    }
  }, [defaultRegion]);

  const catPathDict = useMemo(() => {
    const dict = new Map();
    populatePathDict(dict, catTree, "label");
    return dict;
  }, [catTree]);
  const rejectionModalType = useMemo(() => {
    if (
      [
        CLAIM_RECORD_TABLES.PENDING_VALIDATION,
        CLAIM_RECORD_TABLES.POSTED,
        CLAIM_RECORD_TABLES.SUBMITTED,
        CLAIM_RECORD_TABLES.REJECTED
      ].indexOf(table) > -1
    ) {
      return "village";
    }
    if (
      [
        CLAIM_RECORD_TABLES.PENDING_APPROVAL,
        CLAIM_RECORD_TABLES.APPROVED,
        CLAIM_RECORD_TABLES.FINANCIAL_BACK
      ].indexOf(table) > -1
    ) {
      return "town";
    }
    return null;
  }, [table]);
  const tableColumns = [
    {
      title: "地区",
      key: "region",
      hideInTable: true,
      initialValue: region,
      renderFormItem: () => (
        <Cascader
          options={regions}
          disabled={
            userAuthorizations.isVillageOfficial &&
            !(userAuthorizations.isTownOfficial || userAuthorizations.isCityOfficial)
          }
          // onChange={(v) => setSelectedRegion(v)}
          changeOnSelect={userAuthorizations.isTownOfficial || userAuthorizations.isCityOfficial}
          allowClear={false}
        />
      )
    },
    {
      title: "ID",
      dataIndex: "id",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "补贴对象",
      dataIndex: "contractor",
      hideInTable: !TABLE_COLUMNS[table]?.includes("contractor")
    },
    {
      title: "农户类型",
      dataIndex: "household_type",
      render: (__, record) => (record.household_type === 1 ? "规模户" : "散户"),
      valueEnum: { 1: "规模户", 2: "散户" }
    },
    {
      title: "所属地区",
      dataIndex: "regionString",
      filters: undefined,
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("regionString")
    },
    {
      title: "申报面积(亩)",
      dataIndex: "cumulativeSize",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("cumulativeSize"),
      render: (__, record) => _.round(renderCell(record, "cumulativeSize", "sum"), 1)
    },
    {
      title: "承包流转面积(亩)",
      dataIndex: "contractedArea",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("contractedArea"),
      render: (__, record) => _.round(record.contractedArea, 1)
    },
    {
      title: "补贴面积(亩)",
      key: "actualSize",
      hideInSearch: true,
      // render: (__, record) => ( record.household_type === 1 ? _.round(Math.min(record.contractedArea, renderCell(record, 'cumulativeSize', 'sum')), 1) : _.round(renderCell(record, 'cumulativeSize', 'sum'), 1) ),
      render: (__, record) => renderCell(record, "actualSize", "sum")
    },
    // {
    //   title: '面积(m²)',
    //   dataIndex: 'cumulativeMetricSize',
    //   hideInSearch: true,
    //   hideInTable: !TABLE_COLUMNS[table].includes('cumulativeMetricSize'),
    //   render: (__, record) => (_.round(record.cumulativeMetricSize, 1)),
    // },
    {
      title: "补贴金额",
      dataIndex: "amount",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("amount"),
      render: (__, record) => _.round(record.amount, 2)
    },
    {
      title: "种植作物",
      dataIndex: "crops",
      hideInTable: !TABLE_COLUMNS[table]?.includes("crops"),
      valueEnum: cropSelectOptions
    },
    {
      title: "性质",
      dataIndex: "ownershipType",
      valueEnum: { ...ownershipTypes, 0: "全部" },
      filters: false,
      hideInTable: !TABLE_COLUMNS[table]?.includes("ownershipType")
    },
    {
      title: "年份",
      dataIndex: "year",
      initialValue: moment().startOf("year"),
      hideInTable: !TABLE_COLUMNS[table]?.includes("year"),
      renderFormItem: () => <DatePicker picker="year" />
    },
    {
      title: "季节",
      dataIndex: "season",
      valueEnum: { ...seasons, 0: "全部" },
      filters: false,
      hideInTable: !TABLE_COLUMNS[table]?.includes("season")
    },
    {
      title: "补贴项目",
      dataIndex: "category",
      hideInTable: !TABLE_COLUMNS[table]?.includes("category"),
      renderFormItem: () => <Cascader options={catTree} />
    },
    {
      title: "申报时间",
      dataIndex: "createdAt",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("createdAt"),
      render: (__, record) => record.createdAt || "--"
    },
    // {
    //   title: '电话',
    //   dataIndex: 'phoneNumber',
    //   hideInSearch: true,
    //   hideInTable: !TABLE_COLUMNS[table].includes('phoneNumber'),
    //   render: (__, record) => (
    //     <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : ''}</span>
    //   ),
    // },
    {
      title: "递交状态",
      key: "status",
      valueEnum: { ...recordStatuses, 0: "全部" },
      // valueEnum: { ...limitedStatuses(table === CLAIM_RECORD_TABLES.PENDING_VALIDATION ? ['2'] : table === CLAIM_RECORD_TABLES.SUBMITTED ? ['3'] : []), 0: '全部' },
      filters: false,
      // 注意切换表时loadData的params
      hideInSearch: !TABLE_COLUMNS[table]?.includes("status"),
      hideInTable: !TABLE_COLUMNS[table]?.includes("status"),
      render: (__, record) => {
        if (record.status === 3) {
          return <span style={{ color: "red" }}>被驳回</span>;
        }
        return recordStatuses[record.status];
      }
    },
    {
      title: "操作时间",
      dataIndex: "dateOfRejection",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("dateOfRejection")
    },
    {
      title: "驳回理由",
      dataIndex: "reasonForRejection",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("reasonForRejection")
    },
    {
      title: "公示截止日期",
      dataIndex: "postingClosingDate",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("postingClosingDate"),
      render: (v) => clearDefaultDatetimeFormat(v)
    },
    {
      title: "打款状态",
      valueEnum: paymentStatus,
      dataIndex: "paymentStatus",
      filters: false,
      render: (__, record) => {
        if (record.paymentStatus === 0) {
          return <span>已递交</span>;
        }
        if (record.paymentStatus === 1) {
          return <span style={{ color: "red" }}>退回</span>;
        }
        if (record.paymentStatus === 2) {
          return <span style={{ color: "green" }}>成功</span>;
        }
        return "--";
      },
      hideInSearch: !TABLE_COLUMNS[table]?.includes("paymentStatus"),
      hideInTable: !TABLE_COLUMNS[table]?.includes("paymentStatus")
    },
    {
      title: "操作时间",
      dataIndex: "payment_time",
      hideInSearch: true,
      render: (__, record) =>
        record.paymentStatus === 2 ? record.payment_time : record.check_time,
      hideInTable: !TABLE_COLUMNS[table]?.includes("payment_time")
    },
    // ***************************** 镇级 *****************************
    {
      title: "面积筛选",
      dataIndex: "isEligible",
      valueEnum: eligibility,
      hideInSearch: !TABLE_COLUMNS[table]?.includes("isEligible"),
      hideInTable: true
    },
    {
      title: "申请状态",
      dataIndex: "modRequestStatus",
      render: (__, record) => {
        if (record.modRequestStatus === 1) {
          return (
            <span style={{ color: "red" }}>{isModificationRequested[record.modRequestStatus]}</span>
          );
        }
        return isModificationRequested[record.modRequestStatus];
      },
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("modRequestStatus")
    },
    {
      title: "申请时间",
      dataIndex: "dateRequested",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("dateRequested")
    },
    {
      title: "申请理由",
      dataIndex: "reasonForModification",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("reasonForModification")
    },
    {
      title: "复核",
      dataIndex: "inspected",
      valueEnum: inspectionStatus,
      hideInSearch: !TABLE_COLUMNS[table]?.includes("inspected"),
      hideInTable: !TABLE_COLUMNS[table]?.includes("inspected"),
      render: (__, record) => {
        if (record.inspected) {
          return <span style={{ color: "forestgreen" }}>{inspectionStatus[record.inspected]}</span>;
        }
        return <span>{inspectionStatus[record.inspected]}</span>;
      }
    },
    {
      title: "代办人",
      dataIndex: "paymentProcessor",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("paymentProcessor"),
      render: (__, record) => record.paymentProcessor || "--"
    },
    {
      title: "递交状态",
      dataIndex: "is_examine_submit",
      valueEnum: examineSubmit,
      filters: false,
      render: (__, record) =>
        record.is_examine_submit === 1
          ? "已递交"
          : record.is_examine_submit === 2
            ? "待递交"
            : "已递交",
      hideInSearch: !TABLE_COLUMNS[table]?.includes("is_examine_submit"),
      hideInTable: !TABLE_COLUMNS[table]?.includes("is_examine_submit")
    },
    {
      title: "材料",
      key: "documents",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("documents"),
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
      title: "退回时间",
      dataIndex: "finance_return_time",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("financeReturnTime")
    },
    {
      title: "退回理由",
      dataIndex: "finance_return_reason",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("financeReturnReason")
    },
    {
      title: "操作",
      key: "actions",
      hideInSearch: true,
      hideInTable: !TABLE_COLUMNS[table]?.includes("actions"),
      render: (__, record) => (
        <div className={styles.actionCell}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow(record);
              setIsDetailedModalOpen(true);
            }}
          >
            查看个体信息
          </Button>
          {hasAction(table, RECORD_ACTIONS.TOGGLE_INSPECTED) && (
            <Button
              type="link"
              style={{ color: record.inspected ? "red" : "#1890ff" }}
              onClick={() => {
                Modal.confirm({
                  content: `确认${record.inspected ? "取消复核" : "复核"}"${
                    record.contractor
                  }申报的${record.category}"?`,
                  onOk: async () => {
                    try {
                      const result = await toggleInspected(record.id);
                      if (result?.code === 0) {
                        message.success("标记操作成功!");
                        tableRef.current.reload();
                      } else {
                        throw new Error(result?.msg);
                      }
                    } catch (e) {
                      message.error(`标记操作失败: ${e.message}`);
                    }
                  }
                });
              }}
            >
              {record.inspected ? "取消复核" : "复核"}
            </Button>
          )}
          {record.town_reject_reason && hasAction(table, RECORD_ACTIONS.SKIP_THE_PUBLIC) ? (
            <Button
              type="link"
              style={{ color: "#1890ff" }}
              onClick={() => {
                Modal.confirm({
                  content: `确认将此条记录跳过公示期吗?`,
                  onOk: async () => {
                    try {
                      const result = await startPublicityToTown(record.id);
                      if (result?.code === 0) {
                        message.success("操作成功!");
                        tableRef.current.reload();
                      } else {
                        throw new Error(result?.msg);
                      }
                    } catch (e) {
                      message.error(`操作失败: ${e.message}`);
                    }
                  }
                });
              }}
            >
              跳过公示期
            </Button>
          ) : null}
          {(record.submitter >= 0 || table === CLAIM_RECORD_TABLES.PENDING_APPROVAL) &&
          hasAction(table, RECORD_ACTIONS.REJECT) &&
          record.adminId === 0 ? (
            <>
              <Button
                type="link"
                onClick={() => {
                  setSelectedRow(record);
                  setIsRejectionModalOpen(true);
                }}
              >
                {record.finance_return_type === 1 ? "驳回村里" : "驳回"}
              </Button>

            </>


          ) : null}
          {
            (table === CLAIM_RECORD_TABLES.FINANCIAL_BACK) && (
              <Button
                type="link"
                onClick={async () => {
                  console.log(record)
                  const user = JSON.parse(localStorage.getItem('userInfo') as string) || {};
                  const { code, msg } = await townFinanceRejectDeclaresAllTown({
                    town_id: user.town_id ?? 0,
                    id: record.id
                  });
                  if (code&&code === 0) {
                    message.success('已退回!');
                    tableRef.current.reload();
                  } else {
                    message.error(`退回镇失败: ${msg}!`);
                  }
                }}
              >
                退回镇里
              </Button>
            )
          }
          {hasAction(table, RECORD_ACTIONS.APPROVE) ? (
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认审批通过${record.contractor}申报的${record.category}`,
                  onOk: async () => {
                    try {
                      await approveClaim(record.id);
                      message.success("审核通过成功!");
                      tableRef.current.reload();
                    } catch (e) {
                      // message.error(...)
                    }
                  }
                });
              }}
            >
              通过
            </Button>
          ) : null}
          {record.submitter > 0 && hasAction(table, RECORD_ACTIONS.MODIFY) ? (
            <Button
              type="link"
              onClick={() => {
                setIsClaimModificationModalOpen(true);
                setSelectedRow(record);
              }}
            >
              修改
            </Button>
          ) : null}
          {hasAction(table, RECORD_ACTIONS.RETRACT) ? (
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认取消公示${record.contractor}申报的${record.category}?`,
                  onOk: async () => {
                    try {
                      await retractClaim(record.id);
                      message.success("取消公示成功!");
                      tableRef.current.reload();
                    } catch (e) {
                      // message.error(...)
                    }
                  }
                });
              }}
            >
              取消公示
            </Button>
          ) : null}
          {record.submitter > 0 && hasAction(table, RECORD_ACTIONS.DELETE) ? (
            <Button
              type="link"
              onClick={() => {
                setSelectedRow(record);
                Modal.confirm({
                  content: `确认取消${record.contractor}申报的${record.category}?`,
                  onOk: () => {
                    console.log(record);
                    deleteClaim({
                      id: record.id,
                      crops_name: record.crops, // 种植作物名称
                      scale_name: record.category, // 补贴项目名称
                      area_name: record.regionString // 所属区域
                    }).then((e) => {
                      // 取消申报会失败
                      if (e?.code === 0) {
                        message.success(`${e?.msg}`);
                      } else {
                        message.error(`${e?.msg}`);
                      }
                      tableRef.current.reload();
                    });
                  }
                });
              }}
            >
              取消申报
            </Button>
          ) : null}
          {hasAction(table, RECORD_ACTIONS.REQUEST_MODIFICATION) &&
          record.canRequestModification === 0 &&
          record.status === 1 ? (
            <Button
              type="link"
              onClick={() => {
                setSelectedRow(record);
                setIsRequestModificationModalOpen(true);
              }}
            >
              申请修改
            </Button>
          ) : null}
          {hasAction(table, RECORD_ACTIONS.EDIT) && record.adminId > 0 ? (
            <div style={{ textAlign: "center" }}>
              <div>
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedRow(record);
                    handleDeclareImportModal(true);
                  }}
                >
                  编辑
                </Button>
              </div>
              <div>
                <Button
                  type="link"
                  style={{ color: "#cf1322" }}
                  onClick={() => {
                    Modal.confirm({
                      content: `确认删除${record.contractor}申报的${record.category}?`,
                      onOk: async () => {
                        try {
                          await deleteImport(record.id);
                          message.success("删除成功!");
                          tableRef.current.reload();
                        } catch (e) {
                          // message.error(...)
                        }
                      }
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )
    }
  ];

  // 获取所有的数据
  const getAllData = () => {
  };
  // FIXME: memory leak
  const loadData = async (rawParams) => {
    setLoading(true);
    const params = {
      region: region,
      ...rawParams,
      year: rawParams.year && moment(rawParams.year).year(),
      crops: rawParams.crops,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize
    };
    Object.entries(params).forEach(([key]) => {
      if (
        !(
          TABLE_COLUMNS[table]?.includes(key) ||
          ["pageNum", "pageSize", "_timestamp"]?.includes(key)
        )
      ) {
        params[key] = undefined;
      }
    });
    try {
      let result;
      let newParams = {};
      let isExpandable = false;
      let idFieldNames = ["id"];
      switch (table) {
        // 村级
        case CLAIM_RECORD_TABLES.PENDING_VALIDATION: {
          newParams = {
            ...params,
            type: 0
          };
          result = await getClaimRecordsForVillageOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.POSTED: {
          newParams = {
            ...params,
            type: 1
          };
          result = await getClaimRecordsForVillageOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.SUBMITTED: {
          newParams = {
            ...params,
            type: 2
          };
          result = await getClaimRecordsForVillageOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.REJECTED: {
          newParams = {
            ...params
          };
          result = await getRejectedClaimRecordsForVillageOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.TRANSACTION_HISTORY: {
          newParams = {
            ...params
          };
          console.log('打款记录')
          result = await getTransactionHistoryForVillageOfficials(newParams);
          break;
        }
        // 镇级
        case CLAIM_RECORD_TABLES.PENDING_VALIDATION_VIEW_ONLY: {
          newParams = {
            ...params
          };
          result = await getPendingClaimsForTownOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.TOWN_ANNOUNCEMENT: {
          // 镇公示中
          newParams = {
            ...params
          };
          result = await getTownAnnouncement(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.PENDING_APPROVAL: {
          newParams = {
            ...params,
            // region: selectedRegion,
            type: 1
          };
          result = await getClaimsForTownOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.APPROVED: {
          newParams = {
            ...params,
            // region: selectedRegion,
            expandableView: true,
            type: 2
          };
          isExpandable = true;
          idFieldNames = ["subsidy_id", "id"];
          result = await getClaimsForTownOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.FINANCIAL_BACK: {
          newParams = {
            ...params,
            // region: selectedRegion,
            type: 2,
            status: 4
          };
          result = await getClaimsForTownOfficials(newParams);
          break;
        }
        // 市级
        case CLAIM_RECORD_TABLES.PENDING_VIEW_ONLY: {
          newParams = {
            ...params,
            // region: selectedRegion,
            type: 1,
            isApproved: 1
          };
          result = await getClaimsForCityOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.PENDING_APPROVAL_VIEW_ONLY: {
          newParams = {
            ...params,
            // region: selectedRegion,
            type: 2,
            isApproved: 1
          };
          result = await getClaimsForCityOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.APPROVED_VIEW_ONLY: {
          newParams = {
            ...params,
            expandableView: true,
            // region: selectedRegion,
            type: 3,
            isApproved: 2
          };
          isExpandable = true;
          idFieldNames = ["subsidy_id", "id"];
          result = await getClaimsForCityOfficials(newParams);
          break;
        }
        case CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY: {
          newParams = {
            ...params,
            // region: selectedRegion,
            type: 4,
            isApproved: 1
          };
          result = await getClaimsForCityOfficials(newParams);
          break;
        }
        // 市级
        default:
          break;
      }
      if (result?.code !== 0) {
        throw new Error(result?.msg);
      }
      // 加载完成
      setLoading(false);
      setStoredParams(newParams);
      const { data, ...sourceData } = result.data.data;
      const transformed: any[] = [];
      const transform = (e, idFieldName, level) => ({
        id: e[idFieldName] ?? "id",
        rid: `L${level}::${e[idFieldName]}`,
        cumulativeSize: e.plot_area,
        cumulativeMetricSize: e.plot_area_m,
        household_type: e.household_type,
        contractor: e.real_name,
        createdAt: e.declare_time,
        phoneNumber: e.mobile,
        regionString: e.area_name,
        category: e.scale_name,
        categoryPath: [e.scale_parent_id, e.scale_id],
        ownershipType: e.subsidy_type,
        crops: e.crops_name,
        contractedArea: e.circulation_area,
        year: e.year,
        season: e.season,
        amount: e.subsidy_amount,
        status: e.is_adopt,
        reasonForRejection: e.reject_reason || e.town_reject_reason, // TODO: 还是拆开吧
        documents: e.file_id_url ? [{ url: e.file_id_url, id: e.file_id || "" }] : e.stuff_url,
        stuff_url: e.stuff_url, // 图片
        entityId: e.subsidy_id,
        submitter: e.declare_admin_id,
        // 公示中
        postingClosingDate: e.publicity_end,
        // 公示完成
        canRequestModification: e.is_allow,
        // 已驳回
        dateOfRejection: e.reject_time,
        // 打款记录
        paymentStatus: e.payment_status,
        // 镇级
        regionPath: [e.city_id, e.town_id, e.village_id],
        modRequestStatus: e.is_allow,
        dateRequested: e.declare_update_time,
        reasonForModification: e.update_reason,
        inspected: e.is_check,
        paymentProcessor: e.agency_name,
        finance_return_time: e.finance_return_time,
        finance_return_reason: e.finance_return_reason,
        finance_return_type: e.finance_return_type,
        town_reject_reason: e.town_reject_reason,
        check_time: e.check_time,
        payment_time: e.payment_time,
        adminId: e.admin_id,
        identity: e.identity,
        cropsId: e.crops_id,
        actualSize:
          e.household_type === 1
            ? _.round(Math.min(e.circulation_area, e.plot_area), 1)
            : _.round(e.plot_area, 1)
      });
      data.forEach((e, i) => {
        transformed[i] = transformTreeData(
          e,
          [
            { name: "cumulativeSize", op: "sum" },
            { name: "cumulativeMetricSize", op: "sum" },
            {
              name: "regionString",
              op: "nop",
              options: { emptySymbol: findRegionNames(regions, params.region).join("/") }
            },
            { name: "year", op: "pickFirst" },
            { name: "category", op: "ancestors", options: { dict: catPathDict } },
            { name: "crops", op: "unique" },
            { name: "contractedArea", op: "sum" },
            { name: "season", op: "unique", options: { enum: seasons } },
            { name: "amount", op: "sum" }
          ],
          idFieldNames,
          transform,
          "list"
        );

        // transformed[i] = transform(e, idFieldNames[0]);
        // transformed[i].children = (e.list || undefined) && e.list.map((c) => transform(c, idFieldNames[1]));
      });
      // @ts-ignore
      const transformedResult = tableDataHandle({
        code: result?.code,
        data: { ...sourceData, data: transformed }
      });
      if (isMounted.current) {
        const no:any = result.data?.total;
        if (Object.prototype.toString.call(no) === '[object Array]') {
          setStats(no?.[0]);
        }
        if (Object.prototype.toString.call(no) === '[object Object]') {
          setStats(no);
        }
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      console.error(`申报数据读取失败: ${e?.message}`);
      // 加载完成
      setLoading(false);
      return tableDataHandle({
        code: 0,
        data: [],
        pagination: {
          page: 1,
          item_total: 0,
          page_count: 1,
          page_total: 1
        }
      });
    }
  };

  useEffect(() => {
    tableRef.current?.reset();
    tableRef.current?.reload();
  }, [table]);

  return (
    <>
      <ProTable
        className={styles.customTable}
        actionRef={tableRef}
        formRef={formRef}
        request={loadData}
        columns={tableColumns}
        rowKey="rid"
        options={false}
        loading={loading}
        tableExtraRender={() => (
          <div className={styles.headerRow}>
            {/* 此处在数组中添加 CLAIM_RECORD_TABLES.TRANSACTION_HISTORY 则**打款记录页面**不显示以下【户数 面积 资金】内容 */}
            {![CLAIM_RECORD_TABLES.REJECTED]?.includes(table) && (
              <div className={styles.stats}>
                {`户数: ${stats.total_num ?? "?"}户    面积: ${
                  _.round(stats.total_plot_area ?? 0, 1) ?? "?"
                }亩    资金: ${_.round(stats.total_subsidy_amount ?? 0, 2) ?? "?"}元`}
              </div>
            )}
            {table === CLAIM_RECORD_TABLES.PENDING_VALIDATION && ( // 村级
              <PrepareDraftButton
                storedParams={storedParams}
                regionTree={regions}
                userRegionPath={region}
                catTree={catTree}
                mainTableRef={tableRef}
                successCb={() => {
                  tableRef.current?.reload();
                }}
              />
            )}
            {table === CLAIM_RECORD_TABLES.PENDING_APPROVAL && ( // 镇级
              <PrepareSubmissionButton
                regionTree={regions}
                userRegionPath={region}
                catTree={catTree}
                mainTableRef={tableRef}
              />
            )}
            {/*
            2022-01-24  add:一件驳回功能 镇
            */}
            {(table === CLAIM_RECORD_TABLES.FINANCIAL_BACK) && (
              <>
                <Button
                  onClick={() => {
                    Modal.confirm({
                      content: "一键退回后，镇可以在待审核列表继续递交财政",
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        const user = JSON.parse(localStorage.getItem("userInfo") as string) || {};
                        try {
                          await townFinanceRejectDeclaresAllTown({ town_id: user.town_id??0, id: 0 });
                          message.success("已全部退回!");
                          tableRef.current.reload();
                        } catch (e) {
                          message.error(new Error(`一键退回镇失败: ${e.message}!`));
                        }
                      }
                    });
                  }}
                >
                  一键退回镇
                </Button>
                <Button
                  onClick={() => {
                    Modal.confirm({
                      content: "一键驳回后，村可以在待公示列表继续公示或跳过公示",
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        const user = JSON.parse(localStorage.getItem("userInfo")) || {};
                        try {
                          await townFinanceRejectDeclaresAll({ town_id: user.town_id, id: 0 });
                          message.success("已全部驳回!");
                          tableRef.current.reload();
                        } catch (e) {
                          message.error(new Error(`驳回失败: ${e.message}!`));
                        }
                      }
                    });
                  }}
                >
                  一键驳回村
                </Button>
              </>
            )}
            {/*
            2022-01-24  add:一件驳回功能 市
            */}
            {
              table === CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY && (
                <Button
                  type="link"
                  onClick={() => {
                    Modal.confirm({
                      content: "确认要一键驳回当前搜索条件下的页面申报数据",
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        const user = JSON.parse(localStorage.getItem("userInfo")) || {};
                        try {
                          await townFinanceRejectDeclaresAll({ town_id: user.town_id, id: 0 });
                          message.success("已全部驳回!");
                          tableRef.current.reload();
                        } catch (e) {
                          message.error(new Error(`驳回失败: ${e.message}!`));
                        }
                      }
                    });
                  }}
                >
                  一键驳回
                </Button>
              )
            }
            <ExportButton
              exportType="claim-management"
              isLoading={loading}
              tableType={table}
              params={storedParams}
            />
          </div>
        )}
        expandable={{
          expandedRowRender: () => <span />,
          rowExpandable: (record) => record.children?.length
        }}
      />
      <ClaimRejectionModal
        visible={isRejectionModalOpen}
        type={rejectionModalType}
        context={selectedRow}
        cancelCb={() => setIsRejectionModalOpen(false)}
        successCb={() => {
          setIsRejectionModalOpen(false);
          tableRef.current?.reload();
        }}
      />
      <ClaimantDetailsModal
        visible={isDetailsModalOpen}
        context={selectedRow}
        cancelCb={() => setIsDetailedModalOpen(false)}
        // successCb={() => setIsDetailedModalOpen(false)}
      />
      <DocumentPreviewModal
        visible={isPreviewModalOpen}
        context={selectedRow}
        cancelCb={() => setIsPreviewModalOpen(false)}
      />
      <RequestModificationModal
        visible={isRequestModificationModalOpen}
        context={selectedRow}
        cancelCb={() => setIsRequestModificationModalOpen(false)}
        successCb={() => {
          setIsRequestModificationModalOpen(false);
          tableRef.current?.reload();
        }}
      />
      <ClaimModificationFormModal
        visible={isClaimModificationModalOpen}
        context={selectedRow}
        cancelCb={() => setIsClaimModificationModalOpen(false)}
        successCb={() => {
          setIsClaimModificationModalOpen(false);
          tableRef.current?.reload();
        }}
        regionTree={regions}
        categoryTree={catTree}
      />
      {declareImportModal ? (
        <DeclareImportModal
          visible={declareImportModal}
          context={selectedRow}
          categoryTree={catTree}
          cancelCb={() => handleDeclareImportModal(false)}
          successCb={() => {
            handleDeclareImportModal(false);
            tableRef.current?.reload();
          }}
        />
      ) : null}
    </>
  );
}

export default ClaimRecordTable;
