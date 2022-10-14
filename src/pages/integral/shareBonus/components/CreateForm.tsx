import React, { useState } from 'react';
import Moment from 'moment';
import {
  Form,
  Modal,
  InputNumber,
  Input,
  DatePicker,
  Cascader,
  message
} from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import _ from 'lodash';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  isEdit: boolean;
  values: any;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, accountInfo, areaList } = props;
  let year = values.year ? Moment(values.year.toString()) : ''
  const [formValue] = useState({
    owner_name: values.owner_name,
    mobile: values.mobile,
    identity: values.identity,
    doorplate: values.doorplate,
    grid: values.grid,
    stock_number: values.stock_number,
    dividend: values.dividend,
    integral: values.integral,
    integral_bonus: values.integral_bonus,
    year: year,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []
  });
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    fieldsValue['year'] = Moment(fieldsValue.year).format('YYYY')
    fieldsValue.mobile = Number(fieldsValue.mobile);
    if (isEdit) {
      fieldsValue['stock_id'] = values.id
    }
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
    if(fieldsValue.identity){
      if(!(fieldsValue.identity.length === 15 || fieldsValue.identity.length ===18)){
        message.error('请输入正确的身份证号')
        return
      }
    }
    handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
  };

  // 限制2位小输
  const limit = (value: any): string => {
    const reg = /^(\-)*(\d+)\.(\d\d).*$/;
    if(typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    } else {
      return ''
    }
  };

  // 限制正整数
  const limitDecimals = (value: any): string => {
    const reg = /^(0+)|[^\d]+/g;
    if(typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1') : ''
    } else if(typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1') : ''
    } else {
      return ''
    }
  }

  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable= {false}
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
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
              <Cascader disabled={isEdit ? true : false} options={areaList} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="户主姓名"
          name="owner_name"
          rules={[{ required: true, message: '请输入户住姓名' }]}
        >
          <Input disabled={isEdit ? true : false} placeholder="请输入户住姓名" maxLength={10} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="户主身份证"
          name="identity"
          // rules={[{ required: true, message: '请输入户主身份证号'}]}
        >
          <Input placeholder="请输入身份证号" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号"
          name="mobile"
          rules={[
            { required: true, message: '请输入手机号' },
            { min: 11}
          ]}
        >
          <Input disabled={isEdit ? true : false} placeholder="请输入手机号" maxLength={11} minLength={11} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="门牌号"
          name="doorplate"
          rules={[{ required: true, message: '请输入门牌号' }]}
        >
          <Input disabled={isEdit ? true : false} placeholder="请输入门牌号" maxLength={15} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="所属网格"
          name="grid"
          rules={[{ required: true, message: '请输入所属网格' }]}
        >
          <Input disabled={isEdit ? true : false} placeholder="请输入所属网格" maxLength={15} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="股数"
          name="stock_number"
          rules={[{ required: true, message: '请填写股数' }]}
        >
          <InputNumber step={1} max={99999} formatter={limitDecimals} min={0} style={{width: '100%'}}  placeholder="请填写股数" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="积分数"
          name="integral"
          rules={[{ required: true, message: '请填写股数' }]}
        >
          <InputNumber step={1} max={99999} formatter={limitDecimals} min={0} style={{width: '100%'}}  placeholder="请填写积分数" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="基本股分红"
          name="dividend"
          rules={[{ required: true, message: '请填写基本股分红' }]}
        >
          <InputNumber step={0.01} formatter={limit} max={99999999} min={0} style={{width: '100%'}}  placeholder="请填写基本股分红" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="积分分红"
          name="integral_bonus"
          rules={[{ required: true, message: '请填写积分分红' }]}
        >
          <InputNumber step={0.01} formatter={limit} max={99999999} min={0} style={{width: '100%'}}  placeholder="请填写积分分红" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="年份"
          name="year"
          rules={[{ required: true, message: '请选择年份' }]}
        >
          <DatePicker picker="year" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  // chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);
