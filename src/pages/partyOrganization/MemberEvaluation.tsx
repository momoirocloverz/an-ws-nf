import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { deleteEvaluationReport, getMemberEvaluationReports } from '@/services/partyOrganization';
import EvaluationReportModal from '@/components/partyOrganization/EvaluationReportModal';
import ImportBtn from '@/components/buttons/ImportBtn';

function MemberEvaluation() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  // const [storedParams, setStoredParams] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getMemberEvaluationReports(params);
    // setStoredParams(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      name: row.name,
      period: [row.year, row.division],
      score: row.score,
      grade: row.grade,
      createdAt: row.created_at,
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
      title: '日期',
      dataIndex: 'period',
      align: 'center',
      render: (__, record) => (`${record.period[0]}年${record.period[1]}`),
      hideInSearch: true,
    },
    {
      title: '得分',
      dataIndex: 'score',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '档次',
      dataIndex: 'grade',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
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
                      await deleteEvaluationReport(record.id);
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
    <PageHeaderWrapper>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              window.location.href = 'https://wencheng-zzt-oss.zjsszxc.com/%E5%85%88%E9%94%8B%E6%8C%87%E6%95%B0%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
            }}
          >
            下载模板
          </Button>,
          <ImportBtn api="import_building_construction" onSuccess={() => tableRef.current?.reload()} />,
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
      <EvaluationReportModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </PageHeaderWrapper>
  );
}

export default MemberEvaluation;
