import React, { useRef }  from 'react';
import { Modal, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { marketList, deleteMarket } from '@/services/market';
import ImgView from '@/components/ImgView';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import Moment from 'moment';
import ButtonAuth from '@/components/ButtonAuth';
import { TableListItem } from './data.d';
import CarouselImg from '@/components/CarouselImg';

const SupplyManageList: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const { location } = props;
   // 获取dataSource
   const getSupplyList = async (val:any) => {
    const valObj = { ...val };
    if (location && location.state && location.state.id) {
      valObj['market_id'] = location.state.id
    };
    valObj['send_user'] = valObj['user_name'] || '';
    const timeArr = valObj['created_at'] || [];
    if (timeArr && timeArr.length > 0) {
      valObj['pub_time_left'] = Moment(timeArr[0]).valueOf() / 1000;
      valObj['pub_time_right'] = Moment(timeArr[1]).valueOf() / 1000;
      delete valObj['created_at'];
    };
    const _params = paginationHandle(valObj);
    const data = await marketList(_params);
    if (location && location.state && location.state.id) {
      delete location.state
    }
    return tableDataHandle(data);
  }
  // 删除
  const deleteMarketHandle = async (id: number) => {
    const data = await deleteMarket({'id':id})
    const { code, msg } = data
    if (code === 0) {
      message.success(msg)
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '供需ID',
      dataIndex: 'market_id',
      formItemProps: {
        'defaultValue': (location && location.state && location.state.id) || ''
      }
    },
    {
      title: '发布人',
      dataIndex: 'user_name',
    },
    {
      title: '发布类型',
      dataIndex: 'type',
      valueEnum: {
        0: { text: '全部'},
        1: { text: '供应'},
        2: { text: '求购' }
      },
      filterDropdownVisible: false,
      filterIcon: <div/>,
    },
    {
      title: '分类',
      dataIndex: 'market_category_name',
      hideInSearch: true
    },
    {
      title: '标题',
      dataIndex: 'title',
      hideInSearch: true
    },
    {
      title: '发布内容',
      dataIndex: 'content',
    },
    {
      title: '图片',
      dataIndex: 'image_url_rows',
      render: (_, record) => {
        return record['image_url_rows'] && record['image_url_rows'].length > 0 ? (
          <CarouselImg urlList={record.image_url_rows} />
        ) : null
      },
      hideInSearch: true
    },
    {
      title: '单价（元）',
      dataIndex: 'show_price',
      hideInSearch: true
    },
    {
      title: '单位',
      dataIndex: 'unit',
      hideInSearch: true
    },
    {
      title: '所在地址',
      dataIndex: 'address',
      hideInSearch: true
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      hideInSearch: true
    },
    {
      title: '分享数',
      dataIndex: 'shares',
      hideInSearch: true
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      valueType: 'dateTimeRange'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <ButtonAuth type="DELETE">
          <a onClick={() => {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除本条数据吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() { deleteMarketHandle(record.market_id) },
              })
            }}>
            删除
          </a>
        </ButtonAuth>
      ),
    },
  ]



  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        columns={columns}
        options={false}
        tableAlertRender={false}
        toolBarRender={false}
        rowKey="market_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        request={(params) => getSupplyList(params)}
      />
    </PageHeaderWrapper>
  );
};

export default SupplyManageList;
