import React,{useState,useRef} from 'react';
import ProTable,{ActionType} from '@ant-design/pro-table';
import { DatePicker } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from '../index.less'


const CollectionItem: React.FC<any> = (props) => {
    const actionRef = useRef<ActionType>();
    const { dataSource } = props;
    const columns = [
        {
            title: '家宴厅',
            render: (_, record) => {
              return (
                <span>{record.get_family_feast.feast_name}</span>
              )
            },
            hideInSearch: true
        },
        {
            title: '预定日期',
            hideInSearch: true,
            render: (_, record) => {
              return (
                <span>{record.reserve_at.slice(0, 10)}</span>
              )
            }
        },
        {
            title: '预定时段',
            hideInSearch: true,
            render: (_, record) => {
              return (
                <span>{record.presentable_time === 1 ? '早上' : record.presentable_time === 2 ? '中午' : '晚上'}</span>
              )
            },
        },
        {
            title: '预定桌数',
            hideInSearch: true,
            dataIndex: 'table_number'
        },
        {
            title:'付款凭证',
            hideInSearch: true,
            render: (_, record) => {
              return record.evidence_img ? (
                <div className={styles.imgBox}>
                  <img style={{width: '150px'}} src={record.image_url} alt="" />
                </div>
              ) : '-'
            }
        },
    ];
    
    return (
      <ProTable
        actionRef={actionRef}
        tableAlertRender={false}
        options={false}
        columns={columns}
        rowKey="family_feast_reserve_id"
        search={false}
        dataSource={dataSource}
        pagination={false}
        style={{paddingLeft: '5%'}}
      />
    )
}

export default connect(({ user,info }: ConnectState)=>({
    accountInfo: user.accountInfo,
    areaList: info.areaList
}))(CollectionItem);
