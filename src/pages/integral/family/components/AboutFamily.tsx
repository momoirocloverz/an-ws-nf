import React, { useState, useRef, useEffect } from 'react';
import { Modal, List, message, Button, Popconfirm } from 'antd';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ButtonAuth from '@/components/ButtonAuth';
import ProTable, {ActionType} from '@ant-design/pro-table';
import CarouselImg from '@/components/CarouselImg';
import { deleteIntegralRecord, getScoreList, getRecord, auditRecord, integralDetail } from '@/services/integral';
import _ from 'lodash';
import styles from '../index.less';
import { history } from 'umi';
import ShowRecord from './ShowRecord';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  onEdit: (record:{}) => void;
  values: any;
}

const AboutFamily: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onEdit, values } = props;
  const [ area, setArea ] = useState('')
  const [ name, setName ] = useState('');
  const [ integral, setIntegral ] = useState(0);
  const [ pageParams, setPageParams ] = useState<any>({})
  const [ publicIntegral, setPublicIntegral ] = useState(0);
  const recordActionRef = useRef<ActionType>();
  const [ sec_modalVisible, handleModalVisibleSec ] = useState(false)
  const [ formValues, setFormValues ] = useState<any>({})


  // 获取列表数据
  const getList = async (val: any) => {
    const valObj = { ...val, item_id: values.item_id };
    if(valObj.created_at && valObj.created_at.length) {
      valObj.start_time = Date.parse(valObj.created_at[0]) / 1000
      valObj.end_time = Date.parse(valObj.created_at[1]) / 1000
    }
    console.log(valObj, 'valObj')
    // // valObj['family_id'] = values.family_id;
    const _params = paginationHandle(valObj);
    setPageParams(_params)
    const _data = await integralDetail(_params);
    console.log(_data, 'data')
    // if (_data.code === 0) {
    //   // const ownerName = _.get(_data, 'data.owner_info.owner_name', '');
    //   // const allIntegral =  _.get(_data, 'data.owner_info.integral', 0);
    //   // const publicity =  _.get(_data, 'data.publicity', 0);
    //   // setName(ownerName);
    //   // setIntegral(allIntegral);
    //   // setPublicIntegral(publicity);
    // }
    return tableDataHandle(_data)
    console.log(tableDataHandle(_data), 'datadatadata')
  }

//   /**
//  * 删除
//  * @param pic_id
//  */
//   const handleDelet = async (id: number) => {
//     try {
//       console.log(id,'id')
//       const _data = await deleteIntegralRecord({ record_id: id })
//       if (_data.code === 0) {
//         message.success('删除成功');
//         return true;
//       } else {
//         message.error(_data.msg);
//         return false;
//       }
//     } catch (err) {
//       message.error('删除失败');
//       return false;
//     }
//   }

  // 获取打分项搜索
  useEffect(() => {
    // getScore()
  },[])

  // const [scoreList, setScoreList] = useState({});
  // const getScore = async () => {
  //   const _data:any = await getScoreList({});
  //   if (_data.code === 0) {
  //     const data = {}
  //     _data.data.forEach((item: any) => {
  //       data[item.item_id] = item.item_name
  //     })
  //     setScoreList(data);
  //   }
  // }

  // 审核通过
  // const confirmRecord: any = async (id: number) => {
  //   const res = await auditRecord({ record_id: id })
  //   if (res.code === 0) {
  //     message.success('审核通过')
  //     return true
  //   } else {
  //     message.error(res.msg)
  //     return false
  //   }
  // }

  const columns: any = [
    {
      title: '家庭ID',
      dataIndex: 'family_id',
      hideInSearch: true,
    },
    {
      title: '户主姓名',
      dataIndex: 'owner_name'
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '身份证号',
      dataIndex: 'identity'
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: true
    },
    {
      title: '累计打分次数',
      dataIndex: 'times',
      hideInSearch: true
    },
    // {
    //   title: '打分时间',
    //   dataIndex: 'created_at',
    //   valueType: 'dateTimeRange'
    // },
    {
      title: '累计打分值',
      dataIndex: 'score',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => (
        <>
          <ButtonAuth type="FAMILY_INTEGRAL_RECORD">
            <a
              onClick={() => {
                handleModalVisibleSec(true)
                setFormValues({...record, integralTypeId: values.item_id.toString() })
              }}
            >
              积分记录
            </a>
          </ButtonAuth>
        </>
      )
    }
  ];

  // // 跳转巡回记录管理
  // const toTour = () => {
  //   history.push({
  //     pathname: '/customer/family/image',
  //     query: { owner: name }
  //   })
  // }

  // 导出
  const exportList = async () => {
    window.open('/farmapi/gateway?api_name=export_item_detail&version=1.2.0&os=h5&sign&item_id='
      + values.item_id
      + (pageParams.owner_name ? '&owner_name=' + pageParams.owner_name : '')
      + (pageParams.mobile ? '&mobile=' + pageParams.mobile : '') 
      + (pageParams.identity ? '&identity=' + pageParams.identity : '')
      + (pageParams.start_time ? '&start_time=' + pageParams.start_time : '')
      + (pageParams.end_time ? '&end_time=' + pageParams.end_time : '')
    )
  }

  const onRecordRef = async () => {

  }

  return (
    <Modal
      width={1200}
      destroyOnClose
      maskClosable= {false}
      title="参与家庭列表"
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
            <span>参与家庭数: {values.family_count}</span>
            <span>所属地区：{values.area}</span>
            <span>打分项: {values.item_name}</span>
            <span>打分类型：{values.direction === 'INCREASE' ? '加分' : '减分'}</span>
            <span>分值: {values.point}</span>
          </div>
        </List.Item>
      </List>
      <ProTable
        rowKey={'family_id'}
        headerTitle=""
        actionRef={recordActionRef}
        columns={columns}
        options={false}
        tableAlertRender={false}
        toolBarRender={() => [
          <ButtonAuth type="EXPORT_ABOUT_FAMILY">
            <Button type="primary" onClick={exportList}>
              导出
            </Button>
          </ButtonAuth>
        ]}
        request={(params) => getList(params)}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
      />
      {
        sec_modalVisible ? (
          <ShowRecord
            onRef={onRecordRef}
            values={formValues}
            onCancel={() => {
              handleModalVisibleSec(false);
              setFormValues({});
            }}
            modalVisible={sec_modalVisible}
          />
        ) : null
      }
    </Modal>
  );
};

export default AboutFamily;
