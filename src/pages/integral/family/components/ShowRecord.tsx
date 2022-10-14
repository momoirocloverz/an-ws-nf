import React, { useState, useRef, useEffect } from 'react';
import { Modal, List, message, Button, Popconfirm, Select } from 'antd';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ButtonAuth from '@/components/ButtonAuth';
import ProTable, {ActionType} from '@ant-design/pro-table';
import CarouselImg from '@/components/CarouselImg';
import { deleteIntegralRecord, getScoreList, getRecord, auditRecord } from '@/services/integral';
import _ from 'lodash';
import styles from '../index.less';
import { history } from 'umi';
import { stringify } from 'querystring';

const { Option } = Select

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  onEdit: (record:{}) => void;
  values: any;
}

const ShowRecord: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onEdit, values } = props;
  const [ name, setName ] = useState('');
  const [ integral, setIntegral ] = useState(0);
  const [ publicIntegral, setPublicIntegral ] = useState(0);
  const recordActionRef = useRef<ActionType>();
  // 获取dataSource
  const getFamilyList = async (val:any) => {
    const valObj = { ...val };
    valObj['family_id'] = values.family_id
    if(values.integralTypeId) {
      valObj['item_name'] = values.integralTypeId
    }
    const _params = paginationHandle(valObj)
    const _data = await getRecord(_params)
    if (_data.code === 0) {
      const ownerName = _.get(_data, 'data.owner_info.owner_name', '')
      const allIntegral =  _.get(_data, 'data.owner_info.integral', 0)
      const publicity =  _.get(_data, 'data.publicity', 0)
      setName(ownerName)
      setIntegral(allIntegral)
      setPublicIntegral(publicity)
    }
    return tableDataHandle(_data)
  }
  /**
 * 删除
 * @param pic_id
 */
  const handleDelet = async (id: number) => {
    try {
      console.log(id,'id')
      const _data = await deleteIntegralRecord({ record_id: id })
      if (_data.code === 0) {
        message.success('删除成功');
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.error('删除失败');
      return false;
    }
  }

  // 获取打分项搜索
  useEffect(() => {
    getScore()
  },[])
  const [scoreList, setScoreList] = useState({});
  const [ initialValue, setInitialValue ] = useState(values.integralTypeId);
  const getScore = async () => {
    const _data:any = await getScoreList({});
    if (_data.code === 0) {
      const data = {}
      _data.data.forEach((item: any) => {
        data[item.item_id] = item.item_name;
      })
      setScoreList(data);
    }
  }

  // 审核通过
  const confirmRecord: any = async (id: number) => {
    const res = await auditRecord({ record_id: id })
    if (res.code === 0) {
      message.success('审核通过')
      return true
    } else {
      message.error(res.msg)
      return false
    }
  }

  const columns: any = [
    {
      title: '打分ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '打分日期',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '打分项',
      dataIndex: 'item_name',
      // hideInSearch: initialValue ? true : false,
      search: true,
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_: any, record: any) => {
        return <span>{record.item_name}</span>
      },
      initialValue: initialValue,
      valueEnum: scoreList,
    },
    {
      title: '打分方式',
      dataIndex: 'source',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_: any, record: any) => {
        return <span>{record.operate_name}</span>
      },
      valueEnum: {
        '1': '自动打分',
        '2': '人工打分',
        '3': '导入打分'
      },
      formItemProps: {
        allowClear: true
      }
    },
    {
      title: '分数',
      dataIndex: 'integral',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return <span>{record.direction === 'INCREASE' ? `+${record.integral}` : `-${record.integral}`}</span>
      }
    },
    {
      title: '证明图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      render: (_: any, record: any) => {
        return record['image_url'] && record['image_url'].length > 0 ? (
          <CarouselImg urlList={record.image_url} />
        ) : null
      }
    },
    {
      title: '积分状态',
      dataIndex: 'status',
      filterDropdownVisible: false,
      filterIcon: <div></div>,
      renderText: (_: any, record: any) => {
        return <span>{record.status}</span>
      },
      valueEnum: {
        '0': '公示期',
        '1': '已生效'
      },
      formItemProps: {
        allowClear: true
      }
    },
    {
      title: '检查时间',
      dataIndex: 'checked_at',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => (
        <>
          {
            record.operate_edit
            ? <ButtonAuth type="RECORD_EDIT">
              <a
                onClick={async() => {
                  await onEdit(record)
                  props.onRef(recordActionRef)
                }}
              >
                编辑
              </a>
              <br/>
            </ButtonAuth>
            : ""
          }
          {
            record.is_settle!=1? <ButtonAuth type={record.is_done === 0 ? 'RECORD_DELETE' : 'INTO_RECORD_DELETE'}>
            <a
              className={styles.colorTap}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: record.is_done === 0 ? '是否要删除该条信息？' : '你是否要删除该条已生效的积分记录，一经删除将无法恢复，请谨慎操作！',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record.id);
                    if (success) {
                      if (recordActionRef.current) {
                        recordActionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              删除
            </a>
            <br/>
          </ButtonAuth>:null
          }
         
          
          {
            record.is_done === 0 ? (
              <ButtonAuth type="RECORD_AUDIT">
                <Popconfirm
                  title="该条记录是否确认审核通过？"
                  placement="left"
                  onConfirm={async () => {
                    const success = await confirmRecord(record.id);
                    if (success) {
                      if (recordActionRef.current) {
                        recordActionRef.current.reload();
                      }
                    }
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="#">审核</a>
                </Popconfirm>
                <br/>
              </ButtonAuth>
            ) : null
          }
        </>
      )
    }
  ];

  // 跳转巡回记录管理
  const toTour = () => {
    history.push({
      pathname: '/customer/family/image',
      query: { owner: name }
    })
  }

  return (
    <Modal
      width={'70%'}
      destroyOnClose
      maskClosable= {false}
      title="积分记录"
      visible={modalVisible}
      bodyStyle={{padding: 0, background: '#f1f1f1'}}
      footer={[
        <Button key="back" onClick={onCancel}>
          关闭
        </Button>
      ]}
      onCancel={() => {
        onCancel();
      }}
    >
      <List bordered={false}>
        <List.Item>
          <div className={styles.integralHead}>
            <span>所属地区：{values.area}</span>
            <span>家庭户主: {name}</span>
            <span>当前已生效总积分: {integral}</span>
            <span>当前公示期积分: {publicIntegral}</span>
          </div>
        </List.Item>
      </List>
      <ProTable
        rowKey={'id'}
        headerTitle=""
        actionRef={recordActionRef}
        columns={columns}
        options={false}
        tableAlertRender={false}
        toolBarRender={() => [
          <ButtonAuth type="RECORD_PATROL">
            <Button type="primary" onClick={toTour}>
              跳转巡回记录管理
            </Button>
          </ButtonAuth>
        ]}
        request={(params) => getFamilyList(params)}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
    </Modal>
  );
};

export default ShowRecord;
