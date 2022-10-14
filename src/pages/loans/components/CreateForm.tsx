import React, { useState } from 'react';
import Moment from 'moment';
import {
  Form,
  Modal,
  InputNumber,
  Input,
  DatePicker,
  Cascader,
  Select,
  Row,
  Col,
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
    ...values,
    year: year,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []
  });
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    fieldsValue['year'] = Moment(fieldsValue.year).format('YYYY')
    fieldsValue.mobile = Number(fieldsValue.mobile);
    if (isEdit) {
      fieldsValue['id'] = values.id;
      fieldsValue['family_id'] = values.family_id;
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

  // 限制2位小数
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
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="户主姓名"
              name="owner_name"
              rules={[{ required: !isEdit, message: '请填写户主姓名' }]}
            >
              {isEdit ?
                  formValue. owner_name
                : 
                  <Input placeholder="户主姓名" maxLength={11} />
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="户主手机号"
              name="mobile"
              rules={[
                { required: !isEdit, message: '请输入手机号' },
                { min: 11}
              ]}
            >
              {isEdit ?
                  formValue. mobile
                : 
                <Input placeholder="请输入手机号" maxLength={11} minLength={11} />
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="善治积分"
              name="integral"
              rules={[{ required: !isEdit, message: '请填写积分数' }]}
            >
              {isEdit ?
                  formValue. integral
                : 
                <InputNumber step={1} max={99999} formatter={limitDecimals} min={0} style={{width: '100%'}}  placeholder="请填写积分数" />
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: !isEdit, message: '请选择属地' }]}
            >
              { 
                isEdit ?
                  values. area
                :
                <Cascader options={areaList} />
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="门牌号"
              name="doorplate"
              rules={[{ required: !isEdit, message: '请填写门牌号' }]}
            >
              {isEdit ?
                  formValue. doorplate 
                : 
                <Input placeholder="请输入门牌号" maxLength={11} minLength={11} />
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="户主身份证"
              name="identity"
              // rules={[{validator: (_, value) => value.length === 15 || value.length === 18  ? Promise.resolve() : Promise.reject('请输入正确的身份证号')}]}
            >
              <Input placeholder="请输入户主身份证" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="授信人姓名"
              name="name"
              rules={[{ required: !isEdit, message: '请输入授信人姓名' }]}
            >
              <Input placeholder="请输入授信人姓名" maxLength={10} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="与户主关系"
              name="relation"
              rules={[{ required: !isEdit, message: '请输入户住姓名' }]}
            >
              <Select>
                <Option value="妻子">妻子</Option>
                <Option value="儿子">儿子</Option>
                <Option value="女儿">女儿</Option>
                <Option value="本人">本人</Option>
                <Option value="女婿">女婿</Option>
                <Option value="养女">养女</Option>
                <Option value="养子">养子</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="授信额度"
              name="quota"
              rules={[{ required: !isEdit, message: '请输入授信额度' }]}
            >
              <Input placeholder="请输入授信额度" maxLength={15} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="年份"
              name="year"
              rules={[{ required: true, message: '请选择年份' }]}
            >
              <DatePicker picker="year" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="授信利率"
              name="credit_rate"
              rules={[{ required: !isEdit, message: '请输入授信利率' }]}
            >
              <Input placeholder="请输入授信利率" maxLength={15} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="授信有效时间"
              name="credit_time"
              rules={[{ required: !isEdit, message: '请输入授信时间' }]}
            >
              <Input placeholder="请输入授信有效时间" maxLength={15} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  // chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);
