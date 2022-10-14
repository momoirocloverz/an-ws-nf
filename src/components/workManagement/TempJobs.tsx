import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal, Select,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getTempJobs, removeTempJob } from '@/services/workManagement';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import EmploymentDetailsModal from '@/components/workManagement/EmploymentDetailsModal';
import TableImage from '@/components/ImgView/TableImage';
import moment from "moment";
import TempJobModal from './TempJobModal';

const { RangePicker } = DatePicker;
const status = [
  {
    value: '1',
    label: '未开始'
  },
  {
    value: '2',
    label: '进行中'
  },
  {
    value: '3',
    label: '已完成',
  }
]

function TempJobs({ user }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJobDetailModalVisible, setIsJobDetailModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      title: rawParams.title,
      status: rawParams.status,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };

    const result = await getTempJobs(params);
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      title: row.title,
      supervisor: row.real_name,
      supervisorId: row.user_id,
      address: row.address,
      poster: row.image,
      requirements: row.demand,
      checkInType: row.frequency,
      breakLength: row.rest_time,
      rate: row.price,
      workStart: row.start_time,
      workEnd: row.end_time,
      region: [row.city_id, row.town_id, row.village_id],
      checkIns: row.people_nums,
      notes: row.interpret,
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    // {
    //   title: '封面',
    //   dataIndex: 'poster',
    //   hideInSearch: true,
    //   align: 'center',
    //   render: (item) => (<TableImage src={item.url} />),
    //   width: 140,
    // },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '劳务负责人',
      dataIndex: 'supervisor',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '地点',
      dataIndex: 'address',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '要求',
      dataIndex: 'requirements',
      hideInSearch: true,
      align: 'center',
    },
    // {
    //   title: '单价(元/小时)',
    //   dataIndex: 'rate',
    //   hideInSearch: true,
    //   align: 'center',
    // },
    {
      title: '起止时间',
      key: 'timeRange',
      align: 'center',
      hideInSearch: true,
      // renderFormItem: () => (<RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />),
      render: (__, record) => (`${record.workStart} - ${record.workEnd}`),
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      renderFormItem: ()=> (<Select options={status} />),
      render: (__, record) => {
        const currentTime = Date.now();
        if (currentTime < new Date(record.workStart).getTime()) {
          return '未开始';
        }
        if (currentTime > new Date(record.workEnd).getTime()) {
          return '已结束';
        }
        return '进行中';
      },
    },
    {
      title: '打卡类型',
      dataIndex: 'checkInType',
      align: 'center',
      hideInSearch: true,
      render: (value) => (`${value}次卡`),
    },
    {
      title: '打卡人数',
      dataIndex: 'checkIns',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow({ ...record });
              setIsJobDetailModalVisible(true);
            }}
          >
            查看
          </Button>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify' });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${record.title}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await removeTempJob(record.id);
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
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create', region: [user.city_id, user.town_id, user.village_id] });
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <TempJobModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
      <EmploymentDetailsModal
        context={selectedRow}
        visible={isJobDetailModalVisible}
        onCancel={() => setIsJobDetailModalVisible(false)}
      />
    </>
  );
}

export default connect(({ user }: ConnectState) => ({
  user: user.accountInfo,
}))(TempJobs);
