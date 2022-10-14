import {DatePicker, message, Modal} from "antd";
import ProTable from '@ant-design/pro-table';
import React, {useEffect, useRef, useState} from "react";
import styles from './../index.less';
import {
  townFormulaFertilizerList, townFormulaFertilizerListStartPublicity,
  townFormulaFertilizerTotal
} from "@/services/formulaFertilizerManageTown";
import { tableDataHandle } from '@/utils/utils';
import Moment from 'moment';

type PropType = {
  natureEnum: {},
  cropEnum: {},
  visible: boolean,
  onCancel?: () => unknown,
  onSuccess?: () => unknown,
}

function publicList({ visible, onCancel, onSuccess, cropEnum, natureEnum }: PropType) {
  const tableRef = useRef();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setIsShowPage(true);
      }, 100);
    } else {
      setIsShowPage(false);
    }
  }, [visible]);

  const [totalData, setTotalData]:any = useState({});
  const [storeParams, setStoreParams] = useState({});
  const [isShowPage, setIsShowPage] = useState(false);

  const loadData = async (rawParams) => {
    const params = {
      type: 1,
      is_can_publicity: 1,
      subsidy_type: rawParams.subsidy_type,
      crops_name: rawParams.crops_name,
      year: rawParams.year ? Moment(rawParams.year).format('YYYY') : '',
      page: rawParams.current,
      page_size: rawParams.pageSize,
    };
    await getTotal(params);
    setStoreParams(params);
    const result = await townFormulaFertilizerList(params);
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
    const result = await townFormulaFertilizerTotal(data);
    setTotalData(result.data);
  };

  const onSubmit = async () => {
    try {
      const { pageNum, pageSize, type, ...params }:any = storeParams;
      const result = await townFormulaFertilizerListStartPublicity(params);
      if (result.code === 0) {
        message.success('开始公示成功');
        onSuccess&&onSuccess();
      } else {
        message.error(result.msg);
      }
    } catch (err) {
      message.error(err.message);
    };
  };

  const tableColumns:any = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '性质',
      dataIndex: 'subsidy_type',
      align: 'center',
      width: 100,
      valueEnum: natureEnum,
    },
    {
      title: '所属地区',
      dataIndex: 'area_name',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '核实总面积',
      dataIndex: 'verify_area',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '作物',
      dataIndex: 'crops_name',
      align: 'center',
      width: 100,
      valueEnum: cropEnum,
    },
    {
      title: '年份',
      dataIndex: 'year',
      align: 'center',
      width: 100,
      renderFormItem: () => <DatePicker picker="year" />,
    },
    {
      title: '限额购肥量/吨',
      dataIndex: 'quota_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '实名制购肥量/吨',
      dataIndex: 'real_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '开票数量/吨',
      dataIndex: 'billing_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '送货数量/吨',
      dataIndex: 'delivery_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '最终可补量/吨',
      dataIndex: 'fertilizer_ton',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '补贴金额',
      dataIndex: 'subsidy_amount',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '申报时间',
      dataIndex: 'declare_time',
      align: 'center',
      width: 100,
      hideInSearch: true,
    }
  ]

  return (
    <Modal
      title="批量公示"
      width="80vw"
      visible={visible}
      onCancel={onCancel}
      okText="开始公示"
      forceRender
      onOk={onSubmit}
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
                <div>户数：<p>{ totalData.count || 0 }</p>户</div>
                <div>最终可补量：<p>{ totalData.fertilizer_ton || 0 }</p>吨</div>
                <div>补贴金额：<p>{ totalData.subsidy_amount || 0 }</p>元</div>
              </div>
            }
            toolBarRender={() => []}
          />
        ) : null
      }
    </Modal>
  )
}
export default publicList;
