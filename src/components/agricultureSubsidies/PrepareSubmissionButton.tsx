/* eslint-disable no-unused-vars */
import React, {
  useEffect, useMemo, useRef, useState
} from "react";
import {
  Button, Cascader, DatePicker, message, Modal, Select, Space, Table,
  Popover

} from "antd";

import { QuestionCircleOutlined } from "@ant-design/icons";
import ProTable, { ActionType } from "@ant-design/pro-table";
import {
  CLAIM_RECORD_TABLES,
  eligibility,
  isModificationRequested,
  ownershipTypes,
  seasons
} from "@/pages/agricultureSubsidies/consts";
import moment from "moment";
import { prepareList, submitList, submitListNew } from "@/services/agricultureSubsidies";
import { tableDataHandle, accAdd } from "@/utils/utils";
import {
  downloadDocumentsAsZipFile,
  renderCell,
  traverseTree
} from "@/pages/agricultureSubsidies/utils";
import { FormInstance } from "antd/es/form";
import DocumentPreviewModal from "@/components/agricultureSubsidies/DocumentPreviewModal";
import { CascaderOptionType } from "antd/es/cascader";
import _, { indexOf } from "lodash";
import usePaymentProcessors from "@/components/agricultureSubsidies/usePaymentProcessors";
import { StatsType } from "@/pages/agricultureSubsidies/types";
import styles from "./PrepareSubmissionButton.less";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { time } from "signale";
import lodash from "lodash";

const { confirm } = Modal;

type TreeObject = {
  value: string | undefined;
  label: string;
  children: TreeObject[];
};

type DraftPreparationModalProps = {
  regionTree: TreeObject[];
  userRegionPath: string[];
  catTree: CascaderOptionType[];
  mainTableRef: React.MutableRefObject<ActionType>;
  mountedAt?: HTMLElement;
};

function PrepareSubmissionButton({
                                   regionTree,
                                   userRegionPath,
                                   selectedCategory,
                                   catTree,
                                   mainTableRef,
                                   mountedAt
                                 }: DraftPreparationModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>({});
  const [stats, setStats] = useState<StatsType>({});
  const isMounted = useRef(true);
  // request初次请求不按initialValue
  const [year] = useState(moment().startOf("year"));
  // const [season, setSeason] = useState(getCurrentSeason());
  const [categories, setCategories] = useState<any>();
  const [season, setSeason] = useState<any>(1);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentViewParams, setCurrentViewParams] = useState({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [regionPath] = useState(userRegionPath.slice(0, 2));
  const [ownershipType, setOwnershipType] = useState("1");
  const [paymentProcessorOptions, paymentProcessorFunc] = usePaymentProcessors();
  const [selectedProcessor, setSelectedProcessor] = useState();
  const [initialized, setInitialized] = useState(false);
  const [selectValues, setSelectValues] = useState([]);
  // 批量提交筛选到的源数据
  const [sourceData, setSourceData] = useState([]);
  const [baseData, setBaseData] = useState([]);
  // 需要递交的数据统计
  const [statistics, setStatistics] = useState({});
  // 面积筛选
  const [areaCondition, setAreaCondition] = useState("");
  // 是否被标记
  const [mark, setMark] = useState("");
  const [searchParams, setSearchParams] = useState({});
  // const subCategoryList = useMemo(() => {
  //   const list: TreeObject[] = [];
  //   catTree.forEach((e) => list.push(...(e.children)));
  //   // setCategories([list.map((e) => e.value)]);
  //   setCategories(list[0]?.value);
  //   setInitialized(true);
  //   return list;
  // }, [catTree]);
  const childfreeRegionTree = useMemo(() => regionTree.map((c) => ({
    ...c,
    children: c.children.map((t) => {
      const { children, ...town } = t;
      return town;
    })
  })), [regionTree]);
  const useExpandableView = useMemo(() => categories?.[0] === 1, [categories]); // FIXME: ！

  useEffect(() => {
    if (catTree) {
      setCategories(selectedCategory || [catTree[0]?.value, catTree[0]?.children?.[0]?.value]);
      setInitialized(true); // delay initial loadData
    }
    return () => {
      if (catTree) {
        setInitialized(false);
      }
    };
  }, [catTree, selectedCategory]);

  const columns = [
    // {
    //   title: '序号',
    //   hideInSearch: true,
    //   dataIndex: 'subsidyId',
    //   hideInTable: true
    // },
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
      width: 80
    },
    {
      title: "承包人",
      dataIndex: "contractor",
      hideInSearch: true,
      width: 80
    },
    {
      title: "电话",
      dataIndex: "phoneNumber",
      hideInSearch: true,
      render: (_, record) => (
        <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/, "$1****$2") : ""}</span>
      ),
      width: 120
    },
    {
      title: "所属地区",
      key: "regionPath",
      hideInTable: true,
      renderFormItem: () => (
        <Cascader
          getPopupContainer={() => window.document.body}
          options={childfreeRegionTree}
          changeOnSelect
          allowClear={false}
          // disabled
          // defaultValue={userRegionPath}
        />
      )
    },
    {
      title: "所属地区",
      dataIndex: "region",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "region", "nop", { emptySymbol: traverseTree(childfreeRegionTree, formRef.current?.getFieldValue("regionPath"), "value", "label").join("/") })),
      width: 120
    },
    {
      title: "申报面积(亩)",
      dataIndex: "cumulativeSize",
      hideInSearch: true,
      render: (__, record) => (_.round(renderCell(record, "cumulativeSize", "sum"), 1)),
      width: 80
    },
    {
      title: "承包流转面积(亩)",
      dataIndex: "contractedArea",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "contractedArea", "sum")),
      width: 100
    },
    {
      title: "补贴面积(亩)",
      dataIndex: "actualSize",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "actualSize", "sum")),
      width: 100
    },
    {
      title: "补贴金额",
      dataIndex: "amount",
      hideInSearch: true,
      render: (__, record) => (_.round(renderCell(record, "amount", "sum"), 2)),
      width: 80
    },
    {
      title: "种植作物",
      dataIndex: "crops",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "crops", "unique")),
      width: 80
    },
    {
      title: "性质",
      dataIndex: "ownershipType",
      valueEnum: ownershipTypes,
      fieldProps: { allowClear: false },
      filters: false,
      width: 80
    },
    {
      title: "年份",
      dataIndex: "year",
      renderFormItem: () => (
        <DatePicker picker="year" allowClear={false} />
      ),
      render: (__, record) => (renderCell(record, "year", "pickFirst", { emptySymbol: "--" })),
      width: 120
    },
    {
      title: "季节",
      dataIndex: "season",
      valueEnum: seasons,
      render: (__, record) => (renderCell(record, "season", "unique", { enum: seasons })),
      filters: false,
      width: 80
    },
    {
      title: "补贴项目",
      dataIndex: "categories",
      // initialValue: selectedCategory || [catTree[0]?.value, catTree[0]?.children?.[0]?.value],
      renderFormItem: () => (
        <Cascader
          options={catTree}
          value={categories}
          onChange={(v) => setCategories(v)}
          allowClear={false}
        />
      ),
      render: (__, record) => (renderCell(record, "categories", "pickFirst", { emptySymbol: "--" })),
      width: 120
    },
    // {
    //   title: '面积(m²)',
    //   dataIndex: 'cumulativeMetricSize',
    //   hideInSearch: true,
    //   render: (__, record) => (_.round(renderCell(record, 'cumulativeMetricSize', 'sum'), 1)),
    // },
    {
      title: "合计面积(亩)",
      dataIndex: "totalArea",
      hideInSearch: true,
      width: 80,
      hideInTable: _.last(categories) !== 6 || season == 1
    },
    {
      title: "一次性补贴面积(亩)",
      dataIndex: "singleSubsidy",
      hideInSearch: true,
      width: 130,
      hideInTable: _.last(categories) !== 6 || season == 1
    },
    {
      title: "应补差额",
      dataIndex: "priceDiff",
      hideInSearch: true,
      width: 80,
      hideInTable: _.last(categories) !== 6 || season == 1
    },
    {
      title: "最终补贴金额",
      dataIndex: "finalSubsidyAmount",
      hideInSearch: true,
      width: 100,
      hideInTable: _.last(categories) !== 6 || season == 1
    },
    {
      title: "申报时间",
      dataIndex: "createdAt",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "createdAt", "nop", { emptySymbol: "--" })),
      width: 120
    },
    {
      title: "申请修改状态",
      dataIndex: "modRequestStatus",
      render: (__, record) => {
        if (record.modRequestStatus === 1) {
          return <span style={{ color: "red" }}>{renderCell(record, "modRequestStatus", "nop", {
            enum: isModificationRequested,
            emptySymbol: "--"
          })}</span>;
        }
        return renderCell(record, "modRequestStatus", "nop", { enum: isModificationRequested, emptySymbol: "--" });
      },
      hideInSearch: true,
      width: 100
    },
    {
      title: "申请修改时间",
      dataIndex: "dateRequested",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "dateRequested", "nop", { emptySymbol: "--" })),
      width: 100
    },
    {
      title: "申请修改理由",
      dataIndex: "reasonForModification",
      hideInSearch: true,
      render: (__, record) => (renderCell(record, "reasonForModification", "nop", { emptySymbol: "--" })),
      width: 100
    },
    // {
    //   title: '面积筛选',
    //   dataIndex: 'eligible',
    //   valueEnum: eligibility,
    //   hideInTable: true,
    // },
    {
      title: "材料下载",
      key: "documents",
      hideInSearch: true,
      width: 100,
      render: (__, record) => (
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
            <Button type="link" size="small" onClick={() => downloadDocumentsAsZipFile(record)}
                    disabled={!(record.documents?.length > 0)}>
              下载
            </Button>
          </>
        )
      )
    },
    {
      title: "操作",
      dataIndex: "eligible",
      hideInSearch: true,
      width: 200,
      render: (__, record) => {
        let arr = selectValues.map((item) => {
          return item.id;
        });
        if (record.subsidyId) {
          return (
            arr.indexOf(record.id) > -1 ? (
              <div style={{ color: "red", cursor: "pointer" }} onClick={() => removeSelected(record)}>取消标记</div>
            ) : (
              <div style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => addSelected(record)}>标记</div>
            )
          );
        } else {
          return "";
        }

      }
    }
  ];
  const addSelected = (record) => {
    let arr = [...selectValues, record];
    setSelectValues(arr);

    setTimeout(() => {
      formatData(baseData.data, arr);
    }, 60);
  };
  const removeSelected = (record) => {
    let arr = [];
    selectValues.map((item, index) => {
      if (item.id != record.id) {
        arr.push(item);
      }
    });
    setSelectValues(arr);
    setTimeout(() => {
      formatData(baseData.data, arr);
    }, 60);
  };
  // FIXME: memory leak
  const loadData = async (rawParams) => {
    if (searchParams) {
      rawParams = lodash.cloneDeep(searchParams);
    }
    setSubmitDisabled(true);
    setSelectedProcessor(undefined);
    setSeason(rawParams.season);
    // if (areaCondition == "" || mark === "") {
    // }

    if (areaCondition == "" && mark == "") {
      try {

        const params = {
          year: (rawParams.year && moment(rawParams.year).year()) ?? year.year(),
          season: rawParams.season ?? formRef.current?.getFieldValue("season"),
          categories: _.last(categories),
          region: rawParams.regionPath ?? regionPath,
          ownershipType: rawParams.ownershipType ?? ownershipType,
          // isEligible: rawParams.eligible ?? formRef.current?.getFieldValue('eligible'), // pro-table的bug, 初次请求没用到initialValue
          useExpandableView
        };
        const result = await prepareList(params);
        if (result.code !== 0) {
          throw new Error(result.msg);
        }
        setCurrentViewParams(params);
        const transformed: any[] = [];
        const transform = (e, idField) => ({
          // id: idField === 'subsidy_id' ? e[idField] + '-' + e[idField] : e.subsidy_id + '-' + e[idField],
          id: e[idField],
          subsidyId: e.subsidy_id,
          cumulativeSize: e.plot_area,
          cumulativeMetricSize: e.plot_area_m,
          contractor: e.real_name,
          createdAt: e.declare_time,
          phoneNumber: e.mobile,
          region: e.area_name,
          categories: e.scale_name,
          ownershipType: e.subsidy_type,
          crops: e.crops_name,
          contractedArea: e.circulation_area,
          year: e.year,
          season: e.season,
          amount: e.subsidy_amount,
          status: e.is_adopt,
          response: e.town_reject_reason,
          documents: e.stuff_url,
          // entityId: e.subsidy_id,
          submitter: e.declare_admin_id,
          modRequestStatus: e.is_allow,
          dateRequested: e.declare_update_time,
          reasonForModification: e.update_reason,
          actualSize: e.household_type === 1 ? _.round(Math.min(e.circulation_area, e.plot_area), 1) : _.round(e.plot_area, 1)
        });
        console.log("result.data.data", result.data.data);
        result.data.data.forEach((e, i) => {
          const hasChildren = Array.isArray(e.list) && e.list.length > 0;
          const newObject: any = {};
          if (hasChildren) {
            if (e.list.length > 1) {
              let id_arr: any = [];
              e.list.map(c => {
                c.subsidy_id = "";
                id_arr.push(c.id);
              });
              newObject.idArr = id_arr;
              newObject.children = e.list.map((c) => transform(c, "id"));
              Object.assign(newObject, transform(e, "subsidy_id"));
            } else {
              Object.assign(newObject, transform(e.list[0], "id"));
            }
          } else {
            Object.assign(newObject, transform(e, "subsidy_id"));
          }
          newObject.totalArea = accAdd(_.round(renderCell(newObject, "actualSize", "sum"), 1), e.disposable_info.disposable_plot_area);
          newObject.singleSubsidy = e.disposable_info.disposable_subsidy_area;
          newObject.priceDiff = _.round((newObject.totalArea - newObject.singleSubsidy) * e.disposable_info.disposable_subsidy_area_unit, 1);
          newObject.finalSubsidyAmount = newObject.singleSubsidy > 0 ? _.round(accAdd(renderCell(newObject, "amount", "sum"), newObject.priceDiff), 1) : renderCell(newObject, "amount", "sum");
          transformed[i] = newObject;
        });
        // @ts-ignore
        const transformedResult = tableDataHandle({
          code: result.code,
          data: { data: transformed }
        });
        // update processors
        paymentProcessorFunc.setContext(params.ownershipType, _.last(traverseTree(catTree, categories, "value", "label")) ?? "");
        if (isMounted.current) {
          if (result.data?.total?.[0]) {
            setStats(result.data?.total?.[0]);
          }
          if (transformedResult.data.length > 0 && !rawParams?.season) {
            setSubmitDisabled(false);
          } else {
            if (categories[0] == 1) {
              setSubmitDisabled(false);
            } else {
              // if(rawParams.season == '2') {
              //   setSubmitDisabled(false);
              // } else {
              //   setSubmitDisabled(true);
              // }
              setSubmitDisabled(false);
            }
          }
          // // setSubmitDisabled(!(transformedResult.data.length > 0));
          // 批量提交的源数据
          setSourceData(transformedResult);
          setBaseData(transformedResult);
          if (areaCondition !== 0 && mark !== 0) { // 这块的逻辑瞎动会出问题
            setSelectValues([]);

            formatData(transformedResult.data, []);
            console.log("--formatData--", areaCondition, mark);
          }

          return transformedResult;
        }
        return undefined;
      } catch (e) {
        message.error(`申报数据读取失败: ${e.message}`);
        setSubmitDisabled(true);
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
    } else {
      // 过滤数据 模拟异步 统一用户体验
      return loadLocalData();
    }

  };
  // 加载本地数据
  const loadLocalData = () => {
    const p = new Promise((resolve, reject) => {
      let idArr = selectValues.map(item => item.id);
      let submitData = [];
      baseData.data && baseData.data.map(val => {
        // 期望提交数据
        !idArr.includes(val.id) && (submitData.push(val));
      });
      if (submitData.length > 0) {
        setSubmitDisabled(false);
      }
      setTimeout(() => {
        resolve(sourceData);
      }, 200);
    });
    return p;
  };

  useEffect(() => {
    if (isModalVisible && initialized) {
      tableRef.current?.reload();
    }
  }, [isModalVisible]);
  useEffect(() => {
    filterSourceData();
  }, [areaCondition, mark]);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);
  // 计算未被标记的总数 sourceData/transformedResult.data 源数据 selectValues 标记的数据
  const formatData = (sourceData_, arr) => {
    let houseCount = 0; // 户数
    let areaCount = 0; // 面积
    let fundsCount = 0; // 资金
    let a = arr.map(item => {
      return item.id;
    });
    sourceData_?.map(val => {
      if (a.indexOf(val.id) === -1) { // 未被标记
        houseCount++;
        val.totalArea && (areaCount += +val.totalArea);
        val.finalSubsidyAmount && (fundsCount += val.finalSubsidyAmount);
      }
    });
    setStatistics({
      houseCount: Math.round(houseCount * 100) / 100,
      areaCount: Math.round(areaCount * 10) / 10,
      fundsCount: Math.round(fundsCount * 100) / 100
    });
  };
  const submit = async () => {
    let arr = [];
    let a = selectValues.map(item => {
      return item.id;
    });
    sourceData.data?.map(val => {
      if (a.indexOf(val.id) > -1) { // 被标记 代码备注 20220125 传给后台的数据 是 标记过的数据 后台有 不等处理
        if (val.children && val.children.length) {
          arr = arr.concat(val.idArr);
        } else {
          arr.push(val.id);
        }
      }
    });
    // return
    setSubmitting(true);
    try {
      // (╯‵□′)╯︵┻━┻
      // if (useExpandableView && !(currentViewParams.isEligible?.toString() === '1')) {
      //   throw new Error('该补贴项目使用合并展示, 不满面积项无法通过');
      // }

      // 批量递交 除了(秋季 && 耕地地力) 其他递交改成新的
      let result;
      if (currentViewParams.season == "2" && currentViewParams.categories == 6) { // (秋季 && 耕地地力)
        result = await submitList(
          {
            ...currentViewParams,
            selectedProcessor: paymentProcessorOptions.find((e) => e.value === selectedProcessor)?.obj,
            checkarr: arr
          }
        );
      } else {
        currentViewParams.categories_parent = categories[0];
        currentViewParams.categories = categories[1];
        result = await submitListNew(
          {
            ...currentViewParams,
            selectedProcessor: paymentProcessorOptions.find((e) => e.value === selectedProcessor)?.obj,
            checkarr: arr
          }
        );
      }
      if (result.code === 0) {
        message.success("通过成功");
        setIsPreviewModalOpen(false);
        setIsModalVisible(false);
        mainTableRef.current.reload();
      } else {
        message.error(`提交失败: ${result.msg}`);
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  // 根据两个条件过滤数据
  const filterSourceData = () => {
    const base = lodash.cloneDeep(baseData);
    let baseArr = [];
    // 1、 根据面积筛选过滤数据
    if (areaCondition === 0 || areaCondition === "") {
      baseArr = lodash.cloneDeep(base.data);
    } else {
      baseArr = (base?.data?.filter && base?.data?.filter(item => {
        return (areaCondition == 1 ? (item.totalArea >= 50) : (item.totalArea < 50));
      }));
    }

    base.data = baseArr;
    if (mark != "") {
      // 2、根据是否标记筛选数据
      const idArr = selectValues.map(item => item.id);
      let filterData = [];
      if (mark === 0 || mark === "") {
        filterData = lodash.cloneDeep(base.data);
      } else {
        filterData = (baseArr?.filter && baseArr?.filter(item => {
          return (mark == 2 ? (!idArr.includes(item.id)) : (idArr.includes(item.id)));
        }));
      }
      base.data = filterData;

    }

    setSourceData(base);
    tableRef.current?.reload();
  };
  return (
    <>
      <Button type="primary" onClick={() => {
        setIsModalVisible(true);
      }}>批量递交</Button>
      <Modal
        getContainer={window.document.body}
        visible={isModalVisible}
        wrapClassName={styles.draftModalWrapper}
        onCancel={() => (setIsModalVisible(false))}
        title=" 批量递交"
        width={1450}
        footer={[
          <Button type="primary" key="submit"
                  disabled={submitDisabled || !selectedProcessor}
                  loading={submitting}
                  onClick={submit}>
            确认递交
          </Button>
        ]}
      >
        {/* <div className={styles.hint}>综合面积小于50亩的记录无法通过!</div> */}
        {initialized ? (
          <ProTable
            className={styles.customTable}
            actionRef={tableRef}
            formRef={formRef}
            request={loadData}
            columns={columns}
            form={{
              initialValues: {
                // eligible: '1',
                season: "1",
                regionPath: userRegionPath.slice(0, 2),
                ownershipType,
                year: moment().startOf("year")
              }
            }}
            scroll={{ y: 400 }}
            rowKey="id"
            options={false}
            // pagination={false}
            search={{
              defaultCollapsed: false,
              optionRender: (searchConfig, formProps, dom) => [
                <Button
                  key="reset"
                  onClick={() => {
                    setAreaCondition("");
                    setMark("");
                    setSearchParams({
                      // eligible: '1',
                      season: "1",
                      regionPath: userRegionPath.slice(0, 2),
                      ownershipType,
                      year: moment().startOf("year")
                    });
                    tableRef.current?.reset();
                  }}
                >
                  重置
                </Button>,
                <Button
                  key="search"
                  type="primary"
                  onClick={() => {
                    setAreaCondition("");
                    setMark("");
                    console.log(searchConfig.form);
                    // searchConfig.form.setFieldsValue(searchConfig.form.getFieldValue())
                    setSearchParams(searchConfig.form.getFieldValue());
                    tableRef.current?.reload();

                    // console.log(tableRef.current)
                    // loadData(searchConfig.form.getFieldValue())
                  }}
                >
                  查询
                </Button>
              ]
            }}

            tableExtraRender={() => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* 此处在数组中添加【户数 面积 资金】内容 */}
                <div className={styles.stats} style={{ paddingTop: "5px" }}>
                  {`户数: ${statistics.houseCount ?? "0"}户    面积: ${
                    statistics.areaCount ?? "0"
                  }亩    资金: ${
                    statistics.fundsCount ?? "0"
                  }元`}
                </div>
                <div className={styles.hadPoint} style={{ paddingTop: "5px" }}>
                  <Popover content={"“已标记”表示当前批次下您不想提交至乡财的名单"}>
                    <QuestionCircleOutlined />
                    <span className={styles.marginLeft20}>已标记：</span>
                    <span>户数： {selectValues.length} 户、</span>
                    <span>面积： {selectValues.reduce((pre, item) => accAdd(pre, item.totalArea ?? 0), 0)} 亩、</span>
                    <span>资金： {selectValues.reduce((pre, item) => accAdd(pre, item.finalSubsidyAmount ?? 0), 0)} 亩</span>
                  </Popover>
                </div>
                <div className={styles.region}>
                  <div className="ant-col ant-form-item-label">
                    <label>面积筛选</label>
                  </div>
                  <Select
                    className={styles.selectProcessor}
                    getPopupContainer={() => window.document.body}
                    value={areaCondition}
                    onChange={(v) => {
                      setAreaCondition(v);
                    }}
                  >
                    <Select.Option value={0}>全部</Select.Option>
                    <Select.Option value={1}>满足50亩</Select.Option>
                    <Select.Option value={2}>不满50亩</Select.Option>
                  </Select>
                </div>
                <div>
                  <div className="ant-col ant-form-item-label">
                    <label>是否被标记</label>
                  </div>
                  <Select
                    className={styles.mark}
                    getPopupContainer={() => window.document.body}
                    value={mark}
                    onChange={(v) => {
                      setMark(v);

                    }}
                  >
                    <Select.Option value={0}>不限</Select.Option>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={2}>否</Select.Option>
                  </Select>
                </div>
                <div className={styles.region}>
                  <div className="ant-col ant-form-item-label">
                    <label>选择代办人</label>
                  </div>
                  <Select
                    className={styles.selectProcessor}
                    getPopupContainer={() => window.document.body}
                    options={paymentProcessorOptions}
                    value={selectedProcessor}
                    onChange={(v) => setSelectedProcessor(v)}
                  />
                </div>
              </div>
            )}
            expandable={{
              expandedRowRender: (record) => (<span />), // dummy
              rowExpandable: (record) => record.children?.length
            }}
          />
        ) : null}
        <DocumentPreviewModal
          visible={isPreviewModalOpen}
          context={selectedRow}
          cancelCb={() => setIsPreviewModalOpen(false)}
        />
      </Modal>
    </>
  );
}

PrepareSubmissionButton.defaultProps = {
  mountedAt: window.document.body
};

export default React.memo(PrepareSubmissionButton);
