import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Cascader, Switch, Select, Upload, Button, message } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
// import { getGroupChange, getDoorplateChange, getFamilyList } from '@/services/customer';
// import { integralGoodsList } from '@/services/integral'

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  familyList:any;
  dispatch: Dispatch;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  areaList: any;
  accountInfo: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    areaList,
    familyList,
    dispatch,
    accountInfo
  } = props;

  const [formValue, setFormValue] = useState({
    id: values.id,
    min: values.min,
    max: values.max,
    show: values.show === 1 ? true : false,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id, values.town_id, values.village_id] : [],
  });
  // const [areaResult, setAreaResult] = useState([]);
  // const [getGroupList, setGroupList] = useState([]);
  // const [getFamilylist, setFamilyList] = useState(familyList);
  // const [getGoodsList, setGoodsList] = useState([]);


  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    console.log(fieldsValue, 'fieldsvalue')
    if(fieldsValue.min >= fieldsValue.max) {
      message.error('请输入正确的积分范围')
      return
    }
    fieldsValue.show ? fieldsValue.show = 1 : fieldsValue.show = 0
    if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
      fieldsValue.city_id = fieldsValue.area[0];
      fieldsValue.town_id = fieldsValue.area[1];
      fieldsValue.village_id = fieldsValue.area[2];
      delete fieldsValue.area;
    } else {
      fieldsValue.city_id = accountInfo.city_id
      fieldsValue.town_id = accountInfo.town_id
      fieldsValue.village_id = accountInfo.village_id
    }
    handleAdd({
      ...fieldsValue,
      id: formValue.id,
      sort: 0,
      admin_id: accountInfo.admin_id
    })
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader options={areaList} />
            </FormItem>
          ) : null
        }
        <FormItem label="积分范围" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          <FormItem
            noStyle
            name="min"
          >
            <InputNumber precision={0} min={0} max={99999} placeholder="0"/>
          </FormItem>
          <span> - </span>
          <FormItem
            noStyle
            name="max"
          >
            <InputNumber precision={0} placeholder="99999"/>
          </FormItem>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="是否显示"
          name="show"
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ info, user }: ConnectState) => ({
  familyList: info.familyList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);
