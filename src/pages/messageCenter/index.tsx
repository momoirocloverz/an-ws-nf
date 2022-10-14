import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { messageList, readMessage } from '@/services/operationCanter';
import { connect, Dispatch, Link } from 'umi';
import { ConnectState } from '@/models/connect';

import styles from './style.less';

const MessageList: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const { dispatch } = props;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '状态',
      dataIndex: 'is_read',
      render: (_, record) => {
        return (
          <p>{record.is_read === 1 ? '已读' : '未读'}</p>
        )
      }
    },
    {
      title: '主题',
      dataIndex: 'message_text',
      width: 500,
      render: (_, record) => {
        return (
          <div onClick={() => {
            if (record.is_read === 0) {
              readMsg([record['message_id']]);
            }
          }}>
            <Link
              style={{color: 'rgba(0, 0, 0, 0.65)'}}
              to={record.type === 1 ? {
                pathname: '/question', state: {id: JSON.parse(record.content).question_id}
              } : {
                pathname: '/supply', state: {id: JSON.parse(record.content).market_id}
              }}>
              <p style={{fontWeight: record.is_read === 1 ? 'normal' : 'bolder'}}>
                {record.message_text}
              </p>
            </Link>
          </div>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'created_at'
    }
  ]

  const [selectedRowKeys, setKeyValue] = useState([]);
  const [noReadArr, setNoReadArr] = useState([]);
  const [isReadArr, setIsReadArr] = useState([]);
  const [allNum, setAllNum] = useState(0);
  const [noReadNum, setNoReadNum] = useState(0);

  // 获取dataSource
  const getMessageList = async (val:any) => {
    const _params = paginationHandle(val);
    const _data = await messageList(_params);
    if (_data.code === 0) {
      const { total=0, no_read=0, data=[] } = _data.data || {};
      setAllNum(total);
      setNoReadNum(no_read);
      const isRead:any = [];
      const noRead:any = [];
      data.forEach((item:any) => {
        if (item.is_read === 1) {
          isRead.push(item.message_id)
        } else {
          noRead.push(item.message_id)
        }
      });
      setNoReadArr(noRead);
      setIsReadArr(isRead);
    }
    return tableDataHandle(_data)
  }
  // table选择框逻辑
  const onSelectChange = (selectedRowKeys:any) => {
    setKeyValue(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    columnWidth: 150,
    onChange: onSelectChange,
    getCheckboxProps(value:any) {
      return {
        disabled: value.is_read === 1 ? true : false
      };
    }
  };

  // 标记已读
  const setRead = async () => {
    let hasNoRead = false
    const result:Array<any> = []
    selectedRowKeys.forEach((item) => {
      if (isReadArr.includes(item)) {
        hasNoRead = false
      }
      if (noReadArr.includes(item)) {
        hasNoRead = true
        result.push(item)
      }
    })
    if (hasNoRead) {
      readMsg(result)
    }
  }

  const readMsg = async (arr: any) => {
    try {
      const _data = await readMessage({ message_ids: arr.join(',') });
      if (_data.code === 0) {
        message.success('标记成功')
        if (actionRef.current) {
          actionRef.current.reload();
        };
        dispatch({
          type: 'user/queryAccountInfo'
        });
      } else {
        message.error(_data.msg)
      }
    } catch (err) {
      message.error('标记失败');
    }
  }


  return (
    <div className={styles.messageCont}>
      <p className={styles.messageNum}>共{allNum}条，其中未读<span>{noReadNum}</span>条</p>
      <Button onClick={setRead}>标记为已读</Button>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        columns={columns}
        search={false}
        options={false}
        tableAlertRender={false}
        rowKey="message_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        request={(params) => getMessageList(params)}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default connect(({ }: ConnectState) => ({}))(MessageList);
