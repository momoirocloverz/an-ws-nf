import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem, TableDetailItem } from './data.d';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { questionList, delQuestion, questionDetailList } from '@/services/operationCanter';
import ImgView from '@/components/ImgView';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import ButtonAuth from '@/components/ButtonAuth';
import CarouselImg from '@/components/CarouselImg';

const ValueEnum = {
  3: { text: "政策类"},
  5: { text: "畜牧类"},
  6: { text: "水产类"},
  9: { text: "农业经营类"},
  11: { text: "粮油类"},
  12: { text: "蔬菜类"},
  13: { text: "食用菌类"},
  14: { text: "水果花卉类"},
  15: { text: "生态循环类"}
}
const QuertionManageList: React.FC<any> = (props) => {
  // 回答详情
  const [detailVisible, setVisible] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const { location } = props;
  const detailColumns: ProColumns<TableDetailItem>[] = [
    {
      title: '回答时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '回复人',
      dataIndex: 'reply_name',
      hideInSearch: true
    },
    {
      title: '被回复人',
      dataIndex: 'questioner',
      hideInSearch: true
    },
    {
      title: '回答内容',
      dataIndex: 'content',
      hideInSearch: true
    }
  ]
  // 问答列表
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '问题ID',
      dataIndex: 'question_id',
      formItemProps: {
        'defaultValue': (location && location.state && location.state.id) || ''
      }
    },
    {
      title: '提问类型',
      dataIndex: 'expert_type_id',
      valueEnum: ValueEnum,
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      render: (_, record) => {
        const ID = parseInt(record['expert_type_id'], 10) || 0
        return (
          <span>
            {
              ValueEnum[ID] ? ValueEnum[ID].text : ''
            }
          </span>
        );
      },
    },
    {
      title: '提问内容',
      dataIndex: 'content',
      width: 300
    },
    {
      title: '提问人',
      dataIndex: 'questioner'
    },
    {
      title: '图片',
      dataIndex: 'first_image',
      render: (_, record) => {
        return record['first_image'] && record['first_image'].length > 0 ? (
          <CarouselImg urlList={record.first_image} />
        ) : null
      },
      hideInSearch: true
    },
    {
      title: '提问时间',
      dataIndex: 'created_at',
      valueType: 'dateTimeRange',
    },
    {
      title: '浏览数',
      dataIndex: 'views',
      hideInSearch: true
    },
    {
      title: '分享数',
      dataIndex: 'shares',
      hideInSearch: true
    },
    {
      title: '回答数',
      dataIndex: 'answers',
      hideInSearch: true,
      render: (_, record) => (
        <a onClick={() => {
          setVisible(true)
          setDetailId(record.question_id)
        }}>
          { record.answers }
        </a>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <ButtonAuth type="DELETE">
          <a onClick={() => {
            Modal.confirm({
              title: '提示',
              icon: <ExclamationCircleOutlined />,
              content: '确定删除本条问答数据吗？',
              okText: '确认',
              cancelText: '取消',
              onOk() { deleteQues(record['question_id']) },
            })
          }}>
            删除
          </a>
        </ButtonAuth>
      ),
    },
  ]

  // 删除问答
  const deleteQues = async (id: number) => {
    const _data = await delQuestion(id)
    const { code, msg } = _data
    if (code === 0) {
      message.success(msg)
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  // 获取dataSource
  const getQuestionList = async (val:any) => {
    const valObj = { ...val };
    if (location && location.state && location.state.id) {
      valObj['question_id'] = location.state.id
    };
    const timeArr = valObj['created_at'] || [];
    if (timeArr && timeArr.length > 0) {
      valObj['begin_time'] = timeArr[0];
      valObj['end_time'] = timeArr[1];
      delete valObj['created_at'];
    };
    const _params = paginationHandle(valObj);
    const _data = await questionList(_params);
    if (location && location.state && location.state.id) {
      delete location.state
    }
    return tableDataHandle(_data)
  }

  // 获取详情dataSource
  const getDetailList = async (val:any) => {
    const valObj = { ...val };
    valObj.question_id = detailId;
    const _params = paginationHandle(valObj);
    const _data = await questionDetailList(_params);
    return tableDataHandle(_data)
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        columns={columns}
        actionRef={actionRef}
        options={false}
        tableAlertRender={false}
        toolBarRender={false}
        rowKey="question_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        request={(params) => getQuestionList(params)}
      />
      {
        detailVisible ? (
          <Modal
            width='80%'
            title="回答详情"
            visible={detailVisible}
            maskClosable= {false}
            footer={null}
            onCancel={() => { setVisible(false) }}
          >
            <ProTable<TableDetailItem>
              headerTitle=""
              columns={detailColumns}
              options={false}
              tableAlertRender={false}
              toolBarRender={false}
              search={false}
              rowKey="question_id"
              pagination={{
                position: ['bottomCenter'],
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSize: 10,
                size: 'default'
              }}
              request={(params) => getDetailList(params)}
            />
          </Modal>
        ) : null
      }
    </PageHeaderWrapper>
  );
};

export default QuertionManageList;
