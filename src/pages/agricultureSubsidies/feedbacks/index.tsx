/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  Button, DatePicker, message,
} from 'antd';
// eslint-disable-next-line no-unused-vars
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { tableDataHandle } from '@/utils/utils';
import FeedbackResponseForm from '@/components/agricultureSubsidies/FeedbackResponseForm';
import { getFeedbacks } from '@/services/agricultureSubsidies';
import { findAuthorizationsByPath, redirectToFarmlandMap } from '@/pages/agricultureSubsidies/utils';
import { USER_TYPES } from '@/pages/agricultureSubsidies/consts';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const { RangePicker } = DatePicker;
const status = {
  0: '未回复',
  1: '已回复',
};

type TableListItem = {
  key: number;
  id: number;
  content: string;
  submittedAt: string,
  sender: string,
  phoneNumber: string,
  responseDate: string,
  status: number,
  response: string,
};

function disableDates(current) {
  return current && current > moment().endOf('day');
}

function FeedbackManagement({ authorizations }) {
  // const [data, setData] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formContent, setFormContent] = useState<TableListItem>({});
  const isMounted = useRef(true);
  const tableRef = useRef();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建人姓名',
      dataIndex: 'sender',
    },
    {
      title: '创建人身份证',
      key: 'idNumber',
      hideInTable: true,
    },
    {
      title: '创建人手机号',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
      render: (item, record) => {
        return (
          <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/,"$1****$2") : ''}</span>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'submittedAt',
      renderFormItem: () => (
        <RangePicker picker="date" disabledDate={disableDates} />
      ),
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: status,
      filters: undefined,
      hideInSearch: true,
    },
    {
      title: '回复时间',
      dataIndex: 'responseDate',
      hideInSearch: true,
    },
    {
      title: '回复内容',
      dataIndex: 'response',
      hideInSearch: true,
      width: 400,
      // ellipsis: true
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      render: (__, record) => (
        record.status === 0 ? (
          <Button
            type="link"
            onClick={() => {
              setIsFormVisible(true);
              setFormContent(record);
            }}
          >
            回复
          </Button>
        ) : <div style={{ width: '6ch' }} />
      ),
    },
  ];

  useEffect(() => {
    if (authorizations.length > 0 && findAuthorizationsByPath(authorizations, '/agriculture-subsidies/feedbacks').indexOf(USER_TYPES.VILLAGE_OFFICIAL) < 0) {
      redirectToFarmlandMap();
    }
  }, [authorizations]);

  // FIXME: memory leak
  const loadData = async (params) => {
    try {
      const result = await getFeedbacks(
        {
          name: params.sender,
          idNumber: params.idNumber,
          rangeStart: params.submittedAt?.[0] && moment(params.submittedAt[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          rangeEnd: params.submittedAt?.[1] && moment(params.submittedAt[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          pageNum: params.current,
          pageSize: params.pageSize,
        },
      );
      result.data.data.forEach((e, i) => {
        result.data.data[i].sender = e.real_name;
        result.data.data[i].content = e.feedback_text;
        result.data.data[i].responseDate = e.reply_time;
        result.data.data[i].status = e.type;
        result.data.data[i].phoneNumber = e.mobile;
        result.data.data[i].response = e.reply_text;
        result.data.data[i].submittedAt = e.created_at;
      });
      // @ts-ignore
      const transformedResult = tableDataHandle(result);
      if (isMounted.current) {
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      message.error(`反馈数据读取失败: ${e.message}`);
      return tableDataHandle({
        code: -1,
        data: [],
        pagination: {
          page: 1, item_total: 0, page_count: 1, page_total: 1,
        },
      });
    }
  };
  useEffect(() => () => {
    isMounted.current = false;
  },
  []);

  const onSuccess = useCallback(() => {
    setIsFormVisible(false);
    // @ts-ignore
    tableRef.current?.reload();
  }, []);
  const onCancel = useCallback(() => {
    setIsFormVisible(false);
  }, []);

  return (
    <PageHeaderWrapper>
      <main>
        <ProTable<TableListItem>
          // dataSource={data}
          actionRef={tableRef}
          request={loadData}
          columns={columns}
          rowKey="id"
          search={{ labelWidth: 100 }}
          options={false}
        />
      </main>
      <FeedbackResponseForm
        visible={isFormVisible}
        feedbackId={formContent?.id}
        feedbackContent={formContent?.content}
        successCb={onSuccess}
        cancelCb={onCancel}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user }: ConnectState) => ({
  authorizations: user.userAuthButton,
}))(FeedbackManagement);
