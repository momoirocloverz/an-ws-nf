import React, { useMemo, useRef, useState } from 'react';
import { mask, tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal, Select,
} from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getTempWorkers, removeTempWorker } from '@/services/workManagement';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';
import ImportBtn from '@/components/buttons/ImportBtn';
import { debounce } from 'lodash';
import useOccupations from '@/components/workManagement/useOccupations';
import TempWorkerModal from './TempWorkerModal';

const gender = {
  0: '男',
  1: '女',
};

function TempWorkers() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const [searchedJobType, setSearchedJobType] = useState('');
  // const [[, jobTypeOptions]] = useOccupations(searchedJobType);
  const { occupations: [, jobTypeOptions], isLoading } = useOccupations(searchedJobType);
  const debouncedSetSearched = useMemo(() => debounce(setSearchedJobType, 500, {
    leading: false,
    trailing: true,
  }), []);

  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      idNumber: rawParams.idNumber,
      jobType: rawParams.jobType,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getTempWorkers(params);
    setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      name: row.name,
      phoneNumber: row.phone,
      idNumber: row.identity_card,
      gender: row.sex,
      dob: row.birthday,
      jobType: row.profession_name,
      jobTypeIds: row.profession_ids?.split(',')?.map((id) => parseInt(id, 10)) ?? [],
      jobTypeNames: row.profession_name?.split(',') ?? [],
      address: row.address,
      notes: row.interpret,
      jobDesc: row.profession_info,
      bankName: row.bank_deposit,
      bankAccount: row.bank_card,
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
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
      align: 'center',
      render: (text) => (mask(text, { fixedLength: 11 })),
    },
    {
      title: '身份证',
      dataIndex: 'idNumber',
      align: 'center',
      render: (text) => (mask(text, { headLength: 4, fixedLength: 18 })),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      align: 'center',
      valueEnum: gender,
      filters: false,
    },
    // {
    //   title: '出生日期',
    //   dataIndex: 'dob',
    //   hideInSearch: true,
    //   hideInTable: true,
    //   align: 'center',
    // },
    {
      title: '工种',
      dataIndex: 'jobType',
      // hideInSearch: true,
      renderFormItem: () => (
        <Select
          options={jobTypeOptions}
          filterOption={false}
          showSearch
          defaultActiveFirstOption={false}
          notFoundContent={isLoading ? <div style={{ display: 'flex', justifyContent: 'center' }}><LoadingOutlined style={{ color: '#1890ff' }} /></div> : null}
          placeholder="查询工种"
          onSearch={(v) => debouncedSetSearched(v)}
        />
      ),
      align: 'center',
    },
    // {
    //   title: '工种明细',
    //   dataIndex: 'jobDesc',
    //   hideInSearch: true,
    //   align: 'center',
    // },
    {
      title: '开户行',
      dataIndex: 'bankName',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '银行卡号',
      dataIndex: 'bankAccount',
      hideInSearch: true,
      render: (text) => (mask(text)),
      align: 'center',
    },
    {
      title: '住址',
      dataIndex: 'address',
      hideInSearch: true,
      align: 'center',
    },
    // {
    //   title: '备注',
    //   dataIndex: 'notes',
    //   align: 'center',
    //   hideInSearch: true,
    // },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
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
                  content: `确认删除${record.name}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await removeTempWorker(record.idNumber);
                      tableRef.current.reload();
                      if (result.code === 0) {
                        message.success('删除成功!');
                      } else if (result.code === 200) {
                        message.success(`${result.msg}!`);
                      } else {
                        throw new Error(result.msg || '');
                      }
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
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = 'https://img.wsnf.cn/acfile/%E5%8A%B3%E5%8A%A1%E4%BA%BA%E6%95%B0%E5%AF%BC%E5%85%A5.xls';
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api="import_labor_user" onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="EXPORT">
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storedParams;
                getTempWorkers(exportParams, 1).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}劳务人员导出记录.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`导出失败: ${e.message}`);
                });
              }}
            >
              导出
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      <TempWorkerModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </>
  );
}

export default TempWorkers;
