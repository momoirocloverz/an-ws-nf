import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Upload, message, Button, DatePicker, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL } from '@/services/api';
import { getLocalToken } from '@/utils/utils';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Moment from 'moment';


const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CreateFormProps {
  modalVisible: boolean;
  values: any;
  isEdit: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateLease: React.FC<CreateFormProps> = (props) => {
  const [ form ] = Form.useForm();
  
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    accountInfo,
  } = props;
  const dateFormat = 'YYYY/MM/DD';
  const [formValue, setFormValue] = useState({
    id: values.id || null,
    contractor: values.contractor,
    phone: values.phone,
    date: values.start_date ? [
      Moment(values.start_date, dateFormat),
      Moment(values.end_date, dateFormat)
    ] : '',
    remarks: values.remarks,
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (isEdit) {
      fieldsValue.id = formValue.id;
    }
    fieldsValue.city_id = accountInfo.city_id
    fieldsValue.town_id = accountInfo.town_id
    fieldsValue.village_id = accountInfo.village_id
    fieldsValue.start_date = fieldsValue.date[0].format('YYYY/MM/DD');
    fieldsValue.end_date = fieldsValue.date[1].format('YYYY/MM/DD');
    delete fieldsValue.date;
    form.resetFields();
    handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
  };

  const disabledDate = (current) => {
    return current && Moment().startOf('day') >= current;
  }

  return (
    <Modal
      width={900}
      destroyOnClose
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
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="承包人"
          name="contractor"
          rules={[{ required: true, message: '超出长度，最多10个字符', max: 10 }]}
        >
          <Input placeholder="请输入承包人" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系电话"
          name="phone"
          rules={[{ required: true, message: '请输入联系电话'}]}
        >
          <Input placeholder="请输入联系电话" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="承包日期"
          name="date"
          rules={[{ type: 'array' as const, required: true, message: '请选择日期' }]}
        >
          <RangePicker disabledDate={disabledDate} style={{width: '60%'}} format={dateFormat}/>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="备注"
          name="remarks"
          rules={[{ required: true, message: '请输入100字以内的备注', max: 100 }]}
        >
          <TextArea placeholder="请输入备注" rows={4} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(CreateLease);