import { Button, Cascader, DatePicker, message, Modal } from "antd";
import ProTable from "@ant-design/pro-table";
import React, { useEffect, useRef, useState } from "react";
import styles from "./../index.less";
import {
  getSubsidyFormulaFertilizerDeclareList,
  subsidyFormulaFertilizerDeclareExamine,
  subsidyFormulaFertilizerDeclareListTotal,
} from "@/services/formulaFertilizerManageTown";
import { formatArea, tableDataHandle } from "@/utils/utils";
import Moment from "moment";
import moment from "moment";

type PropType = {
  natureEnum: {},
  cropEnum: {},
  regions: any,
  visible: boolean,
  onCancel?: () => unknown,
  onSuccess?: () => unknown,
}

function publicList({ visible, onCancel, onSuccess, cropEnum, natureEnum, regions }: PropType) {
  const tableRef = useRef();
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setIsShowPage(true);
      }, 100);
    } else {
      setIsShowPage(false);
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    if (userInfo) {
      setUserRegion([ userInfo?.town_id]);
    }
  }, [visible]);

  const [totalData, setTotalData]: any = useState({});
  const [storeParams, setStoreParams] = useState({});
  const [isShowPage, setIsShowPage] = useState(false);
  const [userRegion, setUserRegion]: any = useState([]);
  const loadData = async (rawParams) => {
    const params = {
      // real_name: rawParams.real_name ?? '',
      crops_name: rawParams.crops_name,
      subsidy_type: rawParams.subsidy_type,
      year: rawParams.year ? Moment(rawParams.year).format("YYYY") : "",
      is_examine: 1,// 1待审核 2已审核
      page: rawParams.current,
      page_size: rawParams.pageSize,
      town_id: userRegion[0],
      village_id: userRegion[1]
    };

    await getTotal(params);
    setStoreParams(params);
    const result = await getSubsidyFormulaFertilizerDeclareList(params);
    if (result.code === 0) {
      const transformed = Array.isArray(result.data.data) ? result.data.data : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } else {
      message.error(result.msg);
      return tableDataHandle({ ...result, data: { ...(result.data), data: [] } });
    }
  };

  const getTotal = async (params) => {
    const { pageNum, pageSize, ...data } = params;
    const result = await subsidyFormulaFertilizerDeclareListTotal(data);
    setTotalData(result.data);
  };
  // TODO 还没好
  const onSubmit = async () => {
    try {
      console.log("storeParams");
      console.log(storeParams);
      const result = await subsidyFormulaFertilizerDeclareExamine(storeParams);
      if (result.code === 0) {
        message.success("审核成功");
        onSuccess && onSuccess();
      } else {
        message.error(result.msg);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const tableColumns: any = [
    {
      title: "id",
      dataIndex: "id",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "地区",
      dataIndex: "region",
      align: "center",
      hideInTable: true,
      // initialValue: formatArea(userRegion),
      renderFormItem: () => {
        return (<Cascader options={regions[0].children} defaultValue={formatArea(userRegion)} changeOnSelect onChange={(v) => setUserRegion(v)}/>);
      }
    },
    {
      title: "补贴对象",
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
      valueEnum: natureEnum
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
      valueEnum: cropEnum
    },
    {
      title: "年份",
      dataIndex: "year",
      align: "center",
      width: 100,
      initialValue: moment().startOf("year"),
      renderFormItem: () => <DatePicker picker="year" allowClear={false} />
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
      title: "驳回时间",
      dataIndex: "reject_time",
      align: "center",
      hideInSearch: true
    },
    {
      title: "驳回理由",
      dataIndex: "city_reject_reason",
      align: "center",
      hideInSearch: true
    }
  ];

  return (
    <Modal
      title="批量审核"
      width="80vw"
      visible={visible}
      onCancel={onCancel}
      // okText="通过"
      forceRender
      // onOk={onSubmit}
      footer={[
        <Button type="primary" disabled={totalData.count === 0} onClick={() => onSubmit()}>通过</Button>
      ]}
    >
      {
        isShowPage ? (
          <ProTable
            actionRef={tableRef}
            request={loadData}
            columns={tableColumns}
            rowKey="id"
            options={false}
            headerTitle={
              <div className={styles.header_bar}>
                <div>户数：<p>{totalData.count || 0}</p>户</div>
                <div>最终可补量：<p>{totalData.fertilizer_ton || 0}</p>吨</div>
                <div>补贴金额：<p>{totalData.subsidy_amount || 0}</p>元</div>
              </div>
            }
            toolBarRender={() => []}
          />
        ) : null
      }
    </Modal>
  );
}

export default publicList;
