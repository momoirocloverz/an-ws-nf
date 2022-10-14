import React, { useState } from 'react';
import { Form, Input, Modal, } from 'antd';

const FormItem = Form.Item;
export interface chidrenValueType {
  label: string;
  describe?: string;
  value: string;
  id: number;
}

interface CreateFormProps {
  values: chidrenValueType;
  title: string; 
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  isEdit: boolean;
}

const CreateChildren: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    values,
    title,
    isEdit
  } = props;
  const [formValue] = useState<chidrenValueType>({
    label: values.label,
    value: values.value,
    describe: values.describe,
    id: values.id
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (isEdit) {
      fieldsValue.auth_id = values.id;
    }
    form.resetFields();
    handleAdd(fieldsValue);
  };

  const cancleForm = () => {
    form.resetFields();
    onCancel();
  }

  return (
    <Modal
      width={800}
      destroyOnClose
      title={title}
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={cancleForm}
    >
      <Form 
        form={form}
        initialValues={formValue}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="权限名称"
          name="label"
          rules={[{ required: true, message: '请输入10个字以内的权限名称！', max: 10 }]}
        >
          <Input placeholder="请输入权限名称,不超过10个字" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="权限标识"
          name="value"
          rules={[{ required: true, message: '请输入权限标识' }]}
          >
          <Input placeholder="请输入权限标识" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="权限描述"
          name="describe"
        >
          <Input placeholder="请输入权限描述" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateChildren;

