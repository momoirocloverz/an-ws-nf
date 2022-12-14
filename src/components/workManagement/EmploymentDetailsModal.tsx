import React, { useEffect, useRef, useState } from 'react';
import {mask, tableDataHandle} from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal,
} from 'antd';
import ProTable, {ActionType} from '@ant-design/pro-table';
import { getTempJobDetails } from '@/services/workManagement';
import ClockingRecordModal from '@/components/workManagement/ClockingRecordModal';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';
import {gender} from "@/components/workManagement/JobTypes";
import moment, { Moment } from 'moment';

function EmploymentDetailsModal({ visible, onCancel, context }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const tableRef = useRef<ActionType>();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.workerName,
      idNumber: rawParams.idNumber,
      jobId: context.id,
      date: moment(currentDate).format('YYYY-MM-DD'),
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getTempJobDetails(params);
    setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      supervisor: row.real_name,
      workerId: row.user_id,
      workerName: row.name,
      phoneNumber: row.phone,
      idNumber: row.identity_card,
      clockedHours: row.work_time,
      earnings: row.price,
      date: row.date,
      gender: row.sex,
      jobType: row.profession_name,
      jobDesc: row.profession_info,
      bankName:row.bank_deposit,
      bankAccount: row.bank_card,
      rate:row.price_unit,
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

  useEffect(() => {
    if (visible) {
      tableRef.current?.reset();
      tableRef.current?.reload();
    }
    if (visible && context) {
      setStartDate(context.workStart.substr(0, 10));
      setCurrentDate(moment(context.workStart.substr(0, 10)));
      setEndDate(context.workEnd.substr(0, 10));
    }
  }, [visible]);

  function disabledDate(current) {
    return current < moment(startDate) || current > moment(endDate);
  }

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '???????????????',
      dataIndex: 'supervisor',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'workerName',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'gender',
      hideInSearch: true,
      valueEnum: gender,
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'idNumber',
      align: 'center',
      render: (text) => (mask(text, { headLength: 4, fixedLength: 18 })),
    },
    {
      title: '????????????',
      dataIndex: 'jobType',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'jobDesc',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '?????????',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
      align: 'center',
      render: (text) => (mask(text, { fixedLength: 11 })),
    },
    {
      title: '?????????',
      dataIndex: 'bankName',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'bankAccount',
      hideInSearch: true,
      render: (text) => (mask(text)),
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'rate',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'date',
      hideInSearch: false,
      align: 'center',
      renderFormItem: () => <DatePicker picker="date" value={currentDate} onChange={(v) => setCurrentDate(v)} disabledDate={disabledDate} />,
    },
    {
      title: '??????',
      dataIndex: 'clockedHours',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'earnings',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '??????',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedRow({
                jobId: context.id,
                workerId: record.workerId,
                clockedHours: record.clockedHours,
              });
              setIsModalVisible(true);
            }}
          >
            ????????????
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="????????????"
      visible={visible}
      width={1200}
      footer={false}
      onCancel={onCancel}
      destroyOnClose
    >
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storedParams;
                getTempJobDetails(exportParams, 1).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}????????????????????????.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`????????????: ${e.message}`);
                });
              }}
            >
              ??????
            </Button>
          </ButtonAuth>,
        ]}
      />
      <ClockingRecordModal
        context={selectedRow}
        visible={isModalVisible}
        date={moment(currentDate).format('YYYY-MM-DD')}
        onCancel={() => setIsModalVisible(false)}
      />
    </Modal>
  );
}

export default EmploymentDetailsModal;
