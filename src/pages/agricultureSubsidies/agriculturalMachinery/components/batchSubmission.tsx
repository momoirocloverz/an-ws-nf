/* eslint-disable no-unused-vars */
import React, {
  useEffect, useMemo, useRef, useState
} from "react";
import {
  Button, Cascader, DatePicker, message, Modal, Select, Popover

} from "antd";

import { QuestionCircleOutlined } from "@ant-design/icons";
import ProTable, { ActionType } from "@ant-design/pro-table";
import {
  ownershipTypes
} from "@/pages/agricultureSubsidies/consts";
import { toolEnum } from "../consts";
import moment from "moment";
import {
  citySubsidyMachineDeclareSubmitOperation,
  citySubsidyMachineDeclare,
  citySubsidyMachineDeclareStatistics
} from "@/services/agriculturalMachinery";
import { tableDataHandle } from "@/utils/utils";
import {
  renderCell,
  traverseTree
} from "@/pages/agricultureSubsidies/utils";
import { FormInstance } from "antd/es/form";
import DocumentPreviewModal from "@/components/agricultureSubsidies/DocumentPreviewModal";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import _ from "lodash";
import usePaymentProcessors from "@/components/agricultureSubsidies/usePaymentProcessors";

import styles from "@/components/agricultureSubsidies/PrepareDraft.less";

type TreeObject = {
  value: string | undefined;
  label: string;
  children: TreeObject[];
};

type DraftPreparationModalProps = {
  regionTree: TreeObject[];
  userRegionPath: string[];
  selectedCategory: any;
  catTree: CascaderOptionType[];
  mainTableRef: React.MutableRefObject<ActionType>;
  mountedAt?: HTMLElement;
};

function batchSubmission({
                           regionTree,
                           userRegionPath,
                           selectedCategory,
                           catTree,
                           mainTableRef,
                           mountedAt
                         }: DraftPreparationModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableRef = useRef<ActionType>();
  const [detail, setDetail]:any = useState({});
  const formRef = useRef<FormInstance>({});
  const isMounted = useRef(true);
  // request初次请求不按initialValue
  const [year] = useState(moment().startOf("year"));
  const [categories, setCategories] = useState<any>();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentViewParams, setCurrentViewParams]:any = useState({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [regionPath] = useState(userRegionPath.slice(0, 2));
  const [ownershipType, setOwnershipType] = useState("1");
  const [paymentProcessorOptions, paymentProcessorFunc] = usePaymentProcessors();
  const [selectedProcessor, setSelectedProcessor] = useState();
  const [initialized, setInitialized] = useState(false);
  const [selectValues, setSelectValues]: any = useState([]);
  // 批量提交筛选到的源数据
  const [sourceData, setSourceData]:any = useState([]);

  const childfreeRegionTree = useMemo(() => regionTree.map((c) => ({
    ...c,
    children: c.children.map((t) => {
      const { children, ...town } = t;
      return town;
    })
  })), [regionTree]);

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

  const columns:any = [
    {
      title: "补贴对象",
      dataIndex: "real_name",
      hideInSearch: true
    },
    {
      title: "性质",
      dataIndex: "subsidy_type",
      valueEnum: ownershipTypes,
      hideInSearch: true

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
          defaultValue={userRegionPath}
        />
      )
    },
    {
      title: "所属地区",
      dataIndex: "area_name",
      hideInSearch: true
    },
    {
      title: "机具类型",
      dataIndex: "terminal_type",
      align: "center",
      hideInSearch: true,
      valueEnum: toolEnum
    },
    {
      title: "性质",
      dataIndex: "ownershipType",
      valueEnum: ownershipTypes,
      fieldProps: { allowClear: false },
      filters: false,
      hideInTable: true
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
      title: "终端编号",
      dataIndex: "terminal_number",
      align: "center",
      hideInSearch: true
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
      hideInSearch: true
    },
    {
      title: "补贴面积",
      dataIndex: "subsidy_area",
      align: "center",
      hideInSearch: true
    },
    {
      title: "市级累加补贴",
      dataIndex: "addto_subsidy",
      align: "center",
      hideInSearch: true
    },
    {
      title: "省市追加补贴",
      dataIndex: "region_addto_subsidy",
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
      title: "购置总价",
      dataIndex: "purchase_price",
      align: "center",
      hideInSearch: true
    },
    {
      title: "申报时间",
      dataIndex: "created_at",
      hideInSearch: true,
      width: 120
    },
    {
      title: "补贴项目",
      key: "category",
      hideInTable: true,
      initialValue: [catTree[0]?.value, catTree[0]?.children?.[0]?.value],
      renderFormItem: () => <Cascader options={catTree} />
    },
    {
      title: "补贴项目",
      dataIndex: "scale_name",
      hideInSearch: true
    },
    {
      title: "最终补贴金额",
      dataIndex: "subsidy_amount",
      hideInSearch: true
    },
    {
      title: "操作",
      dataIndex: "eligible",
      hideInSearch: true,
      width: 200,
      render: (__, record) => {
        let arr = selectValues.map((item: any) => {
          return item.id;
        });
        if (record.subsidy_id) {
          return (
            arr.indexOf(record.id) > -1 ? (
              <div style={{ color: "red" }} onClick={() => removeSelected(record)}>取消标记</div>) : (
              <div style={{ color: "#1890ff" }} onClick={() => addSelected(record)}>标记</div>)
          );
        } else {
          return "";
        }

      }
    }
  ];
  const addSelected = (record) => {
    setSelectValues([...selectValues, record]);
  };
  const removeSelected = (record) => {
    let arr = [];
    selectValues.map((item, index) => {
      if (item.id != record.id) {
        arr.push(item);
      }
    });
    setSelectValues(arr);
  };
  // FIXME: memory leak
  const loadData = async (rawParams) => {
    setSubmitDisabled(true);
    setSelectedProcessor(undefined);
    console.log('rawParams')
    console.log(rawParams)
    try {
      const params:any = {
        year: (rawParams.year && moment(rawParams.year).year()) ?? year.year(),
        scale_id: rawParams.category ? rawParams.category[1] : "", // 补贴id: _.last(categories),
        subsidy_type: rawParams.ownershipType ?? ownershipType, // 1 个人 2 企业/合作社
        is_examine_submit: 1, //  1市级待递交 2市级递交中 3市级已递交
        type: 3, // 1 未公示 2公示中 3 公示完成
        finance_return_type: 0 // 财政退回传1 其他传0
      };
      if (rawParams.regionPath) {
        params.city_id = rawParams.regionPath[0] ?? "";
        params.town_id = rawParams.regionPath[1] ?? "";
        delete rawParams.regionPath
      }
      const detail = await citySubsidyMachineDeclareStatistics(params);
      setDetail(detail.data); // 统计详情
      const result:any = await citySubsidyMachineDeclare(params);
      if (result.code !== 0) {
        throw new Error(result.msg);
      }
      setCurrentViewParams(params);
      // @ts-ignore
      const transformedResult = tableDataHandle({
        code: result.code,
        data: { data: result.data.data }
      });

      // update processors
      console.log("rawParams");
      console.log(rawParams, ownershipType);
      paymentProcessorFunc.setContext(
        rawParams?.ownershipType ?? ownershipType,
        _.last(traverseTree(catTree, categories, "value", "label")) ?? ""
      );
      if (isMounted.current) {
        if (transformedResult.data.length > 0) {
          setSubmitDisabled(false);
        } else {
          if (categories[0] == 1) {
            setSubmitDisabled(false);
          } else {
            setSubmitDisabled(false);
          }
        }
        // // setSubmitDisabled(!(transformedResult.data.length > 0));
        // console.log('-----------------');
        // console.log(transformedResult);
        // 批量提交的源数据
        setSourceData(transformedResult);
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
  };

  useEffect(() => {
    if (isModalVisible && initialized) {
      tableRef.current?.reload();
    }
  }, [isModalVisible]);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  const submit = async () => {

    let arr:any = [];
    let a = selectValues.map(item => {
      return item.id;
    });
    sourceData.data?.map((val:any) => {
      if (a.indexOf(val.id) > -1) { // 被标记 代码备注 20220125 传给后台的数据 是 标记过的数据 后台有 不等处理
        if (val.children && val.children.length) {
          arr = arr.concat(val.idArr);
        } else {
          arr.push(val.id);
        }
      }
    });

    setSubmitting(true);
    try {
      currentViewParams.categories_parent = categories[0];
      currentViewParams.categories = categories[1];
      const params = {
        city_id: currentViewParams?.city_id ?? "", // 补贴id
        town_id: currentViewParams?.town_id ?? "", // 补贴id
        scale_id: currentViewParams?.scale_id, // 补贴id
        year: currentViewParams?.year, // 年份
        subsidy_type: currentViewParams?.subsidy_type, // 1个人 2 合作社/公司
        processor: paymentProcessorOptions.find((e) => e.value === selectedProcessor)?.obj,
        id_arr: arr
      };

      // return
      const result = await citySubsidyMachineDeclareSubmitOperation(params);

      if (result.code === 0) {
        message.success("通过成功");
        setIsPreviewModalOpen(false);
        setIsModalVisible(false);
        mainTableRef.current.reload();
      } else {
        message.error(`提交失败2: ${result.msg}`);
      }
    } catch (e) {
      message.error(`提交失败1: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
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
        width={1400}
        footer={[
          <Button
            type="primary"
            key="submit"
            disabled={submitDisabled || !selectedProcessor}
            loading={submitting}
            onClick={submit}
          >
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
                regionPath: userRegionPath.slice(0, 2),
                ownershipType,
                year: moment().startOf("year")
              }
            }}
            scroll={{ y: 400 }}
            rowKey="id"
            options={false}
            // pagination={false}
            search={{ searchText: "获取列表", collapsed: false, collapseRender: false }}
            tableExtraRender={() => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* 此处在数组中添加【户数 面积 资金】内容 */}
                <div className={styles.stats}>
                  {`户数: ${detail.count ?? "0"}户   补贴总额: ${detail.subsidy_amount ?? "0"}元`}
                </div>
                <div className={styles.hadPoint}>
                  <Popover content="“已标记”表示当前批次下您不想提交至乡财的名单">
                    <QuestionCircleOutlined />
                    <span className={styles.marginLeft20}>已标记</span>
                    <span> {selectValues.length} 户</span>
                  </Popover>
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

batchSubmission.defaultProps = {
  mountedAt: window.document.body
};

export default React.memo(batchSubmission);
