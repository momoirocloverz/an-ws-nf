import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button, message } from 'antd';
import { FamilyTableListItem } from '../data.d';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange } from '@/services/customer'
import { values } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  chooseGroupList: any;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateEquity: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values } = props;

  const [formValue] = useState({
    title: values.title,
    url: values.url
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      isEdit,
      id: values.id
    });
  };


  useEffect(() => {
    // getAreaList();
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '编辑埋点' : '新建埋点'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="title"
          rules={[{ required: true, message: '请输入埋点名称，不得超过10位', max: 10 }]}
        >
          <Input placeholder="请输入埋点名称" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="链接"
          name="url"
          rules={[{ required: true, message: '请输入埋点链接' }]}
        >
          <Input placeholder="请输入埋点链接" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateEquity);
