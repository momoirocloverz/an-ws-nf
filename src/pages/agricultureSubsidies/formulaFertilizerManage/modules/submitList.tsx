import { Button, Cascader, DatePicker, message, Modal, Select, Tooltip } from "antd";
import ProTable from "@ant-design/pro-table";
import React, { useEffect, useRef, useState } from "react";
import styles from "./../index.less";
import ButtonAuth from "@/components/ButtonAuth";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Moment from "moment";
import lodash from "lodash";
import {
  cityFormulaFertilizerList, cityFormulaFertilizerListSubmit,
  cityFormulaFertilizetListTotal
} from "@/services/formulaFertilizerManage";
import { tableDataHandle } from "@/utils/utils";
import { getPaymentProcessors } from "@/services/agricultureSubsidies";
// import moment from "moment";

type PropType = {
  areaList: any,
  defaultParams: any,
  natureEnum: {},
  cropEnum: {},
  visible: boolean,
  onCancel?: () => unknown,
  onSuccess?: () => unknown,
}

function submitList({ visible, onCancel, onSuccess, cropEnum, natureEnum, areaList, defaultParams }: PropType) {
  const tableRef: any = useRef();
  // const formRef = useRef();
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setIsShowPage(true);
      }, 100);

      setTimeout(() => {
        tableRef?.current?.reload();
      });
    } else {
      setIsShowPage(false);
      setSelectProcessor("");
    }
  }, [visible]);


  const [isShowPage, setIsShowPage] = useState(false);
  const [storeParams, setStoreParams]: any = useState({});
  const [totalData, setTotalData]:any = useState({});
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  const [selectProcessor, setSelectProcessor]:any = useState("");
  const [storeSubsidyType, setStoreSubsidyType] = useState("1");
  const [signedData, setSignedData]: any = useState({
    list: [],
    count: 0,
    fertilizer_ton: 0,
    subsidy_amount: 0
  });

  const getProcessorList = async () => {
    setSelectProcessor(null);
    const result = await getPaymentProcessors(storeParams.subsidy_type || 1, "配方肥补贴");
    const options = result.data.people.map((p) => ({ label: p.user_name, value: p.id, obj: p }));
    setSelectOptions(options);
  };

  const loadData = async (rawParams) => {
    if (storeSubsidyType !== rawParams.subsidy_type || !selectOptions.length) {
      setSelectProcessor("");
      setStoreSubsidyType(rawParams.subsidy_type);
      await getProcessorList();
    }
    const params = {
      type: 3,
      city_id: rawParams.town_id && rawParams.town_id.length ? rawParams.town_id?.[0] : "",
      town_id: rawParams.town_id && rawParams.town_id.length ? rawParams.town_id?.[1] : "",
      subsidy_type: rawParams.subsidy_type,
      crops_name: rawParams.crops_name,
      year: rawParams.year ? Moment(rawParams.year).format("YYYY") : Moment().format("YYYY"),
      page: rawParams.current,
      page_size: rawParams.pageSize
    };
    setStoreParams(params);
    await getTotal(params);
    const result = await cityFormulaFertilizerList(params);
    if (result.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } else {
      message.error(result.msg);
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    }
  };

  const getTotal = async (params) => {
    const { pageNum, pageSize, ...data } = params;
    const result = await cityFormulaFertilizetListTotal(data);
    setTotalData(result.data);
  };

  const addSingList = (record) => {
    const currentSinged = lodash.cloneDeep(signedData);
    if (!signedData.list.includes(record.id)) {
      currentSinged.list.push(record.id);
      currentSinged.count++;
      currentSinged.fertilizer_ton += record.fertilizer_ton;
      currentSinged.subsidy_amount += record.subsidy_amount;
    } else {
      const index = currentSinged.list.findIndex(id => id === record.id);
      currentSinged.list.splice(index, 1);
      currentSinged.count--;
      currentSinged.fertilizer_ton -= record.fertilizer_ton;
      currentSinged.subsidy_amount -= record.subsidy_amount;
    }
    currentSinged.fertilizer_ton = +currentSinged.fertilizer_ton?.toFixed(2);
    currentSinged.subsidy_amount = +currentSinged.subsidy_amount?.toFixed(2);
    setSignedData(currentSinged);
  };


  const onSubmit = async () => {
    try {
      const { pageNum, pageSize, ...params } = storeParams;
      const result = await cityFormulaFertilizerListSubmit({
        ...params,
        processor: selectOptions.find((e) => e.value === selectProcessor)?.obj,
        id_arr: signedData.list
      });
      if (result.code === 0) {
        message.success("递交成功");
        onSuccess && onSuccess();
      } else {
        message.error(result.msg);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const tableColumns:any = [
    {
      title: "id",
      dataIndex: "id",
      hideInTable: true,
      hideInSearch: true
    },
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
      width: 100,
      valueEnum: natureEnum,
      fieldProps: { allowClear: false }
    },
    {
      title: "所属地区",
      dataIndex: "area_name",
      align: "center",
      width: 100,
      hideInSearch: true
    },
    {
      title: "所属地区",
      dataIndex: "town_id",
      hideInTable: true,
      renderFormItem: (item, props) => {
        return (<Cascader options={areaList} changeOnSelect allowClear={false} />);
      },
      fieldProps: { allowClear: false }
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
      valueEnum: cropEnum,
      fieldProps: { allowClear: false }
    },
    {
      title: "年份",
      dataIndex: "year",
      align: "center",
      width: 100,
      renderFormItem: () => <DatePicker picker="year" allowClear={false} />,
      fieldProps: { allowClear: false }
    },
    {
      title: "限额购肥量/吨",
      dataIndex: "quota_ton",
      align: "center",
      width: 100,
      hideInSearch: true
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
      title: "操作",
      dataIndex: "option",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <ButtonAuth type="SUBMIT">
          <Button
            type="link"
            onClick={() => {
              addSingList(record);
            }}
          >
            {
              signedData.list.includes(record?.id) ? (<span style={{color:"red"}}>取消标记</span>) : ( (<span style={{color:"#1890ff"}}>标记</span>) )
            }
          </Button>
        </ButtonAuth>
      )
    }
  ];

  return (
    <Modal
      title="批量递交"
      width="80vw"
      visible={visible}
      onCancel={onCancel}
      okText="确认递交"
      onOk={onSubmit}
      forceRender
      okButtonProps={{ disabled: !selectProcessor ? true : false }}
    >
      {
        isShowPage ? (
          <ProTable
            actionRef={tableRef}
            // formRef={formRef}
            request={loadData}
            columns={tableColumns}
            form={{
              initialValues: {
                crops_name: defaultParams.crops_name ?? "水稻",
                subsidy_type: defaultParams.subsidy_type ?? "1",
                town_id: defaultParams.town_id ? [defaultParams.city_id, defaultParams.town_id] : [1, 1],
                year: defaultParams.year ? Moment(defaultParams.year) : Moment(new Date())
              }
            }}
            rowKey="id"
            options={false}
            headerTitle={
              <div className={styles.header_bar}>
                <div>户数：<p>{totalData.count || 0}</p>户</div>
                <div>最终可补量：<p>{totalData.fertilizer_ton || 0}</p>吨</div>
                <div>补贴金额：<p>{totalData.subsidy_amount || 0}</p>元</div>
              </div>
            }
            toolBarRender={() => [
              <div className={styles.header_bar}>
                <Tooltip placement="top" title="被标记的表示当前批次下您不想提交至乡财的名单。">
                  <QuestionCircleOutlined style={{ position: "relative", left: "20px" }} />
                </Tooltip>
                <div>已标记 <p>{signedData.count}</p> 户</div>
                <div>最终可补量：<p>{signedData.fertilizer_ton}</p>吨</div>
                <div>补贴金额：<p>{signedData.subsidy_amount}</p>元</div>

                <div className="ant-col ant-form-item-label">
                  <label>选择代办人</label>
                </div>
                <Select
                  className={styles.selectProcessor}
                  getPopupContainer={() => window.document.body}
                  options={selectOptions}
                  value={selectProcessor}
                  onChange={(v) => setSelectProcessor(v)}
                />
              </div>
            ]}
          />
        ) : null
      }

    </Modal>
  );
}

export default submitList;
