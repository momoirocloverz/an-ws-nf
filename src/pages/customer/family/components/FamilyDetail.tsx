import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Table, Cascader, Select, Upload, Button, message } from 'antd';
import { FamilyTableListItem } from '../data.d';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange } from '@/services/customer'
import _ from 'lodash'
import styles from '../index.less'

// const FormItem = Form.Item;
// const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  values: any;
  // chooseGroupList: any;
  // onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  onOk: () => void
  // accountInfo: any;
  // areaList: any;
}

const CreateFormFamily: React.FC<CreateFormProps> = (props) => {
  // const [form] = Form.useForm();
  const { modalVisible, onCancel, values, onOk } = props;
  const [ tableList, getList ] = useState([])
  // const [ areaResult, setAreaList ] = useState([])
  // const [ getGroupList, setGroupList ] = useState([])

  const [ info ] = useState({
    family_id: values.family_id,
    owner_name: values.owner_name,
    mobile: values.mobile,
    address: values.group + '-' + values.doorplate + '-' + values.grid,
    identity: values.identity,
    area: values.area,

    columns: [
      {
        title: '姓名',
        key: 'real_name',
        width: 100,
        render: (record:any) => (<p className={styles.listName}>{record.real_name == '' ? record.nickname : record.real_name}</p>),
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 140,
        key: 'mobile',
      },
      {
        title: '身份证',
        dataIndex: 'identity',
        key: 'identity',
      }
    ]
  });

  // const okHandle = async () => {
  //   const fieldsValue: any = await form.validateFields();
  //   if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
  //     fieldsValue.city_id = fieldsValue.area[0];
  //     fieldsValue.town_id = fieldsValue.area[1];
  //     fieldsValue.village_id = fieldsValue.area[2];
  //     delete fieldsValue.area;
  //   } else {
  //     fieldsValue.city_id = accountInfo.city_id
  //     fieldsValue.town_id = accountInfo.town_id
  //     fieldsValue.village_id = accountInfo.village_id
  //   }
  //   if(fieldsValue.identity){
  //     if(!(fieldsValue.identity.length === 15 || fieldsValue.identity.length ===18)){
  //       message.error('请输入正确的身份证号')
  //       return
  //     }
  //   }
  //   handleAdd({
  //     ...fieldsValue,
  //     isEdit,
  //     family_id: formValue.family_id,
  //     admin_id: accountInfo.admin_id
  //   });
  // };

  // 获取属地列表
  // const getAreaList = async () => {
  //   let _result: any = [...areaList];
  //   console.log(_result, 'result')
  //   if (accountInfo.role_type === 4) {
  //     _result[0].children.forEach((item: any) => {
  //       if (item.town_id === accountInfo.town_id) {
  //         _result[0].children = [item];
  //       }
  //     })
  //   }
  //   setAreaList(_result);
  //   if(accountInfo.role_type === 3) {
  //     setGroupList(chooseGroupList)
  //   } else {
  //     if(values.village_id) {
  //       getGroup([values.city_id, values.town_id, values.village_id])
  //     }
  //   }
  // }

  // 切换属地获取小组数据
  // const areaChange = async (e: any) => {
  //   form.setFieldsValue({
  //     'group_id': ''
  //   })
  //   getGroup(e)
  // }
  // // 小组数据调用
  // const getGroup = async (area: any[]) => {
  //   const _data = await getGroupChange({
  //     city_id: area[0],
  //     town_id: area[1],
  //     village_id: area[2]
  //   })
  //   if(_data.code === 0) {
  //     const _arr = _data.data || []
  //     setGroupList(_arr)
  //   }
  // }

  useEffect(() => {
    const list:any = [
      {
        name: 'John Brown',
        mobile: 32,
        id: 'New York No. 1 Lake Park'
      },
      {
        name: 'Jim Green',
        mobile: 42,
        id: 'London No. 1 Lake Park'
      },
      {
        name: 'Joe Black',
        mobile: 32,
        id: 'Sidney No. 1 Lake Park'
      },
    ];
    getList(list)
  }, [])

  return (
    <Modal
      maskClosable={false}
      width="60%"
      destroyOnClose
      title='家庭详情'
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => onOk()}
    >
      <div className={styles.listItem}>
        <div>
          <span>家庭户主姓名：</span>
          <span>{info.owner_name}</span>
        </div>
        <div>
          <span>户主电话：</span>
          <span>{info.mobile}</span>
        </div>
        <div>
          <span>户主身份证：</span>
          <span>{info.identity}</span>
        </div>
        <div>
          <span>所属地区：</span>
          <span>{info.area}</span>
        </div>
        <div>
          <span>详细属地：</span>
          <span>{info.address}</span>
        </div>
        <div>
          <span>家庭成员数量：</span>
          <span>{values.member.length}</span>
        </div>
        {
          values.member.length
          ? <div>
            <span>家庭成员信息：</span>
            <Table 
              columns={info.columns} 
              dataSource={values.member ? values.member : []} 
              pagination={false}
              className={styles.relatedPartyMaint}
              scroll={{ y: 240 }}
            />
          </div> 
          : ''
        }
      </div>
    </Modal>
  );
};

export default CreateFormFamily;
