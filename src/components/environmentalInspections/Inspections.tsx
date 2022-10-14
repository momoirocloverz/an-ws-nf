import React, { useRef, useState } from 'react';
import { formatArea, tableDataHandle } from "@/utils/utils";
import ButtonAuth from '@/components/ButtonAuth';
import {
  DatePicker, message, Cascader, Button, Modal,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  deleteInspectionRecord,
  getEnvironmentalInspections,
} from '@/services/environmentalInspections';
import useInspectionItems from '@/components/environmentalInspections/useInspectionItems';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ExportButton from '../agricultureSubsidies/ExportButton';
import CarouselImg from '@/components/CarouselImg';

const { RangePicker } = DatePicker;

const itemType = {
  1: '加分',
  2: '减分',
};

type PropType = {
  regionTree: CascaderOptionType[];
  user: any;
}

function Inspections({ regionTree, user }: PropType) {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const [, itemOptions] = useInspectionItems();
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      region: rawParams.region,
      item: rawParams.displayName,
      inspectedAt: rawParams.inspectedAt,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    try {
      const result = await getEnvironmentalInspections(params);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        // TODO: other errors
        throw new Error('');
      }
      setStoredParams(params);
      const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
        id: row.id,
        region: row.area_name,
        location: row.address,
        displayName: `${row.main_item || '?'} — ${row.problem_cate || '?'}`,
        name: row.problem_cate,
        desc: row.problem_info,
        type: row.just_negative,
        points: row.fraction,
        pic: row.images,
        inspector: row.real_name,
        inspectedAt: row.created_at,
      })) : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
    } catch (e) {
      message.error(`读取列表失败: ${e.message}`);
      return {
        data: [],
        page: 1,
        total: 0,
        success: true,
      };
    }
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '行政村',
      dataIndex: 'region',
      renderFormItem: () => (<Cascader options={regionTree} changeOnSelect allowClear={false} />),
      align: 'center',
      width: 160,
    },
    {
      title: '具体点位',
      dataIndex: 'location',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '问题类型',
      dataIndex: 'displayName',
      renderFormItem: () => (<Cascader options={itemOptions} />),
      align: 'center',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'desc',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '加减分',
      dataIndex: 'type',
      valueEnum: itemType,
      hideInSearch: true,
      align: 'center',
      width: 60,
    },
    {
      title: '打分情况',
      dataIndex: 'points',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '图片',
      dataIndex: 'pic',
      hideInSearch: true,
      align: 'center',
      width: 140,
      render: (_: any, record: any) => {
        return record['pic'] && record['pic'].length > 0 ? (
          <CarouselImg urlList={record.pic} />
        ) : null
      }
    },
    {
      title: '检查人',
      dataIndex: 'inspector',
      align: 'center',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '检查时间',
      dataIndex: 'inspectedAt',
      align: 'center',
      valueType: 'datetime',
      renderFormItem: () => (<RangePicker picker="date" />),
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (__, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除这条”${record.displayName}“问题?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await deleteInspectionRecord(record.id);
                      message.success('删除成功!');
                      tableRef.current.reload();
                    } catch (e) {
                      message.error(new Error(`删除失败: ${e.message}!`));
                    }
                  },
                });
              }}
            >
              删除
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];

  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        form={{
          initialValues: {
            region: formatArea([user.city_id, user.town_id, user.village_id])
          },
        }}
        toolBarRender={() => [
          <ButtonAuth type="EXPORT">
            <ExportButton func={getEnvironmentalInspections} params={storedParams} />
          </ButtonAuth>,
        ]}
      />
    </>
  );
}

export default Inspections;
