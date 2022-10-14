import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange, getDoorplateChange } from '@/services/customer';
import styles from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  // isEdit: boolean;
  values: any;
  // familyList:any;
  // dispatch: Dispatch;
  // onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  onOk: () => void;
  // areaList: any;
  // accountInfo: any;
}

const EditUserInfo: React.FC<CreateFormProps> = (props) => {
  // const [form] = Form.useForm();
  const {
    modalVisible,
    // onSubmit: handleAdd,
    onCancel,
    onOk,
    values,
    // accountInfo
  } = props;

  // const [formValue, setFormValue] = useState({
  //   // user_id: values.user_id,
  //   // real_name: values.real_name,
  //   // nickname: values.nickname,
  //   // identity: values.identity,
  //   // mobile: values.mobile,
  //   // avatar: values.avatar,
  //   // group_id: values.family.group_id,
  //   // doorplate: values.family.doorplate,
  //   // area: values.village_id ? [values.city_id,values.town_id,values.village_id] : []
  //   auth: values.auth
  // });
  // const [getGroupList, setGroupList] = useState([])
  // const [getFamilyList, setFamilyList] = useState([])

  // 提交表单
  // const okHandle = async () => {
  //   const fieldsValue: any = await form.validateFields();
  //   handleAdd({
  //     ...fieldsValue,
  //     user_id: formValue.user_id
  //   })
  // }
  
  // const getAreaList = async () => {
  //   var area = []
  //   if(!formValue.area.length) {
  //     area = [accountInfo.city_id, accountInfo.town_id, accountInfo.village_id]
  //   } else {
  //     area = formValue.area
  //   }
  //   getGroup(area)
  //   if(formValue.group_id) {
  //     getDoorplate(area, formValue.group_id)
  //   }
  // }

  // const selectDoorplate = async (e: any) => {
  //   var area = form.getFieldValue('area')
  //   form.setFieldsValue({
  //     'doorplate': ''
  //   })
  //   getDoorplate(area, e)
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
  // // 家庭门牌号数据调用
  // const getDoorplate = async (area: any[], group_id: String) => {
  //   const _data = await getDoorplateChange({
  //     city_id: area[0],
  //     town_id: area[1],
  //     village_id: area[2],
  //     group_id: group_id
  //   })
  //   if(_data.code === 0) {
  //     const _arr = _data.data || []
  //     setFamilyList(_arr)
  //   }
  // }

  useEffect(() => {
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width="50%"
      title='农户详情'
      visible={modalVisible}
      onOk={() => onOk()}
      onCancel={() => onCancel()}
    >
      <div className={styles.listItem}>
        <div>
          <span>农户姓名：</span>
          <span>{values.farmer_name}</span>
        </div>
        <div>
          <span>农户昵称：</span>
          <span>{values.nickname}</span>
        </div>
        <div>
          <span>身份证号：</span>
          <span>{values.identity}</span>
        </div>
        <div>
          <span>手机号：</span>
          <span>{values.mobile}</span>
        </div>
        <div>
          <span>头像：</span>
          <div className={styles.imgBox}>
            <img src={values.avatar}/>
          </div>
        </div>
        <div>
          <span>是否分配家庭：</span>
          <span>{values.allot}</span>
        </div>
        <div>
          <span>所属家庭：</span>
          <span>{values.family ? values.family.owner_name : ''}</span>
        </div>
        <div>
          <span>所属小组：</span>
          <span>{values.family ? values.family.group_name : ''}</span>
        </div>
        <div>
          <span>门牌号：</span>
          <span>{values.family ? values.family.doorplate : ''}</span>
        </div>
        <div>
          <span>所属地区：</span>
          <span>{values.city_town}</span>
        </div>
        <div>
          <span>是否是巡查员：</span>
          <span>{values.inspect == 1 ? '是' : '否'}</span>
        </div>
        <div>
          <span>授权管理村：</span>
          {
            values.auth && values.auth.length 
            ? <div className={styles.scrollBox}>
                {
                  values.auth ? values.auth.map((item:any) => {
                    return <p>{item.area}</p>
                  }) : ''
                }
              </div>
            : '无'
          }
        </div>
      </div>
    </Modal>
  );
}

export default EditUserInfo;
